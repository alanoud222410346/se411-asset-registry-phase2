import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAssets } from '../context/AssetContext'

function SearchAsset() {
  const { getAsset } = useAssets()

  const [searchId, setSearchId] = useState('')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    setResult(null)
    setMessage('')

    if (searchId === '' || Number(searchId) < 1) {
      setMessage('Please enter a valid ID')
      return
    }

    try {
      const asset = await getAsset(Number(searchId))
      if (asset) {
        setResult(asset)
      } else {
        setMessage('No asset found with ID ' + searchId)
      }
    } catch {
      setMessage('Could not connect to the server. Make sure the backend is running.')
    }
  }

  return (
    <section>
      <h1>Search by ID</h1>

      <form onSubmit={handleSearch} noValidate>
        <div className="field">
          <label htmlFor="searchId">Asset ID</label>
          <input
            id="searchId"
            type="number"
            min="1"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {message && <p className="error">{message}</p>}

      {result && (
        <div className="table-wrap">
          <table className="details-table">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{result.id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{result.name}</td>
              </tr>
              <tr>
                <th>Brand</th>
                <td>{result.brand}</td>
              </tr>
              <tr>
                <th>Serial number</th>
                <td>{result.serialNumber}</td>
              </tr>
              <tr>
                <th>Purchase date</th>
                <td>{result.purchaseDate}</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>${result.price}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{result.status}</td>
              </tr>
            </tbody>
          </table>
          <p>
            <Link className="button" to={'/edit/' + result.id}>
              Edit
            </Link>
          </p>
        </div>
      )}
    </section>
  )
}

export default SearchAsset
