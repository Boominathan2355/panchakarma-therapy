from .user import User
from .patient import Patient, PatientHistoryEntry, PatientAvailability
from .therapy import TherapyDefinition, TherapyWorkflowStep, RequiredMaterial, TherapyDocument
from .therapy_plan import TherapyPlanDefinition, TherapySequenceItem
from .schedule import ScheduleEntry
from .resource import Therapist, Room, Material
from .audit import AuditLog
from .document import UploadedDocument

ALL_MODELS = [
    User,
    Patient,
    TherapyDefinition,
    TherapyPlanDefinition,
    ScheduleEntry,
    Therapist,
    Room,
    Material,
    AuditLog,
    UploadedDocument,
]
