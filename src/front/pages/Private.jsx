import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [userData, setUserData] = useState("Loading...");
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        // The PrivateRoute wrapper should handle the initial redirect, but we verify here too
        if (!token) {
            navigate("/login");
            return;
        }

        fetch(process.env.BACKEND_URL + "/api/private", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                // Token is invalid or expired: force logout and redirect
                sessionStorage.removeItem("token");
                window.dispatchEvent(new Event('storage'));
                navigate("/login");
                throw new Error("Session expired or unauthorized. Please log in.");
            } else {
                throw new Error("Failed to fetch private data.");
            }
        })
        .then(data => {
            setUserData(`Success! ${data.message}`);
        })
        .catch(error => {
            console.error("Private fetch error:", error);
            setUserData(`Error accessing data: ${error.message}`);
        });

    }, [navigate]);


    const handleLogout = () => {
        sessionStorage.removeItem("token");
        window.dispatchEvent(new Event('storage'));
        navigate("/login");
    };
    return (
        <div className="container mt-5">
            <h1 className="text-center text-info">🔐 Private Dashboard</h1>
            <div className="p-4 bg-light border rounded">
                <p className="lead">You are viewing protected content because your token was validated.</p>
                <p>API Response: <strong>{userData}</strong></p>
                <hr />
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout Now
                </button>
            </div>
        </div>
    );
};