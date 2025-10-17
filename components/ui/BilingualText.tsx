import React from 'react';
import { useI18n } from '../../store/i18n';

type TextRole = 'H1' | 'Body' | 'Caption' | 'Quote';

interface BilingualTextProps {
  role?: TextRole;
  children: React.ReactNode;
  className?: string;
}

const BilingualText: React.FC<BilingualTextProps> = ({ 
  role = 'Body', 
  children, 
  className = '' 
}) => {
  const { isRTL, lang } = useI18n();

  const roleStyles: Record<TextRole, string> = {
    H1: 'text-3xl font-bold tracking-tight',
    Body: 'text-base font-normal leading-relaxed',
    Caption: 'text-sm text-slate-500 dark:text-white/60',
    Quote: 'text-lg italic border-accent text-accent pl-4',
  };

  const fontStyles = lang === 'ar' ? 'font-cairo' : 'font-inter';
  const alignmentStyles = isRTL ? 'text-right' : 'text-left';
  const borderStyle = role === 'Quote' ? (isRTL ? 'border-r-4' : 'border-l-4') : '';
  const paddingStyle = role === 'Quote' ? (isRTL ? 'pr-4' : 'pl-4') : '';


  // The 'pl-4' for quote needs to be unset for RTL.
  const baseQuoteStyle = roleStyles['Quote'].replace('pl-4','');


  const finalClassName = [
    role === 'Quote' ? baseQuoteStyle : roleStyles[role],
    fontStyles,
    alignmentStyles,
    borderStyle,
    paddingStyle,
    className
  ].filter(Boolean).join(' ');

  const Tag = role === 'H1' ? 'h1' : 'p';

  return (
    <Tag className={finalClassName}>
      {children}
    </Tag>
  );
};

export default BilingualText;