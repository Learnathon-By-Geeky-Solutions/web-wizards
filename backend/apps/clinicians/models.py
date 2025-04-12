from apps.clinicians.models.clinician import Clinician, Specialization
from apps.clinicians.models.diagnostic_center import DiagnosticCenter
from apps.clinicians.models.review import Review

# Export all models
__all__ = [
    "Clinician",
    "Specialization", 
    "DiagnosticCenter", 
    "Review"
]
