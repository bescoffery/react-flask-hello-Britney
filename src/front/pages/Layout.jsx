import { Outlet, Routes, Route, Navigate } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
// import { Navigate } from "react-router-dom";
// import { Signup } from "./Signup"; 
// import { Login } from "./Login";
// import { Private } from "./Private";


const PrivateRoute = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem("token");
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
            <Navbar />
            <main>
            <div className="container py-4"> {/* Container for content centering */}
                 <Outlet />
                </div>
            </main>
            <Footer />
        </ScrollToTop>
    )
}