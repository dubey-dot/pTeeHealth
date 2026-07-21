"""Business logic for the Patient Intake step.

Routes call this service; the service talks to the repository and applies
clinical rules (like the red-flag safety check) that don't belong in either
the transport layer (routes) or the persistence layer (repository).
"""
from __future__ import annotations

from app.domain.models.intake import ChiefComplaint, PatientIntake
from app.domain.schemas.intake import (
    ChiefComplaintSchema,
    IntakeCreateRequest,
    IntakeOptionsResponse,
    IntakeResponse,
)
from app.infrastructure.repositories.intake_repository import (
    InMemoryIntakeRepository,
)

# Static reference vocabulary for the intake form. In a later phase this
# moves to the vector knowledge base / a config service; for now it mirrors
# the options enumerated in the intake spec exactly.
AGGRAVATING_FACTORS = [
    "Running",
    "Walking",
    "Stairs",
    "Sitting",
    "Squatting",
    "Jumping",
    "Cycling",
    "Kneeling",
    "Walking Downhill",
]

RELIEVING_FACTORS = ["Rest", "Ice", "Heat", "Stretching", "NSAIDs", "Bracing", "Medication"]

RED_FLAGS = [
    {"key": "weight_loss", "label": "Unexplained weight loss"},
    {"key": "night_pain", "label": "Night pain unrelated to position"},
    {"key": "fever", "label": "Fever or systemic symptoms"},
    {"key": "history_of_cancer", "label": "History of cancer"},
    {"key": "recent_trauma", "label": "Recent significant trauma"},
    {"key": "neurological_deficit", "label": "Progressive neurological deficit"},
    {"key": "bowel_bladder_dysfunction", "label": "Bowel or bladder dysfunction"},
]

DURATION_PRESETS = ["Days", "Weeks", "Months", "Years"]

GENDERS = ["Male", "Female", "Other", "Prefer not to say"]


class IntakeService:
    def __init__(self, repository: InMemoryIntakeRepository) -> None:
        self._repository = repository

    def get_form_options(self) -> IntakeOptionsResponse:
        return IntakeOptionsResponse(
            genders=GENDERS,
            aggravating_factors=AGGRAVATING_FACTORS,
            relieving_factors=RELIEVING_FACTORS,
            red_flags=RED_FLAGS,
            duration_presets=DURATION_PRESETS,
        )

    def create_intake(self, payload: IntakeCreateRequest) -> IntakeResponse:
        chief_complaint = None
        if payload.chief_complaint:
            chief_complaint = ChiefComplaint(
                raw_text=payload.chief_complaint.raw_text,
                body_part=payload.chief_complaint.body_part,
                side=payload.chief_complaint.side,
                location=payload.chief_complaint.location,
                duration=payload.chief_complaint.duration,
                primary_complaint=payload.chief_complaint.primary_complaint,
            )

        intake = PatientIntake(
            patient_id=payload.patient_id,
            chief_complaint=chief_complaint,
            age=payload.age,
            gender=payload.gender,
            occupation=payload.occupation,
            activity_level=payload.activity_level,
            pain_score=payload.pain_score,
            duration=payload.duration,
            previous_injuries=payload.previous_injuries,
            aggravating_factors=payload.aggravating_factors,
            relieving_factors=payload.relieving_factors,
            red_flags=payload.red_flags,
        )

        if intake.has_critical_red_flag():
            intake.status = "referral_required"

        self._repository.save(intake)
        return self._to_response(intake)

    def get_intake(self, intake_id: str) -> IntakeResponse | None:
        intake = self._repository.get(intake_id)
        return self._to_response(intake) if intake else None

    def list_intakes(self) -> list[IntakeResponse]:
        return [self._to_response(i) for i in self._repository.list()]

    def request_senior_review(self, intake_id: str) -> IntakeResponse | None:
        intake = self._repository.get(intake_id)
        if not intake:
            return None
        intake.status = "senior_review_requested"
        self._repository.save(intake)
        return self._to_response(intake)

    def extract_from_transcript(self, transcript: str) -> ChiefComplaintSchema:
        """Mock of the voice-first intake pipeline's extraction step.

        Real implementation: Amazon Transcribe -> Amazon Bedrock clinical
        entity extraction -> structured fields. This stub does a naive
        keyword scan so the frontend has something real to render while
        the actual NLP pipeline is built.
        """
        text = transcript.lower()
        body_part = next(
            (p for p in ["knee", "shoulder", "back", "hip", "ankle", "neck"] if p in text),
            None,
        )
        side = next((s for s in ["left", "right"] if s in text), None)
        aggravator = next(
            (a for a in ["stairs", "running", "sitting", "walking", "squatting"] if a in text),
            None,
        )

        return ChiefComplaintSchema(
            raw_text=transcript,
            body_part=body_part.capitalize() if body_part else None,
            side=side.capitalize() if side else None,
            location=None,
            duration=None,
            primary_complaint=(
                f"{(side or '').capitalize()} {body_part} pain"
                f"{f' aggravated by {aggravator}' if aggravator else ''}"
            ).strip()
            if body_part
            else None,
        )

    @staticmethod
    def _to_response(intake: PatientIntake) -> IntakeResponse:
        chief_complaint = None
        if intake.chief_complaint:
            chief_complaint = ChiefComplaintSchema(
                raw_text=intake.chief_complaint.raw_text,
                body_part=intake.chief_complaint.body_part,
                side=intake.chief_complaint.side,
                location=intake.chief_complaint.location,
                duration=intake.chief_complaint.duration,
                primary_complaint=intake.chief_complaint.primary_complaint,
            )

        return IntakeResponse(
            id=intake.id,
            patient_id=intake.patient_id,
            chief_complaint=chief_complaint,
            age=intake.age,
            gender=intake.gender,
            occupation=intake.occupation,
            activity_level=intake.activity_level,
            pain_score=intake.pain_score,
            duration=intake.duration,
            previous_injuries=intake.previous_injuries,
            aggravating_factors=intake.aggravating_factors,
            relieving_factors=intake.relieving_factors,
            red_flags=intake.red_flags,
            status=intake.status,
            requires_immediate_referral=intake.has_critical_red_flag(),
            created_at=intake.created_at,
            updated_at=intake.updated_at,
        )
