import { useState } from "react";
import Field from './Field';
import "./Signup.css";

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

    function pushInfo(e) {
        const v = validate();
        setErrors(v)
    }
}