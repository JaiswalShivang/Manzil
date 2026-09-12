import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!username || !email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setFormError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const result = await register(username, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(58,46,39,0.1)] relative">
        {/* Top sticker tape decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#9CAF88]/45 rounded-sm" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF3E8] border border-[#E4D3BE] mx-auto flex items-center justify-center text-2xl mb-3 shadow-sm">
            🪴
          </div>
          <h1 className="text-2xl font-bold text-[#3A2E27] tracking-tight">
            Claim Your Study Nook
          </h1>
          <p className="text-xs text-[#78665B] mt-1 font-sans">
            Start with Level 1, 60 Cozy Coins, and a warm desk waiting for you
          </p>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-100/90 border border-red-200 text-red-800 rounded-xl text-xs">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Adventurer Username"
            type="text"
            placeholder="e.g. CozyScholar"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="scholar@lofi.study"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center text-sm font-bold shadow-md mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Unlocking Your Room...' : 'Start My Study Journey ✍️'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E4D3BE] text-center text-xs text-[#78665B]">
          <span>Already have a room? </span>
          <Link
            to="/login"
            className="font-bold text-[#3A2E27] hover:text-[#E3A08A] underline decoration-1 underline-offset-2 transition-colors"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
