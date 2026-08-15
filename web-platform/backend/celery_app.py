"""Celery background task queue configuration for data processing pipelines."""

import os
from celery import Celery

broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

celery_app = Celery(
    "luna_ice_mapper",
    broker=broker_url,
    backend=result_backend,
    include=[
        "web-platform.backend.tasks.anomaly_detection",
        "web-platform.backend.tasks.calibration",
        "backend.tasks.anomaly_detection",
        "backend.tasks.calibration",
        "tasks.anomaly_detection",
        "tasks.calibration",
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
)

if __name__ == "__main__":
    celery_app.start()
