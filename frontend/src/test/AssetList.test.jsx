import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { AssetProvider } from '../context/AssetContext'
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

const mac = {
  id: 2,
  name: 'MacBook Pro',
  brand: 'Apple',
  serialNumber: 'A-2',
  purchaseDate: '2024-02-02',
  price: 2000,
  status: 'In stock',
}

function pageOf(content, page = 0, totalPages = 1, totalElements = content.length) {
  return { content, page, size: 5, totalElements, totalPages }
}

function setup() {
  render(
    <MemoryRouter>
      <AssetProvider>
        <AssetList />
      </AssetProvider>
    </MemoryRouter>
  )
}

describe('AssetList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads the first page from the server and shows every asset', async () => {
    api.fetchAssets.mockResolvedValue(pageOf([dell, mac]))
    setup()
    expect(await screen.findByText('Dell Latitude')).toBeInTheDocument()
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    expect(screen.getByText('2 computers registered.')).toBeInTheDocument()
    expect(api.fetchAssets).toHaveBeenCalledWith(0, 5)
  })

  it('has an edit link for each asset', async () => {
    api.fetchAssets.mockResolvedValue(pageOf([dell, mac]))
    setup()
    await screen.findByText('Dell Latitude')
    const links = screen.getAllByRole('link', { name: 'Edit' })
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/edit/1')
  })

  it('deletes an asset after the user confirms', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    api.fetchAssets
      .mockResolvedValueOnce(pageOf([dell, mac]))
      .mockResolvedValueOnce(pageOf([mac]))
    api.deleteAssetById.mockResolvedValue()
    setup()

    await screen.findByText('Dell Latitude')
    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

    await waitFor(() => {
      expect(screen.queryByText('Dell Latitude')).not.toBeInTheDocument()
    })
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    expect(api.deleteAssetById).toHaveBeenCalledWith(1)
  })

  it('keeps the asset when the user cancels', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    api.fetchAssets.mockResolvedValue(pageOf([dell, mac]))
    setup()

    await screen.findByText('Dell Latitude')
    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

    expect(screen.getByText('Dell Latitude')).toBeInTheDocument()
    expect(api.deleteAssetById).not.toHaveBeenCalled()
  })

  it('shows a message when there are no assets', async () => {
    api.fetchAssets.mockResolvedValue(pageOf([]))
    setup()
    expect(await screen.findByText(/No assets yet/)).toBeInTheDocument()
  })

  it('moves to the next page and back', async () => {
    api.fetchAssets
      .mockResolvedValueOnce(pageOf([dell], 0, 2, 2))
      .mockResolvedValueOnce(pageOf([mac], 1, 2, 2))
      .mockResolvedValueOnce(pageOf([dell], 0, 2, 2))
    setup()

    expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('MacBook Pro')).toBeInTheDocument()
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(api.fetchAssets).toHaveBeenLastCalledWith(1, 5)

    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))
    expect(await screen.findByText('Dell Latitude')).toBeInTheDocument()
    expect(api.fetchAssets).toHaveBeenLastCalledWith(0, 5)
  })

  it('shows an error when the server is not running', async () => {
    api.fetchAssets.mockRejectedValue(new Error('Network error'))
    setup()
    expect(await screen.findByText(/Could not connect to the server/)).toBeInTheDocument()
  })
})
