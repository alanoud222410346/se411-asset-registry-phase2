// All calls to the Spring Boot server are in this file.
const BASE_URL = 'http://localhost:8080/api/assets'

// GET /api/assets?page=&size=  -> one page of assets
export async function fetchAssets(page, size) {
  const response = await fetch(BASE_URL + '?page=' + page + '&size=' + size)
  if (!response.ok) {
    throw new Error('Could not load assets')
  }
  return response.json()
}

// GET /api/assets/{id}  -> one asset, or null if it does not exist
export async function fetchAssetById(id) {
  const response = await fetch(BASE_URL + '/' + id)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Could not load the asset')
  }
  return response.json()
}

// POST /api/assets  -> add an asset
export async function createAsset(asset) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asset),
  })
  if (!response.ok) {
    throw new Error('Could not add the asset')
  }
  return response.json()
}

// PUT /api/assets/{id}  -> update an asset
export async function updateAssetById(id, asset) {
  const response = await fetch(BASE_URL + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asset),
  })
  if (!response.ok) {
    throw new Error('Could not update the asset')
  }
  return response.json()
}

// DELETE /api/assets/{id}  -> delete an asset
export async function deleteAssetById(id) {
  const response = await fetch(BASE_URL + '/' + id, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error('Could not delete the asset')
  }
}
