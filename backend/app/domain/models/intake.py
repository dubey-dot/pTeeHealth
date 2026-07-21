"""Domain entities for the Patient Intake step of the clinical journey.

These are plain dataclasses on purpose: the domain layer should not know
about FastAPI, Pydantic, or any persistence technology. Pydantic schemas in
`domain/schemas` translate to/from these entities at the API boundary.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from uuid import uuid4


class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"
    PREFER_NOT_TO_SAY = "Prefer not to say"


class RedFlagKey(str, Enum):
    WEIGHT_LOSS = "weight_loss"
    NIGHT_PAIN = "night_pain"
    FEVER = "fever"
    HISTORY_OF_CANCER = "history_of_cancer"
    RECENT_TRAUMA = "recent_trauma"
    NEUROLOGICAL_DEFICIT = "neurological_deficit"
    BOWEL_BLADDER_DYSFUNCTION = "bowel_bladder_dysfunction"


# Red flags that must immediately halt AI diagnosis and force a referral,
# per the clinical decision logic in the intake spec.
CRITICAL_RED_FLAGS: set[RedFlagKey] = {
    RedFlagKey.HISTORY_OF_CANCER,
    RedFlagKey.NEUROLOGICAL_DEFICIT,
    RedFlagKey.BOWEL_BLADDER_DYSFUNCTION,
}


@dataclass
class ChiefComplaint:
    """Structured extraction of the patient's free-text chief complaint."""

    raw_text: str
    body_part: str | None = None
    side: str | None = None
    location: str | None = None
    duration: str | None = None
    primary_complaint: str | None = None


@dataclass
class PatientIntake:
    """A single patient's intake record for one clinical journey."""

    id: str = field(default_factory=lambda: str(uuid4()))
    patient_id: str | None = None

    chief_complaint: ChiefComplaint | None = None
    age: int | None = None
    gender: Gender | None = None
    occupation: str | None = None
    activity_level: str | None = None  # Sport / Activity
    pain_score: int | None = None  # 0-10 VAS
    duration: str | None = None
    previous_injuries: str | None = None

    aggravating_factors: list[str] = field(default_factory=list)
    relieving_factors: list[str] = field(default_factory=list)
    red_flags: dict[RedFlagKey, bool] = field(default_factory=dict)

    status: str = "draft"  # draft | submitted | senior_review_requested
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def has_critical_red_flag(self) -> bool:
        return any(
            self.red_flags.get(flag, False) for flag in CRITICAL_RED_FLAGS
        )
