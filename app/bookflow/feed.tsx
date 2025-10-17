import React from 'react';
import BookFlowPage from '../../components/content/BookFlowPage.tsx';
import { mockBookFlowIds } from '../../data/mocks.ts';

const BookFlowFeedScreen: React.FC = () => {
    return (
        <div className="h-screen w-screen bg-black overflow-y-auto scroll-snap-type-y-mandatory">
            {mockBookFlowIds.map((bookId, index) => (
                <BookFlowPage key={`${bookId}-${index}`} bookId={bookId} />
            ))}
        </div>
    );
};

// Add scroll snap style helper
const style = document.createElement('style');
style.innerHTML = `
.scroll-snap-type-y-mandatory {
    scroll-snap-type: y mandatory;
}
`;
document.head.appendChild(style);

export default BookFlowFeedScreen;