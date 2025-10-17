import React from 'react';
import { useI18n } from '../../store/i18n';
import Button from './Button';

interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Fab: React.FC<FabProps> = ({ children, className, ...props }) => {
    const { isRTL } = useI18n();

    return (
        <Button
            variant="primary"
            className={`
                fixed bottom-28 z-10 
                h-14 w-14 rounded-full !p-0
                shadow-lg shadow-black/40
                ${isRTL ? 'left-4 md:left-8' : 'right-4 md:right-8'}
                ${className}
            `}
            {...props}
        >
            {children}
        </Button>
    );
};

export default Fab;