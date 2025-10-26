import React, { useState } from 'react';
import { useAuth } from '../../lib/auth.tsx';
import { useI18n } from '../../store/i18n.tsx';
import InputField from '../../components/ui/InputField.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import { EmailIcon } from '../../components/icons/EmailIcon.tsx';
import { LockIcon } from '../../components/icons/LockIcon.tsx';
import { EyeIcon } from '../../components/icons/EyeIcon.tsx';
import { EyeOffIcon } from '../../components/icons/EyeOffIcon.tsx';
import { GoogleIcon } from '../../components/icons/GoogleIcon.tsx';
import { XSocialIcon } from '../../components/icons/XSocialIcon.tsx';
import { AppleIcon } from '../../components/icons/AppleIcon.tsx';
import { BookTownLogoIcon } from '../../components/icons/BookTownLogoIcon.tsx';

const LoginScreen: React.FC = () => {
    const { login, isLoggingIn, error } = useAuth();
    const { lang } = useI18n();
    const [email, setEmail] = useState('test@booktown.com');
    const [password, setPassword] = useState('password');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
    };

    const SocialButton: React.FC<{ icon: React.ReactNode, label: string, disabled?: boolean }> = ({ icon, label, disabled }) => (
        <button
            aria-label={label}
            disabled={disabled}
            className="h-12 w-12 flex items-center justify-center border-2 border-slate-600 rounded-lg transition-all hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600 active:scale-95"
        >
            {icon}
        </button>
    );

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white py-4 px-12 font-inter">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <BookTownLogoIcon className="w-full max-w-xs mx-auto h-auto" />
                </div>
                
                <h2 className="text-2xl font-bold text-left mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Sign In</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <InputField
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            startIcon={<EmailIcon className="h-5 w-5 text-slate-400" />}
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <InputField
                            id="password"
                            label="Password"
                            type={passwordVisible ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            startIcon={<LockIcon className="h-5 w-5 text-slate-400" />}
                            endIcon={
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="text-slate-400 hover:text-white"
                                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                                >
                                    {passwordVisible ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            }
                        />
                    </div>
                    
                    <a href="#" className="text-sm text-accent hover:underline text-right block pt-1 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        Forgot your password?
                    </a>
                    
                    {error && (
                        <BilingualText role="Caption" className="!text-red-400 text-center animate-fade-in-up">{error}</BilingualText>
                    )}
                    
                    <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                        <Button type="submit" className="w-full !h-12 !text-base" disabled={isLoggingIn}>
                            {isLoggingIn ? <LoadingSpinner /> : (lang === 'en' ? 'Sign In' : 'تسجيل الدخول')}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    Need an account?{' '}
                    <a href="#" className="font-semibold text-accent hover:underline">
                        Create one
                    </a>
                </p>

                <div className="flex items-center my-8 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                    <hr className="flex-grow border-slate-600" />
                    <span className="mx-4 text-xs tracking-widest text-slate-400">OR CONTINUE WITH</span>
                    <hr className="flex-grow border-slate-600" />
                </div>

                <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                    <SocialButton icon={<GoogleIcon className="h-6 w-6" />} label="Continue with Google" />
                    <SocialButton icon={<XSocialIcon className="h-6 w-6" />} label="Continue with X" disabled />
                    <SocialButton icon={<AppleIcon className="h-6 w-6" />} label="Continue with Apple" disabled />
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '900ms' }}>
                    <Button variant="ghost" className="w-full !h-12 mt-8 border-2 border-slate-600 !text-white hover:bg-slate-800">
                        Continue as Guest
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;