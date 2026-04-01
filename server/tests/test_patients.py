import pytest


@pytest.mark.asyncio
async def test_list_patients(client, auth_headers):
    response = await client.get("/api/patients/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_patient_by_id(client, auth_headers):
    response = await client.get("/api/patients/p1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "p1"
    assert "name" in data


@pytest.mark.asyncio
async def test_get_nonexistent_patient(client, auth_headers):
    response = await client.get("/api/patients/does-not-exist", headers=auth_headers)
    assert response.status_code == 404
