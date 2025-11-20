import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(null);

    fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (response.status === 201) {
                return response.json(); // Success: User created
            } else if (response.status === 409) {
                // Conflict: Email already exists
                throw new Error("Email already registered.");
            } else {
                // Other errors (e.g., 400 Bad Request)
                throw new Error("Failed to create user. Check your input.");
            }
        })
        .then(data => {
            // 2. Success: Notify user and redirect to login
            console.log("Signup success:", data);
            setMessage("Sign up successful! Please log in.");
            
            // Redirect after a short delay
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        })
        .catch(error => {
            // 3. Handle errors and display feedback
            console.error("Signup error:", error);
            setMessage(`Error: ${error.message}`);
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Create Account</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {message && (
                        <div className={`alert ${message.includes("successful") ? "alert-success" : "alert-danger"}`} role="alert">
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
                        <button type="submit" className="btn btn-success w-100">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}