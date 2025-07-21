import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'

// Components
import Layout from './components/Layout'
import AuthGuard from './components/auth/AuthGuard'

// Pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Tasks from "./pages/Tasks"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/tasks" element={<Tasks />} />
          {/* Catch-all for 404 */}
          <Route path="*" element={<div>404 No encontrado.</div>} />
        </Route>
      </Routes>
      <ToastContainer theme="colored"

      />
    </BrowserRouter>
  )
}

export default App
