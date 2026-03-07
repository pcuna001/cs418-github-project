import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import "./Login.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const [submission, setSubmission] = useState("");

    const navigate = useNavigate();

    function handleInputChange(identifier, value) {
        if (identifier === "username") setUsername(value);
        else setPassword(value);
    }

    const handleLogin = async(e) => {
        e.preventDefault();
        setSubmission(true);
        setError("");

        if(!username) {
            setError("Username not found or invalid. Please enter a valid username.");
            return;
        }

        if(password.trim().length < 8) {
            setError("Password needs to be 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(import.meta.env.VITE_API_KEY + "user/login", {
                method: POST,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    u_username: username,
                    u_password: password,
                }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(json?.message || "Login has failed.");
                return;
            }
            
            console.log(res);
            console.log(res.email);
            
            localStorage.setItem("pendingOtpEmail", res.email);

            navigate("/verify-otp");
        } catch (err) {
            setError(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        };
    };

    const invalidUsername = submission && !username;
    const invalidPassword = submission && password.trim().length < 8;

    return (
        <div id="login">
            {error && (
                <div style={{
                    background: "#fee",
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="input">
                    <p>
                        <label className={invalidUsername ? "invalid" : ""}>Username</label>
                        <input
                            type="text"
                            value={username}
                            className={invalidUsername ? "invalid" : ""}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                        />
                    </p>

                    <p>
                        <label className={invalidPassword ? "invalid" : ""}>Password</label>
                        <input
                            type="password"
                            value={password}
                            className={invalidPassword ? "invalid" : ""}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                        />
                    </p>
                </div>

                <div className="actions">
                    <Link to="/signup" className="button" style={{ textAlign: "center"}}>
                        Create new account
                    </Link>
                    <Link to="/resetpassword" className="button" style={{ textAlign: "center"}}>
                        Forgot password?
                    </Link>
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Signing in...": "Sign in"}
                    </button>
                </div>
            </form>
        </div>
    );
}