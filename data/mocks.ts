import { User, Book, Shelf, ShelfEntry, Quote, Project, Post, Agent, QuickRecommendations, Review, RecommendedShelf } from '../types/entities.ts';
import { MentorIcon } from '../components/icons/MentorIcon.tsx';
import { BookIcon } from '../components/icons/BookIcon.tsx';
import { QuoteIcon } from '../components/icons/QuoteIcon.tsx';
import { LoreIcon } from '../components/icons/LoreIcon.tsx';

export const mockUser: User = {
    id: 'alex_doe',
    name: 'Alex',
    handle: '@alex_doe',
    email: 'test@booktown.com',
    avatarUrl: '/avatars/solofilms.png',
    bannerUrl: '/covers/profile-banner.jpg',
    bioEn: 'Avid reader and aspiring novelist. Exploring worlds one page at a time.',
    bioAr: 'قارئ نهم وروائي طموح. أستكشف العوالم صفحة بصفحة.',
    role: 'admin',
    followers: 125,
    following: 78,
    joinDate: '2025-09-01T00:00:00.000Z',
    lastActive: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
};

export const mockUsers: User[] = [
    mockUser,
    {
        id: 'user2',
        name: 'Sarah J.',
        handle: '@sarahreads',
        email: 'sarah@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=sarahreads',
        bannerUrl: '/covers/profile-banner.jpg',
        bioEn: 'Lover of sci-fi and fantasy. Always looking for the next great adventure.',
        bioAr: 'محبة للخيال العلمي والفانتازيا. أبحث دائمًا عن المغامرة الرائعة التالية.',
        role: 'user',
        followers: 582,
        following: 120,
        joinDate: '2025-08-15T00:00:00.000Z',
    },
    {
        id: 'user3',
        name: 'Omar K.',
        handle: '@omark',
        email: 'omar@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=omark',
        bannerUrl: '/covers/profile-banner.jpg',
        bioEn: 'Classic literature enthusiast and coffee aficionado.',
        bioAr: 'متحمس للأدب الكلاسيكي وعاشق للقهوة.',
        role: 'user',
        followers: 310,
        following: 250,
        joinDate: '2025-07-20T00:00:00.000Z',
    },
     {
        id: 'user4',
        name: 'Lena Petrova',
        handle: '@lenap',
        email: 'lena@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=lenap',
        bannerUrl: '/covers/profile-banner.jpg',
        bioEn: 'Mystery and thriller are my jam. I read way past my bedtime.',
        bioAr: 'الغموض والإثارة هما تخصصي. أقرأ إلى ما بعد وقت نومي.',
        role: 'user',
        followers: 890,
        following: 95,
        joinDate: '2025-06-10T00:00:00.000Z',
    },
];


const booksData: Omit<Book, 'id'>[] = [
  {
    titleEn: "Project Hail Mary",
    titleAr: "مشروع هايل ماري",
    authorEn: "Andy Weir",
    authorAr: "أندي وير",
    coverUrl: "/covers/hail-mary.jpg",
    descriptionEn: "A lone astronaut must save the earth from disaster in this cinematic thriller.",
    descriptionAr: "رائد فضاء وحيد يجب أن ينقذ الأرض من كارثة في هذا الفيلم المثير.",
    genresEn: ["Sci-Fi", "Thriller"],
    genresAr: ["خيال علمي", "إثارة"],
    rating: 4.5,
    ratingsCount: 285000,
    isEbookAvailable: true,
  },
  {
    titleEn: "Dune",
    titleAr: "كثيب",
    authorEn: "Frank Herbert",
    authorAr: "فرانك هربرت",
    coverUrl: "/covers/dune.jpg",
    descriptionEn: "The story of a young man's journey on a desert planet to avenge his family.",
    descriptionAr: "قصة رحلة شاب على كوكب صحراوي للانتقام من عائلته.",
    genresEn: ["Sci-Fi", "Fantasy", "Classic"],
    genresAr: ["خيال علمي", "فانتازيا", "كلاسيكي"],
    rating: 4.8,
    ratingsCount: 950000
  },
  {
    titleEn: "The Silent Patient",
    titleAr: "المريضة الصامتة",
    authorEn: "Alex Michaelides",
    authorAr: "أليكس ميخائيليدس",
    coverUrl: "/covers/silent-patient.jpg",
    descriptionEn: "A shocking psychological thriller of a woman's act of violence against her husband.",
    descriptionAr: "فيلم إثارة نفسي صادم عن عنف امرأة ضد زوجها.",
    genresEn: ["Thriller", "Mystery"],
    genresAr: ["إثارة", "غموض"],
    rating: 4.3,
    ratingsCount: 1200000,
    isEbookAvailable: true,
  },
  {
    titleEn: "Atomic Habits",
    titleAr: "العادات الذرية",
    authorEn: "James Clear",
    authorAr: "جيمس كلير",
    coverUrl: "/covers/atomic-habits.jpg",
    descriptionEn: "An easy and proven way to build good habits and break bad ones.",
    descriptionAr: "طريقة سهلة ومثبتة لبناء عادات جيدة وكسر العادات السيئة.",
    genresEn: ["Self-Help", "Productivity"],
    genresAr: ["مساعدة ذاتية", "إنتاجية"],
    rating: 4.9,
    ratingsCount: 750000,
    isEbookAvailable: true,
  },
  {
    titleEn: "Children of Time",
    titleAr: "أطفال الزمن",
    authorEn: "Adrian Tchaikovsky",
    authorAr: "أدريان تشايكوفسكي",
    coverUrl: "/covers/children-of-time.jpg",
    descriptionEn: "A space opera about the last remnants of humanity and a new, evolved intelligence.",
    descriptionAr: "أوبرا فضاء عن آخر بقايا البشرية وذكاء جديد ومتطور.",
    genresEn: ["Sci-Fi"],
    genresAr: ["خيال علمي"],
    rating: 4.6,
    ratingsCount: 150000
  },
];

