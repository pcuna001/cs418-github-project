import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import '.App.css';

function App() {
    return (
        <>
        {

        }
        
        <Router>
            <Header/>
            <main>
                <Routes>
                    <Route path ="" element={<login />}/>
                </Routes>
            </main>
        </Router>
        </>
    )
}