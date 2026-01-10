import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "./api.js"

function AuthPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let data
      
      if (isRegister) {
        data = await authAPI.register(username, password)
      } else {
        data = await authAPI.login(username, password)
      }
      
      if (data.accessToken) {
        console.log('Authentication successful')
        navigate('/todos')
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-sans flex w-max-5xl h-screen justify-center items-center bg-gray-500">
      <div className="bg-emerald-600 p-8 text-center rounded-2xl shadow-4xl shadow-amber-600">
        <div className="font-bold text-xl">
          {isRegister ? 'Create Account' : 'Welcome Back!'}
        </div>
        <hr className="my-2" />
        
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mt-4">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className="block text-left mb-1">Username</label>
            <input 
              className="border rounded-xl p-2 m-2 w-full"
              name="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            
            <label htmlFor="password" className="block text-left mb-1">Password</label>
            <input 
              className="border rounded-xl p-2 m-2 w-full"
              name="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            
            <button 
              className="p-2 border-2 m-2 rounded-xl w-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isRegister ? 'Register' : 'Sign In')}
            </button>
          </form>
          
          <button 
            className="p-2 border-2 m-2 rounded-xl w-full bg-gray-200 hover:bg-gray-300"
            onClick={() => setIsRegister(!isRegister)}
            disabled={loading}
          >
            {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPage