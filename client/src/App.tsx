import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'

import { Users } from './views/Users'
import { Landing } from './views/Landing'

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/users" element={<Users />} />
            </Routes>
        </Router>
    )
}