export const mockBooks: Record<string, Book> = booksData.reduce((acc, book, i) => {
    const id = `book${i + 1}`;
    acc[id] = { ...book, id };
    return acc;
}, {} as Record<string, Book>);


export const mockTrendingBookIds = ['book1', 'book3'];
export const mockNewInSciFiIds = ['book1', 'book2', 'book5'];
export const mockQuickRecs: QuickRecommendations = {
    bookIds: ['book4', 'book2', 'book3'],
    timestamp: new Date().toISOString()
};
export const mockBookFlowIds = [
    'book2', 'book1', 'book3', 'book5', 'book4',
    'book2', 'book1', 'book3', 'book5', 'book4',
    'book2', 'book1', 'book3', 'book5', 'book4',
    'book2', 'book1', 'book3', 'book5', 'book4'
];

export const mockShelves: Record<string, Shelf> = {
    'currently-reading': { id: 'currently-reading', titleEn: 'Currently Reading', titleAr: 'أقرأ حاليًا' },
    'want-to-read': { id: 'want-to-read', titleEn: 'Want to Read', titleAr: 'أرغب في قراءتها' },
    'finished': { id: 'finished', titleEn: 'Finished', titleAr: 'انتهيت منها' },
};

export const mockShelfEntries: Record<string, Record<string, ShelfEntry>> = {
    'currently-reading': {
        'book1': { bookId: 'book1', addedAt: new Date().toISOString(), progress: 65 }
    },
    'want-to-read': {
        'book2': { bookId: 'book2', addedAt: new Date().toISOString() },
        'book3': { bookId: 'book3', addedAt: new Date().toISOString() }
    },
    'finished': {
        'book5': { bookId: 'book5', addedAt: new Date().toISOString() }
    }
};

export const mockQuoteOfTheDay: Quote = {
    id: 'qotd1',
    textEn: "The mystery of life isn't a problem to solve, but a reality to experience.",
    textAr: "سر الحياة ليس مشكلة يجب حلها، بل حقيقة يجب تجربتها.",
    sourceEn: "Dune, Frank Herbert",
    sourceAr: "كثيب، فرانك هربرت"
};

export const mockUserQuotes: Record<string, Omit<Quote, 'id'>> = {
    'q1': {
        textEn: "I must not fear. Fear is the mind-killer.",
        textAr: "يجب ألا أخاف. الخوف هو قاتل العقل.",
        sourceEn: "Dune",
        sourceAr: "كثيب"
    },
    'q2': {
        textEn: "It is a mistake to think you can solve any major problems just with potatoes.",
        textAr: "من الخطأ الاعتقاد بأنه يمكنك حل أي مشاكل كبيرة بالبطاطس فقط.",
        sourceEn: "Project Hail Mary",
        sourceAr: "مشروع هايل ماري"
    }
};

