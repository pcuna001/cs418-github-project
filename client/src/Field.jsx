import { NavLink } from "react-router-dom";
//import "./Signup.css";

export default function Field({label, error}) {
    return (
        <div className="signup">
            <label className="signup-label">{label}</label>
            {error && <div classname="signup-error">{error}</div>}
        </div>
    )
}