import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import "./Login.css";

export default function VerifyAccount() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const [submission, setSubmission] = useState("");

    const navigate = useNavigate();

    // Get email
    const email = localStorage.getItem("pendingOtpEmail") || "";

    const handleVerifyOtp = async(e) => {
        e.preventDefault();
        setSubmission(true);
        setError("");

        if (!email) {
            setError("Can't find login info. Please login and try again.");
            return;
        }

        const otpSanitized = otp.trim();
        
        // Check OTP
        if(!/^\d{6}$/.test(otpSanitized)) {
            setError("Invalid passcode. Please enter a valid 6-digit code.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(import.meta.env.VITE_API_KEY + "user/verify-login-otp",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        otp: otpSanitized,
                    }),
                }
            );

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(json?.message || "2FA verification failed.");
                return;
            }

            const user = json?.data ?? null;
            if (!user) {
                setError("User missing or invalid. Cannot continue 2FA verification.");
                return;
            }

            // Once checks are verified, redirect user
            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.removeItem("pendingOtpEmail");

            navigate("/profile");
        } catch (err) {
            setError(err?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const invalidOtp = submission && !/^\d{6}$/.test(otp.trim());

    return (
        <div id="login">
            {error && (
                <div style={{
                    background: "#fee",
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleVerifyOtp}>
                <p>A one-time passcode has been sent to your email account <input type="email" value={email} disabled />.</p>            
                <p>Please check your emails for the code.</p>
                <div className="input">
                    <p>
                        <label className={invalidOtp ? "invalid" : ""}>Code</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            className={invalidOtp ? "invalid" : ""}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter your 6-digit OTP"
                        />
                    </p>
                </div>

                <div className="actions">
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Verifying...": "Verify"}
                    </button>
                </div>
            </form>
        </div>
    );
}