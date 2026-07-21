"""HTTP routes for the Patient Intake step of the clinical journey."""
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_intake_service
from app.domain.schemas.intake import (
    ChiefComplaintSchema,
    IntakeCreateRequest,
    IntakeOptionsResponse,
    IntakeResponse,
    SeniorReviewRequest,
    VoiceIntakeTranscriptRequest,
)
from app.services.intake_service import IntakeService

router = APIRouter(prefix="/intake", tags=["intake"])


@router.get("/options", response_model=IntakeOptionsResponse)
def get_intake_options(
    service: IntakeService = Depends(get_intake_service),
) -> IntakeOptionsResponse:
    """Reference vocabulary the form renders: factor chips, red flags, etc."""
    return service.get_form_options()


@router.post("", response_model=IntakeResponse, status_code=status.HTTP_201_CREATED)
def create_intake(
    payload: IntakeCreateRequest,
    service: IntakeService = Depends(get_intake_service),
) -> IntakeResponse:
    """Save a patient intake form (draft or final submission)."""
    return service.create_intake(payload)


@router.get("", response_model=list[IntakeResponse])
def list_intakes(
    service: IntakeService = Depends(get_intake_service),
) -> list[IntakeResponse]:
    return service.list_intakes()


@router.get("/{intake_id}", response_model=IntakeResponse)
def get_intake(
    intake_id: str,
    service: IntakeService = Depends(get_intake_service),
) -> IntakeResponse:
    intake = service.get_intake(intake_id)
    if not intake:
        raise HTTPException(status_code=404, detail="Intake not found")
    return intake


@router.post("/voice-transcript", response_model=ChiefComplaintSchema)
def extract_from_voice_transcript(
    payload: VoiceIntakeTranscriptRequest,
    service: IntakeService = Depends(get_intake_service),
) -> ChiefComplaintSchema:
    """Mock of the voice-first intake pipeline's clinical entity extraction."""
    return service.extract_from_transcript(payload.transcript)


@router.post("/senior-review", response_model=IntakeResponse)
def request_senior_review(
    payload: SeniorReviewRequest,
    service: IntakeService = Depends(get_intake_service),
) -> IntakeResponse:
    intake = service.request_senior_review(payload.intake_id)
    if not intake:
        raise HTTPException(status_code=404, detail="Intake not found")
    return intake
