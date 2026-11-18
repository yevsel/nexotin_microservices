import os

from celery import Celery

celery_app = Celery(
    "nexotin",
    # include tells the worker which modules to import at startup.
    # Without it the worker starts but knows no tasks.
    include=["app.tasks.email"],
    broker=os.getenv(
        "CELERY_BROKER_URL",
        "amqp://guest:guest@localhost:5672//",
    ),
    backend=os.getenv(
        "CELERY_RESULT_BACKEND",
        "redis://localhost:6379/1",
    ),
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    broker_connection_retry_on_startup=True,
)
