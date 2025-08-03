'use client';

import { useState } from 'react';
import Form from 'next/form';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();

            window.location.href = '/';
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Form onSubmit={handleSubmit} className="max-w-md w-full p-6 bg-white shadow-md rounded text-black">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <label htmlFor="password" className="block text-sm font-medium mb-2 mt-4">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </Form>
        </div>
    )
}