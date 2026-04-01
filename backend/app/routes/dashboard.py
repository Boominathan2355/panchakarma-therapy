import logging
from fastapi import APIRouter, Depends, Query
from typing import Optional
from datetime import datetime, timedelta, timezone
from app.models.schedule import ScheduleEntry
from app.models.patient import Patient
from app.models.resource import Therapist, Room, Material
from app.models.audit import AuditLog
from app.middleware.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/kpis")
async def get_kpis(user=Depends(get_current_user)):
    try:
        all_entries = await ScheduleEntry.find_all().to_list()

        non_cancelled = [e for e in all_entries if e.status != "Cancelled"]
        total_sessions = len(non_cancelled)
        active_patients = len(set(e.patientId for e in non_cancelled))

        completed = len([e for e in all_entries if e.status == "Completed"])
        revenue = completed * 2500

        total_rooms = await Room.count()
        busy_rooms = await Room.find(Room.status == "Busy").count()
        occupancy = round((busy_rooms / total_rooms * 100) if total_rooms > 0 else 0)

        return {
            "totalSessions": total_sessions,
            "activePatients": active_patients,
            "todaysRevenue": revenue,
            "occupancyRate": occupancy,
        }
    except Exception as e:
        logger.exception("Dashboard KPIs error")
        return {
            "totalSessions": 0,
            "activePatients": 0,
            "todaysRevenue": 0,
            "occupancyRate": 0,
        }


@router.get("/trends")
async def get_trends(user=Depends(get_current_user)):
    entries = await ScheduleEntry.find_all().to_list()

    date_counts = {}
    for entry in entries:
        try:
            date_str = entry.start[:10]
            date_counts[date_str] = date_counts.get(date_str, 0) + 1
        except (IndexError, TypeError):
            pass

    sorted_dates = sorted(date_counts.keys())
    return {
        "dates": sorted_dates,
        "values": [date_counts[d] for d in sorted_dates],
    }


@router.get("/availability")
async def get_availability(user=Depends(get_current_user)):
    therapists = await Therapist.find_all().to_list()
    rooms = await Room.find_all().to_list()

    return {
        "therapists": [
            {"id": t.thid, "name": t.name, "status": t.status, "specialty": t.specialty}
            for t in therapists
        ],
        "rooms": [
            {"id": r.rid, "name": r.name, "status": r.status, "capacity": r.capacity}
            for r in rooms
        ],
    }


@router.get("/alerts")
async def get_alerts(user=Depends(get_current_user)):
    alerts = []

    low_stock = await Material.find_all().to_list()
    for m in low_stock:
        if m.quantity <= m.lowStockThreshold:
            alerts.append({
                "id": f"alert-{m.mid}",
                "type": "warning",
                "title": "Low Stock Alert",
                "message": f"{m.name} is low ({m.quantity} {m.unit} remaining)",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

    maintenance_rooms = await Room.find(Room.status == "On Leave").to_list()
    for r in maintenance_rooms:
        alerts.append({
            "id": f"alert-{r.rid}",
            "type": "info",
            "title": "Room Maintenance",
            "message": f"{r.name} is under maintenance",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })

    return alerts


@router.get("/notifications")
async def get_notifications(
    role: Optional[str] = Query(None),
    user=Depends(get_current_user),
):
    notifications = []

    recent_logs = await AuditLog.find_all().sort("-timestamp").limit(10).to_list()
    for log in recent_logs:
        notifications.append({
            "id": log.aid,
            "type": "info",
            "title": log.action,
            "message": log.details or f"{log.action} on {log.entity}",
            "timestamp": log.timestamp,
            "read": False,
        })

    return notifications
