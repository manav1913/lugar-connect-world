import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faSquareGithub } from '@fortawesome/free-brands-svg-icons'
import logo from "../assets/logo.png"
import "./Navbar.css"
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const { signInWithGitHub, signOut, user } = useAuth()
    return (
        <div>
            <nav className='navbar'>

                <Link to={"/"}>
                    <img className='logo' src={logo} alt="" />
                </Link>
                {/* Desktop links */}
                <div className='nav-links'>
                    <Link to={"/"}>Home</Link>
                    <Link to={"/create"}>Create Post</Link>
                    <Link to={"/communities"}>Communities</Link>
                    <Link to={"/community/create"}>Create Community</Link>
                </div>
                {/* Mobile Menu Hamburger */}
                <div>
                    <button className='menu-btn' onClick={() => setMenuOpen((prev) => !prev)}>
                        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
                    </button>
                </div>

                {/*Desktop Auth  */}
                <button className="github-btn" onClick={signInWithGitHub}>
                    <FontAwesomeIcon icon={faSquareGithub} />
                    <span>Sign in with GitHub</span>
                </button>

                {/* Mobile Menu */}

                {menuOpen && (
                    <div className='mobile-menu'>
                        <Link to={"/"}>Home</Link>
                        <Link to={"/create"}>Create Post</Link>
                        <Link to={"/communities"}>Communities</Link>
                        <Link to={"/community/create"}>Create Community</Link>
                    </div>
                )}


            </nav>
        </div>
    )
}

export default Navbar
