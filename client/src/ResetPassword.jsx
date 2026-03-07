import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from './Field.jsx';
//import "./Signup.css";

export default function ResetPassword({ onRegister }) {
    const [form, setForm] = useState({
        password: "",
        password_confirm: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value}));
    }

    function validateInfo() {
        const e = {};
        if (form.password.length < 8) e.password = "Password needs to be 8 characters long."
        if (form.password !== form.password_confirm)
            e.password_confirm = "Passwords do not match. Please reinput the password you typed in.";
        return e;
    }

    function submitInfo(e) {
        const v = validateInfo();
        setErrors(v);

        //navigate("/login");
    }

    return (
        <form className="signup" onSubmit={submitInfo}>
            <h3 className="signup-title">Reset password</h3>
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
                Reset password
            </button>
        </form>
    );
}