import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "./App.css";

import DashBoard from "./components/DashBoard";
import { Users } from './components/Users';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<DashBoard />} />
      </Routes>
    </Router>
  );
}
