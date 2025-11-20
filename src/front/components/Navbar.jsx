import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
//  Initialize state by checking for the token in session storage
	const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));

	useEffect(() => {
        const updateLoginStatus = () => {
            // Check if the token exists and update the state
            setIsLoggedIn(!!sessionStorage.getItem("token"));
        };

		window.addEventListener('storage', updateLoginStatus);
		updateLoginStatus();

		return () => window.removeEventListener('storage', updateLoginStatus);
    }, []);


	// LOGOUT Handler
    const handleLogout = () => {
        // Remove the token
        sessionStorage.removeItem("token");

		setIsLoggedIn(false); 
        window.dispatchEvent(new Event('storage'));

		navigate("/login");
    };

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Authentication system with Python Flask and React.js</span>
				</Link>
				<div className="ml-auto">
					{/* 4. Conditional Rendering */}
                    {!isLoggedIn ? (
                        // SHOW: Login and Signup buttons if NOT logged in
                        <>
						<Link to="/login" className="btn btn-primary me-2">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-success">
                                Signup
                            </Link>
						</>
					) : (
						// SHOW: Private Dashboard link and Logout button if logged in
                        <>
                            <Link to="/private" className="btn btn-info me-2">
                                Private Dashboard
                            </Link>
                            <button 
                                className="btn btn-danger" 
                                onClick={handleLogout} // Calls the logout function
                            >
								Logout
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};