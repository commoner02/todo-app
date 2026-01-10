import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import AuthPage from "./AuthPage.jsx"
import Dashboard from "./Dashboard"
import Test from "./TestApp"
import { authAPI } from "./api.js"

function App() {
  // Check authentication status
  const isAuthenticated = authAPI.isAuthenticated()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/todos" : "/auth"} />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/todos" element={<Dashboard />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App