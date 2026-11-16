import { useNavigate } from "react-router-dom";
import './Logout.css';

export default function Logout({ setCurrUser, setData }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST"
            });

            const result = await response.json();
            console.log(result);
            if (response.ok) {
                alert("User Logged out");
                setCurrUser(null);
                setData({});
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
