import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { AssetProvider } from '../context/AssetContext'
import SearchAsset from '../pages/SearchAsset'
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

function setup() {
  render(
    <MemoryRouter>
      <AssetProvider>
        <SearchAsset />
      </AssetProvider>
    </MemoryRouter>
  )
}

describe('SearchAsset', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the asset when the id exists', async () => {
    api.fetchAssetById.mockResolvedValue(dell)
    setup()

    await userEvent.type(screen.getByLabelText('Asset ID'), '1')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText('Dell Latitude')).toBeInTheDocument()
    expect(screen.getByText('D-1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/edit/1')
    expect(api.fetchAssetById).toHaveBeenCalledWith(1)
  })

  it('shows a message when the id does not exist', async () => {
    api.fetchAssetById.mockResolvedValue(null)
    setup()

    await userEvent.type(screen.getByLabelText('Asset ID'), '99')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText('No asset found with ID 99')).toBeInTheDocument()
  })

  it('asks for a valid id when the box is empty', async () => {
    setup()
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.getByText('Please enter a valid ID')).toBeInTheDocument()
    expect(api.fetchAssetById).not.toHaveBeenCalled()
  })

  it('shows an error when the server is not running', async () => {
    api.fetchAssetById.mockRejectedValue(new Error('Network error'))
    setup()

    await userEvent.type(screen.getByLabelText('Asset ID'), '1')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText(/Could not connect to the server/)).toBeInTheDocument()
  })
})
