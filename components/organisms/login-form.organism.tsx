'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/atoms/index.atoms';
import { useAuth } from '@/contexts/auth.context';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4'>
      <div className='w-full max-w-md'>
        <div className='mb-12 text-center'>
          <h1 className='font-display text-4xl font-bold tracking-tight text-white mb-2 uppercase'>
            Luci UI
          </h1>
          <p className='text-zinc-500 font-mono text-xs uppercase tracking-widest'>
            [ Access Control ]
          </p>
        </div>

        <div className='bg-surface border border-border p-8 shadow-2xl'>
          <h2 className='text-xl font-display font-bold text-white mb-6 uppercase tracking-wider'>
            Login
          </h2>

          {error && (
            <div className='mb-6 bg-red-500/10 border border-red-500/50 p-4 text-sm text-red-500 font-mono'>
              {error}
            </div>
          )}

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <label className='text-xs font-mono text-zinc-500 uppercase tracking-widest'>
                Email Address
              </label>
              <input
                className='w-full bg-zinc-900 border border-border p-3 text-white focus:outline-none focus:ring-1 focus:ring-white transition-all font-mono'
                onChange={e => setEmail(e.target.value)}
                placeholder='hi@krishalshah.in'
                required
                type='email'
                value={email}
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-mono text-zinc-500 uppercase tracking-widest'>
                Access Key
              </label>
              <input
                className='w-full bg-zinc-900 border border-border p-3 text-white focus:outline-none focus:ring-1 focus:ring-white transition-all font-mono'
                onChange={e => setPassword(e.target.value)}
                placeholder='••••••••'
                required
                type='password'
                value={password}
              />
            </div>

            <Button
              className='w-full py-6 font-display font-bold uppercase tracking-widest'
              disabled={isLoading}
              type='submit'
            >
              {isLoading ? 'Verifying...' : 'Authenticate'}
            </Button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-sm text-zinc-500 font-mono uppercase tracking-widest'>
              New here?{' '}
              <Link className='text-white hover:underline' href='/signup'>
                Request Authorization
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
