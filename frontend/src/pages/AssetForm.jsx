import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAssets } from '../context/AssetContext'
import { statusOptions } from '../data/assets'

const emptyForm = {
  name: '',
  brand: '',
  serialNumber: '',
  purchaseDate: '',
  price: '',
  status: 'In use',
}

function AssetForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addAsset, updateAsset, getAsset } = useAssets()

  const isEdit = id !== undefined

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [notFound, setNotFound] = useState(false)
  const [serverError, setServerError] = useState('')

  // In edit mode, get the asset from the server and fill the form
  useEffect(() => {
    if (!isEdit) return

    getAsset(Number(id))
      .then((asset) => {
        if (asset) {
          setForm({ ...asset })
        } else {
          setNotFound(true)
        }
      })
      .catch(() => setServerError('Could not connect to the server.'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) {
    return <p>Loading...</p>
  }

  if (notFound) {
    return (
      <section>
        <h1>Asset not found</h1>
        <p>There is no asset with ID {id}.</p>
        <Link to="/">Back to the list</Link>
      </section>
    )
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.brand.trim()) newErrors.brand = 'Brand is required'
    if (!form.serialNumber.trim()) newErrors.serialNumber = 'Serial number is required'
    if (!form.purchaseDate) newErrors.purchaseDate = 'Purchase date is required'
    if (form.price === '' || Number(form.price) < 0) {
      newErrors.price = 'Price is required and cannot be negative'
    }
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const data = {
      name: form.name,
      brand: form.brand,
      serialNumber: form.serialNumber,
      purchaseDate: form.purchaseDate,
      price: Number(form.price),
      status: form.status,
    }

    setServerError('')
    try {
      if (isEdit) {
        await updateAsset(Number(id), data)
      } else {
        await addAsset(data)
      }
      navigate('/')
    } catch {
      setServerError('Could not save the asset. Make sure the backend is running.')
    }
  }

  return (
    <section>
      <h1>{isEdit ? 'Edit asset' : 'Add asset'}</h1>

      {serverError && <p className="error">{serverError}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="brand">Brand</label>
          <input id="brand" name="brand" value={form.brand} onChange={handleChange} />
          {errors.brand && <span className="error">{errors.brand}</span>}
        </div>

        <div className="field">
          <label htmlFor="serialNumber">Serial number</label>
          <input
            id="serialNumber"
            name="serialNumber"
            value={form.serialNumber}
            onChange={handleChange}
          />
          {errors.serialNumber && <span className="error">{errors.serialNumber}</span>}
        </div>

        <div className="field">
          <label htmlFor="purchaseDate">Purchase date</label>
          <input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
          />
          {errors.purchaseDate && <span className="error">{errors.purchaseDate}</span>}
        </div>

        <div className="field">
          <label htmlFor="price">Price ($)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit">{isEdit ? 'Save changes' : 'Add asset'}</button>
          <Link className="button light" to="/">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}

export default AssetForm
