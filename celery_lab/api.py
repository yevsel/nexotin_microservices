import os
import time
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse

from tasks import app as celery_app
from tasks import flaky_job, redis_client, slow_job, stress_job

fastapi_app = FastAPI(
    title="Celery Lab",
    description="Hit /stress-test and watch RabbitMQ + Celery handle the load.",
)


def batch_key(batch_id: str) -> str:
    return f"stress:batch:{batch_id}"


def batch_state(batch_id: str) -> dict:
    """Read the counters for one batch and turn them into a status report."""
    raw = redis_client.hgetall(batch_key(batch_id))
    if not raw:
        raise HTTPException(status_code=404, detail="unknown batch id")

    total = int(raw["total"])
    done = int(raw.get("done", 0))
    failed = int(raw.get("failed", 0))
    seconds = float(raw.get("seconds", 0))
    started_at = float(raw["started_at"])

    elapsed = time.time() - started_at
    finished = done + failed
    remaining = total - finished

    return {
        "batch_id": batch_id,
        "total": total,
        "seconds_per_task": seconds,
        "done": done,
        "failed": failed,
        "remaining": remaining,
        "percent": round((finished / total) * 100, 1) if total else 0,
        "elapsed": round(elapsed, 2),
        "throughput_tasks_per_sec": round(done / elapsed, 2) if elapsed > 0 else 0,
        "finished": remaining <= 0,
        "workers": len(celery_app.control.ping(timeout=1)),
    }


@fastapi_app.get("/")
def root() -> dict:
    return {
        "message": "Celery lab",
        "start": "GET /stress-test?count=200&seconds=1",
        "status": "GET /stress-test/{batch_id}",
        "queue": "GET /queue",
        "status": "GET /status",
        "flaky": "GET /flaky?count=3",
        "flower": "http://localhost:5557",
        "rabbitmq": "http://localhost:15673",
    }


@fastapi_app.get("/stress-test")
def stress_test(count: int = 200, seconds: float = 1.0) -> dict:
    """Fire `count` tasks and return immediately.

    This is the whole point: the HTTP call does not wait for the work.
    It only puts messages on RabbitMQ.
    """
    batch_id = uuid.uuid4().hex[:8]

    # Create the counters BEFORE publishing, so a task can never finish
    # before its batch row exists.
    redis_client.hset(
        batch_key(batch_id),
        mapping={
            "total": count,
            "done": 0,
            "failed": 0,
            "seconds": seconds,
            "started_at": time.time(),
        },
    )

    publish_start = time.time()

    # One .delay() per job = one message on the queue.
    for job_id in range(count):
        stress_job.delay(batch_id, job_id, seconds)

    publish_elapsed = time.time() - publish_start

    return {
        "batch_id": batch_id,
        "published": count,
        "publish_seconds": round(publish_elapsed, 3),
        "messages_per_sec": round(count / publish_elapsed) if publish_elapsed else 0,
        "status_url": f"/stress-test/{batch_id}",
        "note": "The HTTP call is already done. The worker is still working.",
    }


@fastapi_app.get("/stress-test/{batch_id}")
def stress_status(batch_id: str) -> dict:
    return batch_state(batch_id)


@fastapi_app.get("/status")
def status() -> dict:
    """The whole picture in one call.

    RabbitMQ knows what is waiting. Workers know what is running.
    Neither knows the other, so we ask both.
    """
    # 1. Ask RabbitMQ for the queue contents.
    with celery_app.connection_for_read() as connection:
        channel = connection.default_channel
        try:
            _, ready, consumers = channel.queue_declare(
                queue="celery",
                passive=True,
            )
        except Exception:
            ready, consumers = 0, 0

    # 2. Ask every worker what it is doing right now.
    #    inspect() is a control broadcast over RabbitMQ (the pidbox queue).
    inspector = celery_app.control.inspect(timeout=2)
    active = inspector.active() or {}
    stats = inspector.stats() or {}

    workers = []
    for name in sorted(set(active) | set(stats)):
        running = active.get(name, [])
        worker_stats = stats.get(name, {})
        total = worker_stats.get("total", {})
        workers.append(
            {
                "name": name,
                "running_now": len(running),
                "running_tasks": [task["name"] for task in running],
                "pool_concurrency": worker_stats.get("pool", {}).get(
                    "max-concurrency"
                ),
                "processed_total": total,
            }
        )

    return {
        "rabbitmq": {
            "queue": "celery",
            "ready": ready,
            "consumers": consumers,
        },
        "workers": workers,
        "legend": {
            "ready": "messages waiting in RabbitMQ right now",
            "running_now": "tasks a worker is executing at this instant",
            "processed_total": "tasks finished since that worker started",
        },
    }


@fastapi_app.get("/queue")
def queue_depth() -> dict:
    """Ask RabbitMQ how many messages are still waiting in the queue."""
    with celery_app.connection_for_read() as connection:
        channel = connection.default_channel
        try:
            # passive=True means "tell me about it, don't create it".
            _, messages, consumers = channel.queue_declare(
                queue="celery",
                passive=True,
            )
        except Exception:
            return {"queue": "celery", "messages": 0, "consumers": 0}
    return {"queue": "celery", "messages": messages, "consumers": consumers}


@fastapi_app.get("/queue/raw", response_class=HTMLResponse)
def queue_raw() -> str:
    """One line per waiting message, straight off the queue."""
    with celery_app.connection_for_read() as connection:
        channel = connection.default_channel
        rows = []
        while True:
            method, properties, body = channel.basic_get(queue="celery")
            if method is None:
                break
            rows.append(body.decode()[:300])
            # Put it back so the worker still gets it.
            channel.basic_nack(method.delivery_tag, requeue=True)

    if not rows:
        return "<pre>queue is empty</pre>"

    return "<pre>" + "\n\n".join(rows[:20]) + "</pre>"


@fastapi_app.get("/one-task/{seconds}")
def one_task(seconds: float) -> dict:
    """Send a single task and return its id. Watch it in Flower."""
    result = slow_job.delay(0, seconds)
    return {"task_id": result.id, "seconds": seconds}


@fastapi_app.get("/flaky")
def flaky(count: int = 3, fail_times: int = 2) -> dict:
    """Send tasks that fail on purpose, so you can watch RETRY in Flower."""
    task_ids = [flaky_job.delay(i, fail_times).id for i in range(count)]
    return {
        "sent": count,
        "fails_before_success": fail_times,
        "task_ids": task_ids,
        "watch": "http://localhost:5557 -> Tasks",
    }
