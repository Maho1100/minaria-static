import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Stage1 from "./pages/Stage1.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Minaria</h1>
      <Link to="/stage1">Stage1へ</Link>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stage1" element={<Stage1 />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
