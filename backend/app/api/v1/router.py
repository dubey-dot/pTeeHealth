"""Aggregates all v1 route modules into a single router.

New journey steps (hypothesis, assessment, reasoning, treatment,
evaluation) each get their own routes module here as they're built.
"""
from fastapi import APIRouter

from app.api.v1.routes import intake

api_router = APIRouter()
api_router.include_router(intake.router)
