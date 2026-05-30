import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      // On success, redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="rounded bg-white p-8 shadow-md w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
