import { NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <header className="navbar">
      <span className="brand">Computer Asset Registry</span>
      <nav>
        <NavLink to="/" end>
          Assets
        </NavLink>
        <NavLink to="/add">Add asset</NavLink>
        <NavLink to="/search">Search by ID</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  )
}

export default NavBar
