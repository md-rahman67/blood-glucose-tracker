import { useNavigate } from "react-router-dom";
import './Logout.css';

export default function Logout({ setCurrUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST"
            });

            const result = await response.json();

            if (response.ok) {
                alert("User Logged out");
                setCurrUser(null);
                navigate("/");
            }
        } catch (error) {
            console.error("Error: Logout failed", error);
        }
    }
    return (
        <>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </>
    )
}
