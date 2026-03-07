import { Navigate, useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    const stored = localStorage.getItem("currentUser");
    const user = stored ? JSON.parse(stored) : null;

    function handleLogout() {
        localStorage.removeItem("currentUser");
        navigate("/login", { replace: true });
    }

    if (!user)
        return <Navigate to="/login" replace />;

    return (
        <div>
            <h2>User profile:</h2>
            <p><b>Username: </b> <span>{user.u_username}</span></p>
            <p><b>Full name: </b> <span>{user.u_firstname} {user.u_lastname}</span></p>
            <p><b>Email: </b> <span>{user.u_email}</span></p>
        </div>
    );
}