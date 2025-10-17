
import React from 'react';
import { useI18n } from '../../store/i18n';
import { SearchIcon } from '../icons/SearchIcon';
import { MicIcon } from '../icons/MicIcon';
import { CameraIcon } from '../icons/CameraIcon';
import BilingualText from '../ui/BilingualText';

interface HomeSearchBarProps {
    onSearchClick: () => void;
}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({ onSearchClick }) => {
    const { lang } = useI18n();

    return (
        <button
            onClick={onSearchClick}
            className="w-full h-14 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center px-4 text-left transition-colors duration-200 hover:bg-slate-300 dark:hover:bg-slate-700 gap-3"
            aria-label={lang === 'en' ? 'Search for a book' : 'ابحث عن كتاب'}
        >
            <SearchIcon className="h-6 w-6 text-slate-500 dark:text-white/60 flex-shrink-0" />
            <BilingualText className="flex-grow text-slate-500 dark:text-white/60 truncate">
                {lang === 'en' ? 'Seek a Book...' : 'ابحث عن كتاب...'}
            </BilingualText>
            <div className="flex-shrink-0 flex items-center gap-2">
                <MicIcon className="h-6 w-6 text-slate-500 dark:text-white/60" />
                <div className="w-px h-6 bg-slate-400 dark:bg-slate-600"></div>
                <CameraIcon className="h-6 w-6 text-slate-500 dark:text-white/60" />
            </div>
        </button>
    );
};

export default HomeSearchBar;
