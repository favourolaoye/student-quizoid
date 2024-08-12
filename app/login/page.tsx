"use client"

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [matricNo, setMatricNo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/students/login', {
        matricNo,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/verify');
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      setMessage('Login error');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Matric Number"
          value={matricNo}
          onChange={(e) => setMatricNo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
