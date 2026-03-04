import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Header from "./Header.jsx";
import Profile from "./Profile.jsx";
import VerifyAccount from "./VerifyOtp.jsx";
import ResetPassword from "./ResetPassword.jsx";

function App() {
    return (
        <>
            <Router>
                <Header/>
                <main>
                    <Routes>
                        <Route path ="/login" element={<Login />}/>
                        <Route path ="/signup" element={<Signup />}/>
                        <Route path ="/profile" element={<Profile />}/>
                        <Route path ="/verify-otp" element={<VerifyAccount />}/>
                        <Route path ="/resetpassword" element={<ResetPassword />}/>
                    </Routes>
                </main>
            </Router>
        </>
    )
}

export default App