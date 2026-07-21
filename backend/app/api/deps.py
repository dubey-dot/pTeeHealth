"""Shared FastAPI dependencies.

Keeping dependency wiring in one place makes it obvious how to swap the
mock repository for a real one later: change get_intake_repository here
and every route that depends on IntakeService picks it up automatically.
"""
from app.infrastructure.repositories.intake_repository import (
    get_intake_repository,
)
from app.services.intake_service import IntakeService


def get_intake_service() -> IntakeService:
    return IntakeService(repository=get_intake_repository())
