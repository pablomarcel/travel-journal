import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './NavBar.css';
import { useNavigate } from "react-router";
import logo from "../logo/Travel-Journal.png";

import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice'

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const username = user ? `${user.firstName} ${user.lastName}` : '' ;
  const userImage = user && user.image ? <img src={`/${user.image}`} alt = '' className='nav-image' /> : null;
  const handleLogout = async () => {
    try {
      dispatch(logout())
      dispatch(reset())
      setOpen(false);
      navigate("/");
    } catch (error) {
      return <p>{error.message}</p>;
    }
  };

  return (
		<nav className="navbar">
			<NavLink to="/" className="nav-logo">
        <img className='nav-img' src={logo} alt='logo' />
        Travel Journal
      </NavLink>
			<div onClick={()=>setOpen(!open)} className="nav-icon">
				{open ? <FiX /> : <FiMenu />}
			</div>

      {user ? (
        <ul className={open ? 'nav-links active' : 'nav-links'}>
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active nav-link' : 'inactive nav-link')}
              onClick={()=>setOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/userHome"
              className={({ isActive }) => (isActive ? 'active nav-link' : 'inactive nav-link')}
              onClick={()=>setOpen(false)}
            >
              My Posts
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/favoritePost"
              className={({ isActive }) => (isActive ? 'active nav-link' : 'inactive nav-link')}
              onClick={()=>setOpen(false)}
            >
              My Favorite Posts
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to={`/profile/${user._id}`}
              className={({ isActive }) => (isActive ? 'active nav-link' : 'inactive nav-link')}
              onClick={()=>setOpen(false)}
            >
              My Profile
            </NavLink>
          </li>
          <li className="nav-item">
            {/* <Button onClick={handleLogout} variant="primary" size="sm">Log out</Button> */}
            <button className='nav-btn' onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
          <li className="nav-item">
            {userImage ? userImage : <div className='nav-text'>{username}</div>}
          </li>
        </ul>
        ):(
          <ul className={open ? 'nav-links active' : 'nav-links'}>
            <li className="nav-item">
              <NavLink to="/" className="nav-link" onClick={()=>setOpen(false)}>Home</NavLink>
            </li>
    
            <li className="nav-item">
              <NavLink to="/login" className="nav-link" onClick={()=>setOpen(false)}>
                <FaSignInAlt /> Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/register" className="nav-link" onClick={()=>setOpen(false)}>
                <FaUser /> Register
              </NavLink>
            </li>
          </ul>
        )}
		</nav>
  )
}

export default NavBar
