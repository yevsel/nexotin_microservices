import os
import socket
import time

import redis
from celery import Celery

# The single connection point, same idea as app/celery_app.py.
# broker   = where messages are queued  (RabbitMQ)
# backend  = where results are stored   (Redis)
app = Celery(
    "lab",
    broker=os.getenv("CELERY_BROKER_URL", "amqp://guest:guest@localhost:5672//"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"),
)

app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # Without this, the worker crashes on startup if RabbitMQ isn't ready yet.
    broker_connection_retry_on_startup=True,
)

# Redis is used here as a plain counter store for the stress test.
# The API creates counters, each task bumps them, the API reads them back.
REDIS_URL = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)


# ---------------------------------------------------------------- fast task
# Almost no work. Good for measuring raw message throughput.
@app.task
def add(x: int, y: int) -> int:
    return x + y


# ---------------------------------------------------------------- slow task
# Pretends to be "send an email" or "resize an image": burns N seconds.
@app.task
def slow_job(job_id: int, seconds: float = 1.0) -> dict:
    started = time.time()
    time.sleep(seconds)
    return {
        "job_id": job_id,
        "worker_pid": os.getpid(),
        # PID numbers repeat across containers, so the hostname is needed to
        # tell real worker processes apart.
        "worker": socket.gethostname(),
        "seconds": round(time.time() - started, 2),
    }


# ------------------------------------------------------------ stress task
# One task per job. It sleeps, then bumps the "done" counter for its batch.
# batch_id groups tasks together so one HTTP call can start thousands of them
# and still report progress.
@app.task
def stress_job(batch_id: str, job_id: int, seconds: float) -> None:
    try:
        time.sleep(seconds)
        redis_client.hincrby(f"stress:batch:{batch_id}", "done", 1)
    except Exception:
        # Count failures too, so the batch can still reach 100%.
        redis_client.hincrby(f"stress:batch:{batch_id}", "failed", 1)
        raise


# ------------------------------------------------------------- flaky task
# Fails deliberately on the first attempts so you can watch RETRY in Flower.
# bind=True gives access to `self` (the task instance) so we can read
# `self.request.retries` — how many times this exact task already retried.
@app.task(bind=True, max_retries=3, default_retry_delay=3)
def flaky_job(self, job_id: int, fail_times: int = 2) -> str:
    if self.request.retries < fail_times:
        # raise + self.retry() = put the message back on the shelf and try later
        raise self.retry(
            exc=RuntimeError(
                f"job {job_id} failed on attempt {self.request.retries + 1}"
            ),
        )
    return f"job {job_id} succeeded after {self.request.retries} retries"
