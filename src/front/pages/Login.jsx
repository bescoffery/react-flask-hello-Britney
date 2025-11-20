import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(null);

    fetch(import.meta.env.VITE_BACKEND_URL + "/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error("Invalid email or password.");
            } else {
                throw new Error("Login failed. Please try again later.");
            }
        })
        .then(data => {
            // 2. Crucial Step: Save the access token to sessionStorage
            sessionStorage.setItem("token", data.access_token);
            
            // Optional: Dispatch event to instantly update the Navbar/Layout
            window.dispatchEvent(new Event('storage')); 

            // 3. Redirect to the private dashboard
            navigate("/private");
        })
        .catch(error => {
            console.error("Login error:", error);
            setMessage(`Error: ${error.message}`);
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">User Login</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {message && (
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="emailInput" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordInput" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Log In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};