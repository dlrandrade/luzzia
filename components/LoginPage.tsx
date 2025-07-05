import React, { useState } from 'react';
import { LuzzIALogo } from './icons';
import { backendService } from '../services/backendService';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setError('Usuário e senha não podem estar vazios.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const user = await backendService.login(username.trim(), password);
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao tentar entrar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 text-white">
      <div className="w-full max-w-md p-8 md:p-12 space-y-8 glass-effect rounded-xl shadow-2xl border border-sky-500/30">
        <div className="text-center">
          <LuzzIALogo className="text-white mx-auto" />
          <p className="mt-2 text-sm text-sky-300">por Daniel Luzz</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-b-0 border-sky-600/50 placeholder-sky-400/70 text-sky-100 bg-sky-900/30 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                placeholder="Usuário (admin ou user)"
              />
            </div>
            <div>
              <label htmlFor="password-login" className="sr-only">
                Senha
              </label>
              <input
                id="password-login"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-sky-600/50 placeholder-sky-400/70 text-sky-100 bg-sky-900/30 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                placeholder="Senha (admin ou user)"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-900 focus:ring-sky-500 transition-colors duration-150 disabled:bg-sky-700/60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <a
            href="#" // Este link levaria para a Kiwify ou sua landing page de vendas
            onClick={(e) => { e.preventDefault(); alert("Link para landing page/checkout externo (Kiwify).");}}
            className="font-medium text-sky-400 hover:text-sky-300 transition-colors duration-150"
          >
            Quero você, LuzzIA!
          </a>
        </div>
      </div>
       <p className="mt-8 text-xs text-sky-400/60 text-center">
        Backend simulado com dados persistidos no seu navegador.<br/>
        Use <span className="font-bold">admin/admin</span> para acesso administrativo ou <span className="font-bold">user/user</span> para um usuário padrão.
      </p>
    </div>
  );
};

export default LoginPage;
