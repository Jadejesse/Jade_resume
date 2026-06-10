import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/Home.jsx';
import Resume from '../pages/Resume/Resume.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/index.html" element={<Home />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/resume.html" element={<Resume />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
