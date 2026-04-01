from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.resource import Room, Material
from app.middleware.auth import get_current_user

router = APIRouter(tags=["Resources"])


@router.get("/rooms", response_model=List[dict])
async def list_rooms(user=Depends(get_current_user)):
    rooms = await Room.find_all().to_list()
    return [
        {
            "id": r.rid,
            "name": r.name,
            "capacity": r.capacity,
            "facilities": r.facilities,
            "status": r.status,
        }
        for r in rooms
    ]


@router.get("/materials", response_model=List[dict])
async def list_materials(user=Depends(get_current_user)):
    materials = await Material.find_all().to_list()
    return [
        {
            "id": m.mid,
            "name": m.name,
            "quantity": m.quantity,
            "unit": m.unit,
            "lowStockThreshold": m.lowStockThreshold,
        }
        for m in materials
    ]


@router.put("/materials/{material_id}")
async def update_material(material_id: str, data: dict, user=Depends(get_current_user)):
    material = await Material.find_one(Material.mid == material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    if "quantity" in data:
        material.quantity = data["quantity"]
    await material.save()
    return {
        "id": material.mid,
        "name": material.name,
        "quantity": material.quantity,
        "unit": material.unit,
        "lowStockThreshold": material.lowStockThreshold,
    }
