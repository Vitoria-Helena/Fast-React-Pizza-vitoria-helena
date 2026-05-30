// src/features/auth/RegisterForm.jsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError, selectAuthError } from './authSlice';

export default function RegisterForm() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const error     = useSelector(selectAuthError);

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) dispatch(clearError());
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert('As senhas não coincidem!');
      return;
    }
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
    // ProtectedRoute redireciona automaticamente se o login falhar
    navigate('/menu');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-2xl font-bold uppercase tracking-widest text-yellow-500">
          Criar Conta
        </h2>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded bg-red-100 p-2 text-center text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Seu nome"
            value={form.name}
            onChange={handleChange}
            required
            className="input w-full"
          />
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="input w-full"
          />
          <input
            name="password"
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="input w-full"
          />
          <input
            name="confirm"
            type="password"
            placeholder="Confirmar senha"
            value={form.confirm}
            onChange={handleChange}
            required
            className="input w-full"
          />
        </div>

        <button type="submit" className="btn mt-6 w-full">
          Cadastrar
        </button>

        <p className="mt-4 text-center text-sm text-stone-500">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-yellow-600 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
