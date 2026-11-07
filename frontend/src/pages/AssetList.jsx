import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAssets } from '../context/AssetContext'

function AssetList() {
  const {
    assets,
    page,
    totalPages,
    totalElements,
    loading,
    error,
    loadAssets,
    deleteAsset,
  } = useAssets()

  // Load the current page when the list opens
  useEffect(() => {
    loadAssets(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleDelete(asset) {
    if (window.confirm('Delete ' + asset.name + '?')) {
      try {
        await deleteAsset(asset.id)
      } catch {
        window.alert('Could not delete the asset.')
      }
    }
  }

  return (
    <section>
      <h1>Assets</h1>

      {error && <p className="error">{error}</p>}

      {!error && <p>{totalElements} computers registered.</p>}

      {loading && <p>Loading...</p>}

      {!loading && !error && assets.length === 0 && (
        <p>No assets yet. Use "Add asset" to create one.</p>
      )}

      {!loading && assets.length > 0 && (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Serial number</th>
                  <th>Purchase date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.id}</td>
                    <td>{asset.name}</td>
                    <td>{asset.brand}</td>
                    <td>{asset.serialNumber}</td>
                    <td>{asset.purchaseDate}</td>
                    <td>${asset.price}</td>
                    <td>{asset.status}</td>
                    <td className="actions">
                      <Link className="button" to={'/edit/' + asset.id}>
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(asset)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => loadAssets(page - 1)} disabled={page === 0}>
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button onClick={() => loadAssets(page + 1)} disabled={page + 1 >= totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default AssetList
