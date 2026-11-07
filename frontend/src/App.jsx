import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import AssetList from './pages/AssetList'
import AssetForm from './pages/AssetForm'
import SearchAsset from './pages/SearchAsset'
import About from './pages/About'

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<AssetList />} />
          <Route path="/add" element={<AssetForm key="add" />} />
          <Route path="/edit/:id" element={<AssetForm key="edit" />} />
          <Route path="/search" element={<SearchAsset />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App
