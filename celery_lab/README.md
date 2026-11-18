# Celery + RabbitMQ lab

A separate playground. It does not touch `nexotin_python`.

**Everything is one HTTP call.** No CLI commands needed.

```
http://localhost:8001/stress-test?count=200&seconds=1
```

| Thing | URL |
|---|---|
| Stress test | http://localhost:8001/stress-test?count=200&seconds=1 |
| Flower | http://localhost:5557 |
| RabbitMQ UI | http://localhost:15673 |

RabbitMQ login: `lab` / `lab_password`

## Start

```bash
cd /Users/yevsel/Desktop/dev/celery_lab
docker compose up -d --build
```

## The files

| File | What it is |
|---|---|
| `tasks.py` | the worker side: the `Celery(...)` connection + the task functions |
| `api.py` | the HTTP side: routes that call `.delay()` |
| `docker-compose.yml` | RabbitMQ, Redis, worker, API, Flower |
| `Dockerfile` | installs the dependencies once |

`tasks.py` and `api.py` are **two different programs**. `api.py` imports
`tasks.py` only to get `.delay()` — it never runs the task body. The worker is
the only thing that does.

## The routes

| Route | What it does |
|---|---|
| `GET /` | list of routes |
| `GET /stress-test?count=200&seconds=1` | publishes `count` tasks, returns **immediately** |
| `GET /stress-test/{batch_id}` | progress: done, failed, %, throughput |
| `GET /queue` | how many messages are waiting in RabbitMQ |
| `GET /queue/raw` | the actual raw message bodies |
| `GET /one-task/{seconds}` | one task, to watch in Flower |
| `GET /flaky?count=3` | tasks that fail on purpose, to watch RETRY |

---

# Scenario 1 — the phone does not wait

Open in a browser:

```
http://localhost:8001/stress-test?count=200&seconds=1
```

Measured:

```json
{
  "batch_id": "a8ccc418",
  "published": 200,
  "publish_seconds": 0.091,
  "messages_per_sec": 2209,
  "status_url": "/stress-test/a8ccc418",
  "note": "The HTTP call is already done. The worker is still working."
}
```

**The whole HTTP call took 0.113 seconds.** 200 messages were handed to
RabbitMQ. The emails/work have not started yet.

Check the queue immediately:

```
http://localhost:8001/queue
```

```json
{"queue": "celery", "messages": 180, "consumers": 1}
```

180 still waiting. 20 already grabbed by the worker.

This is exactly what your signup route does: publish, reply, move on.

# Scenario 2 — watch it drain

```
http://localhost:8001/stress-test/a8ccc418
```

Refresh it every few seconds:

```json
{"done": 8,   "remaining": 192, "percent": 4.0,  "throughput_tasks_per_sec": 2.96}
{"done": 32,  "remaining": 168, "percent": 16.0, "throughput_tasks_per_sec": 3.66}
{"done": 80,  "remaining": 120, "percent": 40.0, "throughput_tasks_per_sec": 3.84}
{"done": 200, "remaining": 0,   "percent": 100.0, "finished": true}
```

200 tasks x 1 second each, finished in ~71 seconds. With `concurrency=4` you
would expect ~50s; the extra is Docker overhead on macOS plus per-task logging.
Shorter runs measure closer to 4/sec.

# Scenario 3 — make the worker weird

Watching this is the fastest way to understand the split.

**Kill the worker, then stress test:**

```bash
docker compose stop worker
```

```
http://localhost:8001/stress-test?count=100&seconds=1
```

It still returns instantly, `published: 100`. Now:

```
http://localhost:8001/queue
```

```json
{"queue": "celery", "messages": 100, "consumers": 0}
```

100 messages sitting in RabbitMQ. **Zero consumers. Nothing is lost.**
Refresh for a minute — it stays 100. The API is healthy the whole time.

**Now start it again:**

```bash
docker compose start worker
```

Refresh `/queue`. 100 → 84 → 61 → ... → 0. The worker eats the backlog it
never saw.

**This is why your signup never fails because of Gmail.** The note waits on the
shelf.

# Scenario 4 — see the actual messages

With a backlog in the queue:

```
http://localhost:8001/queue/raw
```

```
{"task": "tasks.stress_job", "id": "...", "args": ["f3a91c", 42, 1.0], ...}
```

That is all RabbitMQ has ever seen: a JSON blob. It does not know Python, does
not know what an email is. Compare that with Flower at
http://localhost:5557, which shows `stress_job`, its state, and its runtime.

# Scenario 5 — concurrency

Default is 4 child processes. Change it:

```bash
CONCURRENCY=8 docker compose up -d worker
```

Then run the same stress test. Roughly double the throughput, half the time.

```bash
docker compose up -d worker    # back to 4
```

# Scenario 6 — more worker containers

```bash
docker compose up -d --scale worker=3
```

3 containers x 4 children = 12 processes pulling from the same queue. Run the
same stress test and watch `throughput_tasks_per_sec` jump.

```bash
docker compose up -d --scale worker=1
```

Why not exactly 12x? **Prefetch.** Each worker grabs a batch of messages ahead
of time, so it can sit on work while another idles.
`--prefetch-multiplier=1` fixes that in real workloads.

# Scenario 7 — retries

```
http://localhost:8001/flaky?count=3
```

Then open http://localhost:5557 → Tasks. Each task goes `RETRY` twice, waits 3
seconds, then `SUCCESS`.

This is your email task when Gmail is down.

---

## The mental model, one last time

| Step | What happens |
|---|---|
| 1 | `GET /stress-test` runs in the **API** process |
| 2 | It loops and calls `.delay()` 200 times |
| 3 | Each `.delay()` writes a JSON message to **RabbitMQ** |
| 4 | The route returns `200 OK` — done, 0.11s |
| 5 | **Worker** processes pull messages and run `stress_job` |
| 6 | Each task bumps a counter in **Redis** |
| 7 | `GET /stress-test/{id}` reads those counters |

The API and the worker never talk to each other. They only share RabbitMQ and
Redis.

## Stop

```bash
docker compose down -v
```
