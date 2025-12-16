import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AuthPage() {

  const [username, setusername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const getUsername = (e) => {
    setusername(e.target.value)
  }

  const getPassword = (e) => {
    setPassword(e.target.value)
  }


  const getAuthenticated = async () => {

    console.log(`username: ${username}, password: ${password}`)
    let token = ''

    const res = await fetch("/api/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    const data = await res.json()

    token = data.token

    if (token) {
      console.log('login successfull')
      localStorage.setItem('token', token)
      navigate('/todos')
    }


  }

  return (
    <div className="font-sans flex w-max-5xl h-screen justify-center items-center bg-gray-500">
      <div className="bg-emerald-600 p-8 text-center rounded-2xl shadow-4xl shadow-amber-600">
        <div className="font-bold text-xl">Welcome Bro !</div><hr />
        <div className="mt-4">
          <form action="">
            <label htmlFor="username">Username</label><br />
            <input className="border rounded-xl p-2 m-2" name="userName" id="userName" type="text" value={username} onChange={getUsername} /><br />
            <label htmlFor="password">Password</label><br />
            <input className="border rounded-xl p-2 m-2" name="password" id="password" type="password" value={password} onChange={getPassword} />
          </form>
          <button className="p-2 border-2 m-2 rounded-xl" onClick={getAuthenticated}> Sign In</button>
        </div>
      </div>
    </div>
  )

}

export default AuthPage