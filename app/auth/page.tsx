"use client"

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';
import { useUser } from '@/app/context/userContext';

export default function Login() {
  
    const [formData, setFormData] = useState({
        matricNo: '',
        password: '',
      });
    
      const [message, setMessage] = useState('');
      const router = useRouter();
      const { setUser } = useUser();
      const handleChange =(e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async(e:any) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/api/students/login', formData);
          setMessage(response.data.message);
          const { token, user:userData } = response.data;
          if(!userData){
            return;
          }
          const {user} = userData;
          
          if (token) {    
            Cookies.set('token', token, { expires: 1, path: '/', sameSite: 'Strict' });
            Cookies.set('user', JSON.stringify(user), { expires: 1, path: '/', sameSite: 'Strict' });
            setUser(user); 
            router.push('/auth/face-verify');
          }
        } catch (error : any) {
          if (error.response && error.response.data && error.response.data.message) {
            setMessage(error.response.data.message); 
            console.error(error.response.data.message);
          } else {
            setMessage('Error logging in');
          }
          console.error('Error logging in:', error);
        }
      };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
                <h2 className="text-xl font-bold text-center">Student Login</h2>
                {message ?
                <div className="bg-red-100 p-3 text-center text-red-400  w-full">{message}</div>:
                <div className="text-center bg-green-100 p-3">Fill in all fields</div>
                }
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Matric Number
                        </label>
                        <input
                            id="matricNo"
                            name="matricNo"
                            type="text"
                            required
                            value={formData.matricNo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
