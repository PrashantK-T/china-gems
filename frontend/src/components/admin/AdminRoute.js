import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminMe } from '../../lib/api';

export default function AdminRoute({ children }) {
    const [status, setStatus] = useState('checking'); // checking / ok / fail
    useEffect(() => {
        const token = localStorage.getItem('hg_admin_token');
        if (!token) {
            setStatus('fail');
            return;
        }
        adminMe()
            .then(() => setStatus('ok'))
            .catch(() => {
                localStorage.removeItem('hg_admin_token');
                setStatus('fail');
            });
    }, []);
    if (status === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--hg-bg-0)]">
                <div className="text-[var(--hg-gold)] tracking-[0.32em] uppercase text-xs animate-pulse">Authenticating…</div>
            </div>
        );
    }
    if (status === 'fail') {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
}