export const mockProjects: Record<string, Omit<Project, 'id'>> = {
    'proj1': {
        titleEn: "The Crimson Nebula",
        titleAr: "السديم القرمزي",
        content: "<h1>Chapter 1</h1><p>The void whispered secrets only the dead could hear. On the bridge of the Star-drifter, Captain Eva Rostova watched the swirling colors of the nebula paint streaks of light across the viewport. <b>Silence</b>. It was a heavy, oppressive thing in the deep of space, broken only by the low hum of the life support systems and the frantic beating of her own heart. <i>This was a mistake</i>, she thought, her fingers tightening around the worn leather of the command chair.</p>",
        typeEn: 'Novel',
        typeAr: 'رواية',
        status: 'Draft',
        wordCount: 45200,
        updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    'proj2': {
        titleEn: "Echoes in the Void",
        titleAr: "أصداء في الفراغ",
        content: "<p>It started with a flicker on the deep space sensors, a ghost in the machine that no one could explain. A single, repeating signal from a sector of space that was supposed to be empty. Lifeless. We were wrong.</p>",
        typeEn: 'Short Story',
        typeAr: 'قصة قصيرة',
        status: 'Revision',
        wordCount: 8100,
        updatedAt: new Date().toISOString(),
    }
};

export const mockPosts: Post[] = [
    {
        id: 'post1',
        authorId: 'user2',
        authorName: 'Sarah J.',
        authorHandle: '@sarahreads',
        authorAvatar: 'https://i.pravatar.cc/150?u=sarahreads',
        content: 'Just finished Project Hail Mary. Absolutely blown away! Rocky is the best character ever. 👽',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        bookTagId: 'book1',
        stats: { likes: 125, comments: 12, reposts: 5 }
    },
    {
        id: 'post2',
        authorId: 'user3',
        authorName: 'Omar K.',
        authorHandle: '@omark',
        authorAvatar: 'https://i.pravatar.cc/150?u=omark',
        content: 'Rereading Dune in preparation for the new movie. The world-building is just unparalleled.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        bookTagId: 'book2',
        stats: { likes: 302, comments: 45, reposts: 22 }
    },
    {
        id: 'post3',
        authorId: 'alex_doe',
        authorName: 'Alex',
        authorHandle: '@alex_doe',
        authorAvatar: '/avatars/solofilms.png',
        content: 'Anyone else a huge fan of Atomic Habits? Changed the way I approach my writing goals.',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        bookTagId: 'book4',
        stats: { likes: 98, comments: 20, reposts: 8 }
    },
    {
        id: 'post4',
        authorId: 'user4',
        authorName: 'Lena Petrova',
        authorHandle: '@lenap',
        authorAvatar: 'https://i.pravatar.cc/150?u=lenap',
        content: 'The ending of "The Silent Patient" left me speechless for a good ten minutes. A must-read for mystery lovers!',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        bookTagId: 'book3',
        stats: { likes: 215, comments: 33, reposts: 15 }
    },
    {
        id: 'post5',
        authorId: 'user5',
        authorName: 'Kenji Tanaka',
        authorHandle: '@kenjit',
        authorAvatar: 'https://i.pravatar.cc/150?u=kenjit',
        content: 'Children of Time is one of the most original sci-fi concepts I have ever read. The evolution of the spiders is fascinating.',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        bookTagId: 'book5',
        stats: { likes: 180, comments: 28, reposts: 11 }
    },
     {
        id: 'post6',
        authorId: 'user2',
        authorName: 'Sarah J.',
        authorHandle: '@sarahreads',
        authorAvatar: 'https://i.pravatar.cc/150?u=sarahreads',
        content: 'Looking for my next big sci-fi read after Project Hail Mary. Any suggestions?',
        timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
        stats: { likes: 75, comments: 40, reposts: 2 }
    },
    {
        id: 'post7',
        authorId: 'user3',
        authorName: 'Omar K.',
        authorHandle: '@omark',
        authorAvatar: 'https://i.pravatar.cc/150?u=omark',
        content: 'The Litany Against Fear is something I think about almost daily. "Fear is the mind-killer."',
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
        bookTagId: 'book2',
        stats: { likes: 450, comments: 60, reposts: 50 }
    },
    {
        id: 'post8',
        authorId: 'alex_doe',
        authorName: 'Alex',
        authorHandle: '@alex_doe',
        authorAvatar: '/avatars/solofilms.png',
        content: 'Small changes, big results. That\'s the core message I took from Atomic Habits.',
        timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
        bookTagId: 'book4',
        stats: { likes: 112, comments: 15, reposts: 10 }
    },
    {
        id: 'post9',
        authorId: 'user4',
        authorName: 'Lena Petrova',
        authorHandle: '@lenap',
        authorAvatar: 'https://i.pravatar.cc/150?u=lenap',
        content: 'That twist... I did not see it coming AT ALL. #SilentPatient',
        timestamp: new Date(Date.now() - 86400000 * 9).toISOString(),
        bookTagId: 'book3',
        stats: { likes: 199, comments: 25, reposts: 18 }
    },
    {
        id: 'post10',
        authorId: 'user5',
        authorName: 'Kenji Tanaka',
        authorHandle: '@kenjit',
        authorAvatar: 'https://i.pravatar.cc/150?u=kenjit',
        content: 'If you enjoy grand-scale sci-fi like Dune, you owe it to yourself to read Children of Time.',
        timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
        bookTagId: 'book5',
        stats: { likes: 250, comments: 35, reposts: 20 }
    },
    {
        id: 'post11',
        authorId: 'user2',
        authorName: 'Sarah J.',
        authorHandle: '@sarahreads',
        authorAvatar: 'https://i.pravatar.cc/150?u=sarahreads',
        content: 'Okay, I started Children of Time based on recommendations... and wow. Just wow.',
        timestamp: new Date(Date.now() - 86400000 * 11).toISOString(),
        bookTagId: 'book5',
        stats: { likes: 95, comments: 18, reposts: 3 }
    },
    {
        id: 'post12',
        authorId: 'user3',
        authorName: 'Omar K.',
        authorHandle: '@omark',
        authorAvatar: 'https://i.pravatar.cc/150?u=omark',
        content: 'Is it too soon to start another Dune reread?',
        timestamp: new Date(Date.now() - 86400000 * 12).toISOString(),
        stats: { likes: 150, comments: 30, reposts: 7 }
    }
];

export const mockAgents: Agent[] = [
    {
        id: 'librarian',
        name: 'Librarian',
        descriptionEn: 'Find your next great read',
        descriptionAr: 'ابحث عن قراءتك الرائعة التالية',
        avatarUrl: '/avatars/librarian.png',
        isPremium: false,
        icon: BookIcon,
        color: 'text-blue-400',
        examplePromptsEn: [
            "Can you suggest a fantasy novel with strong worldbuilding?",
            "What are some underrated books from the last decade?",
            "What should I read if I loved 'Project Hail Mary'?"
        ],
        examplePromptsAr: [
            "هل يمكنك اقتراح رواية خيالية ذات بناء عالمي قوي؟",
            "ما هي بعض الكتب غير المشهورة من العقد الماضي؟",
            "ماذا يجب أن أقرأ إذا أحببت 'مشروع هايل ماري'؟"
        ],
        placeholderEn: 'Find your next great read...',
        placeholderAr: 'ابحث عن قراءتك الرائعة التالية...',
    },
    {
        id: 'mentor',
        name: 'Mentor',
        descriptionEn: 'Get writing tips and feedback',
        descriptionAr: 'احصل على نصائح للكتابة وملاحظات',
        avatarUrl: '/avatars/mentor.png',
        isPremium: false,
        icon: MentorIcon,
        color: 'text-purple-400',
        examplePromptsEn: [
            "How do I make my dialogue feel more natural?",
            "What are some common writing mistakes to avoid?",
            "Can you give me feedback on this paragraph?"
        ],
        examplePromptsAr: [
            "كيف أجعل حواري يبدو طبيعيًا أكثر؟",
            "ما هي بعض الأخطاء الكتابية الشائعة التي يجب تجنبها؟",
            "هل يمكنك أن تعطيني رأيك في هذه الفقرة؟"
        ],
        placeholderEn: 'Get writing tips and feedback...',
        placeholderAr: 'احصل على نصائح وملاحظات للكتابة...',
    },
    {
        id: 'quotes',
        name: 'Quotes',
        descriptionEn: 'Discover inspiring quotes',
        descriptionAr: 'اكتشف اقتباسات ملهمة',
        avatarUrl: '/avatars/quotes.png',
        isPremium: false, // Set to false for testing
        icon: QuoteIcon,
        color: 'text-green-400',
        examplePromptsEn: [
            "Give me a quote about resilience.",
            "Find quotes from 'Dune'.",
            "What are some famous literary quotes about love?"
        ],
        examplePromptsAr: [
            "أعطني اقتباسًا عن المرونة.",
            "ابحث عن اقتباسات من 'كثيب'.",
            "ما هي بعض الاقتباسات الأدبية الشهيرة عن الحب؟"
        ],
        placeholderEn: 'Ask me about a quote or theme...',
        placeholderAr: 'اسألني عن اقتباس أو موضوع...',
    },
    {
        id: 'lore',
        name: 'Lore',
        descriptionEn: 'Talk with books and authors',
        descriptionAr: 'تحدث مع الكتب والمؤلفين',
        avatarUrl: '/avatars/lore.png',
        isPremium: false, // Set to false for testing
        icon: LoreIcon,
        color: 'text-red-400',
        examplePromptsEn: [
            "What would Elizabeth Bennet say about modern marriage?",
            "Ask Sherlock Holmes to solve a modern mystery.",
            "Have a conversation with Frank Herbert about Dune."
        ],
        examplePromptsAr: [
            "ماذا ستقول إليزابيث بينيت عن الزواج الحديث؟",
            "اطلب من شرلوك هولمز حل لغز حديث.",
            "أجرِ محادثة مع فرانك هربرت حول 'كثيب'."
        ],
        placeholderEn: 'Talk with characters and concepts...',
        placeholderAr: 'تحدث مع الشخصيات والمفاهيم...',
    }
];


export const mockReviews: Record<string, Omit<Review, 'id'>> = {
    'review1': {
        bookId: 'book1',
        userId: 'user2',
        authorName: 'Sarah J.',
        authorHandle: '@sarahreads',
        authorAvatar: 'https://i.pravatar.cc/150?u=sarahreads',
        rating: 5,
        text: "An absolute masterpiece of science fiction. The friendship between Ryland and Rocky is one of the most heartwarming things I've ever read. A must-read!",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    'review2': {
        bookId: 'book1',
        userId: 'user5',
        authorName: 'Kenji Tanaka',
        authorHandle: '@kenjit',
        authorAvatar: 'https://i.pravatar.cc/150?u=kenjit',
        rating: 4,
        text: "Really enjoyed the problem-solving aspect of this book. The science is detailed but accessible. The ending felt a little rushed, but overall a great read.",
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    }
};

export const mockRecommendedShelves: RecommendedShelf[] = [
    {
        id: 'rec_shelf_1',
        titleEn: "Dystopian Classics",
        titleAr: "كلاسيكيات ديستوبية",
        ownerName: "Editor's Picks",
        bookCovers: ["/covers/dune.jpg", "/covers/children-of-time.jpg", "/covers/hail-mary.jpg"],
        followerCount: 12845,
    },
    {
        id: 'rec_shelf_2',
        titleEn: "Modern Thrillers",
        titleAr: "إثارة حديثة",
        ownerName: "CommunityCurated",
        bookCovers: ["/covers/silent-patient.jpg", "/covers/hail-mary.jpg", "/covers/dune.jpg"],
        followerCount: 8302,
    },
    {
        id: 'rec_shelf_3',
        titleEn: "Productivity Boost",
        titleAr: "دفعة إنتاجية",
        ownerName: "Mentor's Shelf",
        bookCovers: ["/covers/atomic-habits.jpg", "/covers/silent-patient.jpg", "/covers/children-of-time.jpg"],
        followerCount: 21050,
    }
];

// This structure allows the mock DB to function.
export const MOCK_DATA = {
    users: mockUsers.reduce((acc, user) => {
        const userData: any = { ...user };
        if (user.id === 'alex_doe') {
            userData.shelves = mockShelves;
            userData.quotes = mockUserQuotes;
            userData.projects = mockProjects;
            userData.agent_sessions = {};
        }
        acc[user.id] = userData;
        return acc;
    }, {} as Record<string, any>),
    catalog: {
        books: mockBooks
    },
    recommendations_quick: {
        'alex_doe': mockQuickRecs
    },
    posts: mockPosts.reduce((acc, post) => {
        acc[post.id] = post;
        return acc;
    }, {} as Record<string, Post>),
    reviews: mockReviews,
};

// Add shelf entries into the main mock data object for the db to find
MOCK_DATA.users.alex_doe.shelves['currently-reading'].entries = mockShelfEntries['currently-reading'];
MOCK_DATA.users.alex_doe.shelves['want-to-read'].entries = mockShelfEntries['want-to-read'];
MOCK_DATA.users.alex_doe.shelves['finished'].entries = mockShelfEntries['finished'];