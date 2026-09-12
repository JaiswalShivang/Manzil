import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirmationMsg, setConfirmationMsg] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setConfirmationMsg(null);

    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'AGENT IDENTIFIER (EMAIL) IS REQUIRED';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'PLEASE PROVIDE A VALID EMAIL ADDRESS';
    }

    if (!password) {
      errors.password = 'ACCESS PASSCODE IS REQUIRED';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError('PLEASE RESOLVE HIGHLIGHTED CREDENTIAL ERRORS');
      return;
    }

    setIsSubmitting(true);
    const result = await login(trimmedEmail, password);
    setIsSubmitting(false);

    if (result.success) {
      setConfirmationMsg(
        result.message ? result.message.toUpperCase() : 'ACCESS GRANTED — WELCOME BACK, OPERATIVE!'
      );
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } else {
      const upperMsg = result.message ? result.message.toUpperCase() : 'AUTHENTICATION FAILED';
      setFormError(upperMsg);
      if (result.field === 'email') {
        setFieldErrors({ email: upperMsg });
      } else if (result.field === 'password') {
        setFieldErrors({ password: upperMsg });
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#FAF3E8] border-3 border-[#141414] shadow-brutal p-6 sm:p-8 relative">
        {/* Top Identification Header */}
        <div className="bg-[#141414] text-[#F5F3EF] px-3 py-1.5 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 flex items-center justify-between border-b-3 border-[#141414]">
          <span className="text-[10px] font-mono font-black tracking-widest uppercase">
            // SECURE CLEARANCE VERIFICATION
          </span>
          <span className="text-[10px] font-mono font-bold text-[#F2B705]">
            SYS_ONLINE
          </span>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-[#E8402C] text-white text-[10px] font-mono font-black px-2 py-0.5 mb-2 uppercase">
            AUTHENTICATION PROTOCOL
          </div>
          <h1 className="text-3xl font-black text-[#141414] font-space uppercase tracking-tight">
            COMMAND ACCESS
          </h1>
          <p className="text-xs font-mono font-bold text-[#141414]/70 mt-1 uppercase">
            ENTER CREDENTIALS TO ACCESS OPERATIONAL HUD AND ACTIVE QUESTS.
          </p>
        </div>

        {/* Success Confirmation Banner */}
        {confirmationMsg && (
          <div className="mb-6 p-3.5 bg-[#141414] border-2 border-[#141414] text-[#F2B705] font-mono text-xs font-bold uppercase shadow-brutal flex items-center gap-2">
            <span className="w-2 h-2 bg-[#F2B705] inline-block animate-ping" />
            <span>// SUCCESS: {confirmationMsg}</span>
          </div>
        )}

        {/* Error Notification Banner */}
        {formError && (
          <div className="mb-6 p-3.5 bg-[#E8402C] border-2 border-[#141414] text-white font-mono text-xs font-bold uppercase shadow-brutal">
            // REJECTION NOTICE: {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="AGENT IDENTIFIER (EMAIL)"
            type="email"
            placeholder="agent@manzil.io"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }));
              if (formError) setFormError(null);
            }}
            error={fieldErrors.email}
            required
            autoComplete="email"
          />

          <Input
            label="ACCESS PASSCODE"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }));
              if (formError) setFormError(null);
            }}
            error={fieldErrors.password}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="danger"
            size="lg"
            className="w-full justify-center font-mono font-black uppercase text-sm mt-4 cursor-pointer"
            disabled={isSubmitting || Boolean(confirmationMsg)}
          >
            {confirmationMsg
              ? 'REDIRECTING TO HQ...'
              : isSubmitting
              ? 'VERIFYING CREDENTIALS...'
              : 'AUTHENTICATE & ENTER HQ →'}
          </Button>
        </form>

        <div className="mt-8 pt-4 border-t-2 border-[#141414]/20 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-[#141414]/70 uppercase">UNREGISTERED AGENT?</span>
          <Link
            to="/register"
            className="font-black text-[#141414] hover:text-[#E8402C] uppercase underline decoration-2 underline-offset-4"
          >
            INITIALIZE AGENT →
          </Link>
        </div>
      </div>
    </div>
  );
};
