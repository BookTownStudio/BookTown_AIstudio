import React from 'react';
import { useI18n } from '../../store/i18n';

interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Fab: React.FC<FabProps> = ({ children, className, ...props }) => {
    const { isRTL } = useI18n();

    // Combining base button styles with FAB specific styles to avoid conflicts from the generic Button component.
    const baseStyles = 'inline-flex items-center justify-center font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 focus:ring-primary';

    return (
        <button
            className={`
                ${baseStyles}
                fixed bottom-28 z-10 
                h-14 w-14 rounded-full p-0
                shadow-lg shadow-black/40
                bg-primary/80 backdrop-blur-sm
                hover:bg-primary
                ${isRTL ? 'left-4 md:left-8' : 'right-4 md:right-8'}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Fab;
