import { BrowserRouter, Routes, Route } from "react-router"
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import Dashboard from './pages/DashboardPage'
import ForgotPassword from './pages/ForgotPasswordPage'
import ProtectedRoute from "./router/ProtectedRoutes"
import {AuthProvider} from "./auth/AuthContext"
import ToastProvider from "./components/ToastProvider"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App