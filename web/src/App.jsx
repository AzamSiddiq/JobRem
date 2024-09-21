import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './Signin.jsx';
import Signup from './Signup.jsx';
import Appbar from './AppBar.jsx';
import Table from './Table.jsx';
import Home from './Home.jsx';
import { RecoilRoot } from 'recoil';

function App() {
    return (
        <RecoilRoot>
            <Router>
                <div style={{
                    height: "100vh",
                    width: '100vw',
                    backgroundColor: "#90ecfd"
                }}>
                    <Appbar />
                    <Routes>
                        <Route path="/Signin" element={<Signin />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/Table" element={<Table />} />
                        <Route path ="/" element={<Home />} />
                    </Routes>
                </div>
            </Router>
        </RecoilRoot>
    );
}

export default App;
