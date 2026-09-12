import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
      setFormError('ALL PARAMETERS REQUIRED FOR COMMISSIONING');
      return;
    }

    if (username.length < 3) {
      setFormError('CODENAME MUST CONTAIN AT LEAST 3 CHARACTERS');
      return;
    }

    if (password.length < 6) {
      setFormError('PASSCODE REQUIRES A MINIMUM OF 6 CHARACTERS');
      return;
    }

    setIsSubmitting(true);
    const result = await register(username, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.message.toUpperCase());
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#FAF3E8] border-3 border-[#141414] shadow-brutal p-6 sm:p-8 relative">
        {/* Top Identification Header */}
        <div className="bg-[#141414] text-[#F5F3EF] px-3 py-1.5 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 flex items-center justify-between border-b-3 border-[#141414]">
          <span className="text-[10px] font-mono font-black tracking-widest uppercase">
            // NEW AGENT RECRUITMENT PROTOCOL
          </span>
          <span className="text-[10px] font-mono font-bold text-[#2B4AE8]">
            ENLISTMENT
          </span>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-[#2B4AE8] text-white text-[10px] font-mono font-black px-2 py-0.5 mb-2 uppercase">
            INITIALIZE RECORD
          </div>
          <h1 className="text-3xl font-black text-[#141414] font-space uppercase tracking-tight">
            COMMISSION AGENT
          </h1>
          <p className="text-xs font-mono font-bold text-[#141414]/70 mt-1 uppercase">
            INITIALIZE AT LEVEL 01. ALLOCATES 60 INITIAL GOLD REQUISITION CREDITS.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-3 bg-[#E8402C] border-2 border-[#141414] text-white font-mono text-xs font-bold uppercase shadow-brutal">
            // ERROR: {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="OPERATIONAL CODENAME (USERNAME)"
            type="text"
            placeholder="CODENAME_01"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <Input
            label="COMMUNICATION CHANNEL (EMAIL)"
            type="email"
            placeholder="agent@manzil.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="SECURITY PASSCODE (MIN 6 CHARS)"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center font-mono font-black uppercase text-sm mt-4 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'COMMISSIONING AGENT...' : 'INITIALIZE PROFILE & LAUNCH →'}
          </Button>
        </form>

        <div className="mt-8 pt-4 border-t-2 border-[#141414]/20 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-[#141414]/70 uppercase">EXISTING CLEARANCE?</span>
          <Link
            to="/login"
            className="font-black text-[#141414] hover:text-[#2B4AE8] uppercase underline decoration-2 underline-offset-4"
          >
            COMMAND ACCESS →
          </Link>
        </div>
      </div>
    </div>
  );
};
