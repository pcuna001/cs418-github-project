import { NavLink } from "react-router-dom";
//import "./Signup.css";

export default function Field({label, error, children}) {
    return (
        <div className="signup">
            <label className="signup-label">{label}</label>
            {children}
            {error && <div classname="signup-error">{error}</div>}
        </div>
    )
}