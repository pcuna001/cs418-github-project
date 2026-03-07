import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from './Field.jsx';
//import "./Signup.css";

export default function ChangeInfo({ onRegister }) {
    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        password_confirm: "",
    });

    const [currentPassword, setCurrentPassword] = useState();
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [submission, setSubmission] = useState("");
    const navigate = useNavigate();

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value}));
    }

    function validateInfo() {
        const e = {};
        if (!form.username.trim()) e.username = "Please enter a username!";
        if (!form.firstName.trim()) e.firstName = "You have not entered your first name.";
        if (!form.lastName.trim()) e.lastName = "You have not entered your first name.";
        if (form.password.length < 8) e.password = "Password needs to be 8 characters long."
        if (currentPassword.trim.length < 8) e.currentPassword = "Password needs to be 8 characters long."
        if (form.password !== form.password_confirm)
            e.password_confirm = "Passwords do not match. Please reinput the password you typed in.";
        return e;
    }

    function submitInfo(e) {
        const v = validateInfo();
        setErrors(v);
        handlePassword();
        
        navigate("/profile");
    }

    const handlePassword = async(e) => {
        e.preventDefault();
        setSubmission(true);

        setLoading(true);

        try {
            const res = await fetch(import.meta.env.VITE_API_KEY + "user/login", {
                method: POST,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    u_password: password,
                }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(json?.message || "Password does not match your current password.");
                return;
            }

            navigate("/profile");
        } catch (err) {
            setError(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        };
    };

    const invalidPassword = submission && currentPassword.trim().length < 8;

    return (
        <form className="signup" onSubmit={submitInfo}>
            <h3 className="signup-title">Change info</h3>
            <Field label="Username" error={errors.username}>
                <input
                    className={`signup-input ${errors.username ? "error" : ""}`}
                    value={form.username}
                    onChange={(e) => updateField("username", e.target.value)}
                />
            </Field>
            <Field label="First name" error={errors.firstName}>
                <input
                    className={`signup-input ${errors.firstName ? "error" : ""}`}
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                />
            </Field>
            <Field label="Last name" error={errors.lastName}>
                <input
                    className={`signup-input ${errors.lastName ? "error" : ""}`}
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                />
            </Field>
            <Field label="New password" error={errors.password}>
                <input
                    type="password"
                    className={`signup-input ${errors.password ? "error" : ""}`}
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                />
            </Field>
            <Field label="Confirm new password" error={errors.password_confirm}>
                <input
                    type="password"
                    className={`signup-input ${errors.password_confirm ? "error" : ""}`}
                    value={form.password_confirm}
                    onChange={(e) => updateField("password_confirm", e.target.value)}
                />
            </Field>
            <p>
                <label className={invalidPassword ? "invalid" : ""}>Current password</label>
                <input
                    type="password"
                    value={currentPassword}
                    className={invalidPassword ? "invalid" : ""}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                />
            </p>

            <button className="signup-button" type="submit">
                Update profile
            </button>
        </form>
    );
}