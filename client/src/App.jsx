import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import '.App.css';
import Signup from "./Signup.jsx";

function App() {
    return (
        <>
        {

        }
        
        <Router>
            <Header/>
            <main>
                <Routes>
                    <Route path ="/login" element={<Login />}/>
                    <Route path ="/signup" element={<Signup />}/>
                </Routes>
            </main>
        </Router>
        </>
    )
}