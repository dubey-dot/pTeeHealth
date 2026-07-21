"""Pydantic schemas: the request/response contracts for the Intake API.

These sit at the boundary between HTTP and the domain layer. Routes only
ever see these; services translate between schema <-> domain entity.
"""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.domain.models.intake import Gender, RedFlagKey


class ChiefComplaintSchema(BaseModel):
    raw_text: str = ""
    body_part: str | None = None
    side: str | None = None
    location: str | None = None
    duration: str | None = None
    primary_complaint: str | None = None


class IntakeOptionsResponse(BaseModel):
    """Static reference data the intake form renders as chips/checkboxes.

    Kept server-side (rather than hard-coded in the frontend) so clinical
    ops can adjust the vocabulary without a frontend deploy, once this is
    backed by real config/storage instead of mock data.
    """

    genders: list[str]
    aggravating_factors: list[str]
    relieving_factors: list[str]
    red_flags: list[dict[str, str]]
    duration_presets: list[str]


class IntakeCreateRequest(BaseModel):
    """Payload submitted when a physiotherapist saves/submits an intake form."""

    patient_id: str | None = None
    chief_complaint: ChiefComplaintSchema | None = None
    age: int | None = Field(default=None, ge=1, le=120)
    gender: Gender | None = None
    occupation: str | None = None
    activity_level: str | None = None
    pain_score: int | None = Field(default=None, ge=0, le=10)
    duration: str | None = None
    previous_injuries: str | None = None

    aggravating_factors: list[str] = Field(default_factory=list)
    relieving_factors: list[str] = Field(default_factory=list)
    red_flags: dict[RedFlagKey, bool] = Field(default_factory=dict)

    @field_validator("age")
    @classmethod
    def validate_age(cls, value: int | None) -> int | None:
        if value is not None and not (1 <= value <= 120):
            raise ValueError("age must be between 1 and 120")
        return value


class IntakeResponse(BaseModel):
    id: str
    patient_id: str | None
    chief_complaint: ChiefComplaintSchema | None
    age: int | None
    gender: Gender | None
    occupation: str | None
    activity_level: str | None
    pain_score: int | None
    duration: str | None
    previous_injuries: str | None
    aggravating_factors: list[str]
    relieving_factors: list[str]
    red_flags: dict[RedFlagKey, bool]
    status: str
    requires_immediate_referral: bool
    created_at: datetime
    updated_at: datetime


class VoiceIntakeTranscriptRequest(BaseModel):
    """Transcript text from the doctor-patient conversation.

    In production this would arrive after Amazon Transcribe has already
    converted speech to text; this endpoint mocks the downstream clinical
    entity extraction (the Bedrock step in the spec) over that transcript.
    """

    transcript: str


class SeniorReviewRequest(BaseModel):
    intake_id: str
    reason: str | None = None
