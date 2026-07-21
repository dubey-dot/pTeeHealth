"""In-memory persistence for PatientIntake records.

This is a mock repository: it satisfies the same interface a real
database-backed repository would (get, save, list, delete) so the service
layer above it never has to change when this is swapped for, say, a
Postgres- or DynamoDB-backed implementation.
"""
from __future__ import annotations

from datetime import datetime

from app.domain.models.intake import PatientIntake


class InMemoryIntakeRepository:
    def __init__(self) -> None:
        self._store: dict[str, PatientIntake] = {}

    def save(self, intake: PatientIntake) -> PatientIntake:
        intake.updated_at = datetime.utcnow()
        self._store[intake.id] = intake
        return intake

    def get(self, intake_id: str) -> PatientIntake | None:
        return self._store.get(intake_id)

    def list(self) -> list[PatientIntake]:
        return list(self._store.values())

    def delete(self, intake_id: str) -> None:
        self._store.pop(intake_id, None)


# Module-level singleton so the mock data survives across requests within
# the same process. A real implementation would instead inject a database
# session/client per-request via FastAPI's dependency system.
_repository = InMemoryIntakeRepository()


def get_intake_repository() -> InMemoryIntakeRepository:
    return _repository
