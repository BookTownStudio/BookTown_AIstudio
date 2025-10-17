
import React, { useState } from 'react';
// FIX: Added file extensions to imports
import { useAuth } from '../../lib/auth.tsx';
import { useI18n } from '../../store/i18n.tsx';
import InputField from '../../components/ui/InputField.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';

const LoginScreen: React.FC = () => {
    const { login, isLoggingIn, error } = useAuth();
    const { lang } = useI18n();
    const [email, setEmail] = useState('test@booktown.com');
    const [password, setPassword] = useState('password');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <BilingualText role="H1" className="text-4xl text-accent">BookTown</BilingualText>
                    <BilingualText role="Body" className="text-slate-600 dark:text-white/60 mt-2">
                        {lang === 'en' ? 'Your AI-powered literary companion' : 'رفيقك الأدبي المدعوم بالذكاء الاصطناعي'}
                    </BilingualText>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <InputField
                        id="email"
                        label={lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputField
                        id="password"
                        label={lang === 'en' ? 'Password' : 'كلمة المرور'}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    
                    {error && (
                        <BilingualText role="Caption" className="!text-red-400 text-center">{error}</BilingualText>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                        {isLoggingIn ? <LoadingSpinner /> : (lang === 'en' ? 'Sign In' : 'تسجيل الدخول')}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;