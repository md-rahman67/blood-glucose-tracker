export default function Logout() {

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST"
            });

            const result = await response.json();

            if (response.ok) {
                alert("User Logged out");
            }
        } catch (error) {
            console.error("Error: Logout failed", error);
        }
    }
    return (
        <>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}