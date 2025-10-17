import React from 'react';
import { XIcon } from '../icons/XIcon';
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                aria-hidden="true"
                onClick={onClose}
            ></div>

            {/* Modal Panel */}
            <div className="relative z-10 w-full max-w-lg transform rounded-card bg-gray-100/95 dark:bg-slate-800/80 p-6 shadow-2xl shadow-black/50 transition-all">
                <div className="absolute top-3 right-3">
                    <Button variant="icon" onClick={onClose} aria-label="Close">
                        <XIcon className="h-6 w-6" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;