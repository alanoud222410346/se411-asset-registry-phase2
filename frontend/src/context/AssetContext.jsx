import { createContext, useContext, useState } from 'react'
import {
  fetchAssets,
  fetchAssetById,
  createAsset,
  updateAssetById,
  deleteAssetById,
} from '../api/assetApi'

const AssetContext = createContext(null)

export const PAGE_SIZE = 5

export function AssetProvider({ children }) {
  const [assets, setAssets] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load one page of assets from the server
  async function loadAssets(pageNumber) {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAssets(pageNumber, PAGE_SIZE)
      setAssets(data.content)
      setPage(data.page)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError('Could not connect to the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  async function addAsset(asset) {
    return createAsset(asset)
  }

  async function updateAsset(id, asset) {
    return updateAssetById(id, asset)
  }

  async function deleteAsset(id) {
    await deleteAssetById(id)
    // If we deleted the last asset on this page, go back one page
    const newPage = assets.length === 1 && page > 0 ? page - 1 : page
    await loadAssets(newPage)
  }

  async function getAsset(id) {
    return fetchAssetById(id)
  }

  return (
    <AssetContext.Provider
      value={{
        assets,
        page,
        totalPages,
        totalElements,
        loading,
        error,
        loadAssets,
        addAsset,
        updateAsset,
        deleteAsset,
        getAsset,
      }}
    >
      {children}
    </AssetContext.Provider>
  )
}

export function useAssets() {
  return useContext(AssetContext)
}
