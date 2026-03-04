import { useState } from "react";
import Field from './Field.jsx';
//import "./Signup.css";

export default function Signup({ onRegister }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password_confirm: "",
    });

    const [errors, setErrors] = useState({});

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value}));
    }

    function validateInfo() {
        const e = {};
        if (!form.username.trim()) e.username = "Please enter a username!";
        if (!form.email.includes("@")) e.email = "Invalid email address! Please input a correct email address.";
        if (form.password.length < 8) e.password = "Password needs to be 8 characters long."
        if (form.password !== form.password_confirm)
            e.password_confirm = "Passwords do not match. Please reinput the password you typed in.";
        return e;
    }

    function submitInfo(e) {
        const v = validateInfo();
        setErrors(v);

        if (Object.keys(v).length === 0) {
            onRegister({
                username: form.username,
                email: form.email.toLowerCase(),
            });
        }
    }

    return (
        <form className="signup" onSubmit={submitInfo}>
            <h3 className="signup-title">Create your account</h3>

            <Field label="Username" error={errors.username}>
                <input
                    className={`signup-input ${errors.username ? "error" : ""}`}
                    value={form.username}
                    onChange={(e) => updateField("username", e.target.value)}
                />
            </Field>
            <Field label="Email" error={errors.email}>
                <input
                    className={`signup-input ${errors.email ? "error" : ""}`}
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                />
            </Field>
            <Field label="Password" error={errors.password}>
                <input
                    type="password"
                    className={`signup-input ${errors.password ? "error" : ""}`}
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                />
            </Field>
            <Field label="Confirm password" error={errors.password_confirm}>
                <input
                    type="password"
                    className={`signup-input ${errors.password_confirm ? "error" : ""}`}
                    value={form.password_confirm}
                    onChange={(e) => updateField("password_confirm", e.target.value)}
                />
            </Field>

            <button className="signup-button" type="submit">
                Sign up
            </button>
        </form>
    )
}