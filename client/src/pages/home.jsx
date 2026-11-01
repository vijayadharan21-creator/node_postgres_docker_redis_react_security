import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router';

export default function Home() {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            try {
                const res = await api.get("/health");
                setMessage(res.data.message);
            } catch (e) {
                setError(e.response?.data?.message || e.message);
            }
        }
        getData();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch {
            // Ignore error
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{ backgroundColor: '#ef4444', color: 'white', padding: '6px 14px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>

            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                <p><strong>Logged in as:</strong> {user?.email || 'Authenticated User'}</p>
                <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
            </div>

            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                <p><strong>Server Status:</strong> {message ? <span style={{ color: '#16a34a' }}>● {message}</span> : 'Checking...'}</p>
                {error && <p style={{ color: '#dc2626' }}>Error: {error}</p>}
            </div>
        </div>
    );
}
