import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/logo.jpg";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../context/userContext";

export const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);

  const { currentUser } = useContext(UserContext);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  // Dynamically handle screen resize to show/hide navigation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setIsNavShowing(true);
      } else {
        setIsNavShowing(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container nav_container">
      <Link to="/" className="nav_logo" onClick={closeNavHandler}>
        <img src={Logo} alt="Navbar Logo" />
      </Link>

      {currentUser?.id && isNavShowing && (
        <ul className="nav_menu">
          <li>
            <Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>
              {currentUser?.name}
            </Link>
          </li>
          <li>
            <Link to="/create" onClick={closeNavHandler}>
              Create Post
            </Link>
          </li>
          <li>
            <Link to="/authors" onClick={closeNavHandler}>
              Authors
            </Link>
          </li>
          <li>
            <Link to="/logout" onClick={closeNavHandler}>
              Logout
            </Link>
          </li>
        </ul>
      )}

      {!currentUser?.id && isNavShowing && (
        <ul className="nav_menu">
          <li>
            <Link to="/authors" onClick={closeNavHandler}>
              Authors
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={closeNavHandler}>
              Login
            </Link>
          </li>
        </ul>
      )}

      <button
        className="nav_toggle-btn"
        onClick={() => setIsNavShowing(!isNavShowing)}
      >
        {isNavShowing ? <AiOutlineClose /> : <FaBars />}
      </button>
    </div>
  );
};

export default Header;
