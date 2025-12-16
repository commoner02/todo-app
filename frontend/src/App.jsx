import { BrowserRouter, Routes, Route } from "react-router";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";
import Test from "./TestApp"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/todos" element={<Dashboard />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<div>404-Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
