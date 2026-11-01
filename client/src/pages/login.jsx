import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api.js';
import { useAuth } from '../context/authContext.jsx';

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isRegister ? '/register' : '/login';
        try {
            const res = await api.post(endpoint, { email, password });
            if (res.data?.success) {
                // Fetch logged-in user profile
                try {
                    const meRes = await api.get('/me');
                    setUser(meRes.data.user);
                } catch {
                    setUser(res.data.User || { email });
                }
                navigate('/');
            }
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.errors?.[0]?.message ||
                err.message ||
                'Something went wrong';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
                {isRegister ? 'Register Account' : 'Login'}
            </h2>

            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email:</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Password:</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                >
                    {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                    type="button"
                    onClick={() => { setIsRegister(!isRegister); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
            </div>
        </div>
    );
}
