import React from 'react';
import { useI18n } from '../../store/i18n';
import BilingualText from './BilingualText';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, className, ...props }) => {
    const { isRTL } = useI18n();

    return (
        <div>
            <label htmlFor={id}>
                <BilingualText role="Caption" className="!text-slate-700 dark:!text-white/80 mb-1 block">{label}</BilingualText>
            </label>
            <input
                id={id}
                dir={isRTL ? 'rtl' : 'ltr'}
                className={`
                    w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-md
                    px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40
                    focus:outline-none focus:ring-2 focus:ring-accent
                    transition-all duration-200
                    disabled:opacity-50
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};

export default InputField;