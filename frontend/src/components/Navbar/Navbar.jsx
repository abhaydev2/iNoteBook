import { useState, useContext } from 'react';
import './Navbar.css';
import { FaBars, } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleMenuClick = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // redirect to login after logout
  };

  return (
    <nav>
      <div className="menu-icon" onClick={handleMenuClick}>
        <FaBars />
      </div>
      <Link to='/'>  <div className="logo">
        iNoteBook
      </div>
      </Link>

      <ul className={`nav-items ${menuActive ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        {isAuthenticated && <li><Link to="/mynotes">My Notes</Link></li>}
      </ul>

      <div className="buttons">
       {!isAuthenticated ?
        <><Link to='/Login'>  <button>Login</button></Link><Link to='/Signup'>    <button>SignUp</button></Link></>:
          <button onClick={handleLogout}>Logout</button> 
      }
      </div>

    </nav>
  );
};

export default Navbar;
