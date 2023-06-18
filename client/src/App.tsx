import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'

import { Users } from './components/Users'

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Users />} />
            </Routes>
        </Router>
    )
}
