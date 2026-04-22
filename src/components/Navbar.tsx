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
    const displayName = user?.user_metadata.user_name || user?.email
    return (
        <div>
            <nav className='navbar'>

                <Link to="/">
                    <div className="logo-wrapper">
                        <img className="logo" src={logo} alt="" />
                    </div>
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
                <div className="auth-section">
                    {user ? (
                        <div className="user-info">
                            {user.user_metadata.avatar_url && (
                                <img className="avatar" src={user.user_metadata.avatar_url} alt="" />
                            )}
                            <span className="username">{displayName}</span>
                            <button className="logout-btn" onClick={signOut}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button className="github-btn" onClick={signInWithGitHub}>
                            <FontAwesomeIcon icon={faSquareGithub} size="lg" />
                            <span>Sign in with GitHub</span>
                        </button>
                    )}
                </div>


                {/* Mobile Menu */}
                {menuOpen && (
                    <div className='mobile-menu'>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/create" onClick={() => setMenuOpen(false)}>Create Post</Link>
                        <Link to="/communities" onClick={() => setMenuOpen(false)}>Communities</Link>
                        <Link to="/community/create" onClick={() => setMenuOpen(false)}>Create Community</Link>

                        {user ? (
                            <button className="logout-btn" onClick={signOut}>
                                Sign Out
                            </button>
                        ) : (
                            <button className="github-btn" onClick={signInWithGitHub}>
                                <FontAwesomeIcon icon={faSquareGithub} size="lg" />
                                <span>Sign in with GitHub</span>
                            </button>
                        )}
                    </div>
                )}


            </nav>
        </div>
    )
}

export default Navbar
