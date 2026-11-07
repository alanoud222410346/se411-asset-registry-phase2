import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { AssetProvider } from '../context/AssetContext'
import AssetForm from '../pages/AssetForm'
import AssetList from '../pages/AssetList'
import * as api from '../api/assetApi'

// Replace the real server calls with mocks
vi.mock('../api/assetApi')

const dell = {
  id: 1,
  name: 'Dell Latitude',
  brand: 'Dell',
  serialNumber: 'D-1',
  purchaseDate: '2024-01-01',
  price: 1000,
  status: 'In use',
}

function pageOf(content) {
  return { content, page: 0, size: 5, totalElements: content.length, totalPages: 1 }
}

function setup(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AssetProvider>
        <Routes>
          <Route path="/" element={<AssetList />} />
          <Route path="/add" element={<AssetForm key="add" />} />
          <Route path="/edit/:id" element={<AssetForm key="edit" />} />
        </Routes>
      </AssetProvider>
    </MemoryRouter>
  )
}

describe('AssetForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows errors when required fields are empty', async () => {
    setup('/add')
    await userEvent.click(screen.getByRole('button', { name: 'Add asset' }))
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Brand is required')).toBeInTheDocument()
    expect(screen.getByText('Serial number is required')).toBeInTheDocument()
    expect(screen.getByText('Purchase date is required')).toBeInTheDocument()
    expect(api.createAsset).not.toHaveBeenCalled()
  })

  it('sends a new asset to the server and goes back to the list', async () => {
    const newAsset = {
      name: 'HP ProBook',
      brand: 'HP',
      serialNumber: 'HP-77',
      purchaseDate: '2025-03-04',
      price: 800,
      status: 'In use',
    }
    api.createAsset.mockResolvedValue({ ...newAsset, id: 2 })
    api.fetchAssets.mockResolvedValue(pageOf([dell, { ...newAsset, id: 2 }]))
    setup('/add')

    await userEvent.type(screen.getByLabelText('Name'), 'HP ProBook')
    await userEvent.type(screen.getByLabelText('Brand'), 'HP')
    await userEvent.type(screen.getByLabelText('Serial number'), 'HP-77')
    fireEvent.change(screen.getByLabelText('Purchase date'), {
      target: { value: '2025-03-04' },
    })
    await userEvent.type(screen.getByLabelText('Price ($)'), '800')
    await userEvent.click(screen.getByRole('button', { name: 'Add asset' }))

    expect(await screen.findByRole('heading', { name: 'Assets' })).toBeInTheDocument()
    expect(await screen.findByText('HP ProBook')).toBeInTheDocument()
    expect(api.createAsset).toHaveBeenCalledWith(newAsset)
  })

  it('loads the asset from the server in edit mode', async () => {
    api.fetchAssetById.mockResolvedValue(dell)
    setup('/edit/1')

    expect(await screen.findByRole('heading', { name: 'Edit asset' })).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Dell Latitude')
    expect(screen.getByLabelText('Brand')).toHaveValue('Dell')
    expect(api.fetchAssetById).toHaveBeenCalledWith(1)
  })

  it('sends the changes to the server in edit mode', async () => {
    api.fetchAssetById.mockResolvedValue(dell)
    api.updateAssetById.mockResolvedValue({ ...dell, name: 'Dell XPS' })
    api.fetchAssets.mockResolvedValue(pageOf([{ ...dell, name: 'Dell XPS' }]))
    setup('/edit/1')

    const nameInput = await screen.findByLabelText('Name')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Dell XPS')
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText('Dell XPS')).toBeInTheDocument()
    expect(api.updateAssetById).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ name: 'Dell XPS', brand: 'Dell' })
    )
  })

  it('shows a message when the asset does not exist', async () => {
    api.fetchAssetById.mockResolvedValue(null)
    setup('/edit/99')
    expect(await screen.findByText('Asset not found')).toBeInTheDocument()
  })

  it('shows an error when saving fails', async () => {
    api.createAsset.mockRejectedValue(new Error('Network error'))
    setup('/add')

    await userEvent.type(screen.getByLabelText('Name'), 'HP ProBook')
    await userEvent.type(screen.getByLabelText('Brand'), 'HP')
    await userEvent.type(screen.getByLabelText('Serial number'), 'HP-77')
    fireEvent.change(screen.getByLabelText('Purchase date'), {
      target: { value: '2025-03-04' },
    })
    await userEvent.type(screen.getByLabelText('Price ($)'), '800')
    await userEvent.click(screen.getByRole('button', { name: 'Add asset' }))

    expect(await screen.findByText(/Could not save the asset/)).toBeInTheDocument()
  })
})
