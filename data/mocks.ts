import { User, Book, Shelf, Quote, Project, Post, Agent, Review, RecommendedShelf, Template, BookFlowItem } from '../types/entities.ts';
import { MentorIcon } from '../components/icons/MentorIcon.tsx';
import { ChatIcon } from '../components/icons/ChatIcon.tsx';
import { QuoteIcon } from '../components/icons/QuoteIcon.tsx';
import { LoreIcon } from '../components/icons/LoreIcon.tsx';
import { NovelIcon } from '../components/icons/NovelIcon.tsx';
import { ShortStoryIcon } from '../components/icons/ShortStoryIcon.tsx';
import { EssayIcon } from '../components/icons/EssayIcon.tsx';
import { JournalIcon } from '../components/icons/JournalIcon.tsx';
import { MemoirIcon } from '../components/icons/MemoirIcon.tsx';
import { PoetryIcon } from '../components/icons/PoetryIcon.tsx';
import { BookReviewIcon } from '../components/icons/BookReviewIcon.tsx';
import { ScreenplayIcon } from '../components/icons/ScreenplayIcon.tsx';
import { ResearchPaperIcon } from '../components/icons/ResearchPaperIcon.tsx';
import { BlogPostIcon } from '../components/icons/BlogPostIcon.tsx';
import { PlayIcon } from '../components/icons/PlayIcon.tsx';
import { CharacterProfileIcon } from '../components/icons/CharacterProfileIcon.tsx';

// --- USERS ---
export const mockUsers: User[] = [
    {
        uid: 'alex_doe',
        email: 'test@booktown.com',
        name: 'Alex Doe',
        handle: '@alexdoe',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        bannerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        joinDate: '2023-01-15T10:00:00Z',
        bioEn: 'Just a reader trying to find the next great story. Sci-fi and fantasy enthusiast. Trying my hand at writing.',
        bioAr: 'مجرد قارئ يحاول العثور على القصة الرائعة التالية. من عشاق الخيال العلمي والفانتازيا. أجرب الكتابة.',
        followers: 125,
        following: 88,
        role: 'superuser',
        lastActive: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
    },
    {
        uid: 'jane_smith',
        name: 'Jane Smith',
        email: 'jane@example.com',
        handle: '@janesmith',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        bannerUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80',
        joinDate: '2022-11-20T14:30:00Z',
        bioEn: 'Literary critic and coffee lover.',
        bioAr: 'ناقدة أدبية ومحبة للقهوة.',
        followers: 1200,
        following: 300,
        role: 'user',
        lastActive: new Date().toISOString(),
    },
];

// --- BOOKS ---
export const mockBooks: Record<string, Book> = {
    'book1': {
        id: 'book1',
        titleEn: 'The Midnight Library',
        titleAr: 'مكتبة منتصف الليل',
        authorEn: 'Matt Haig',
        authorAr: 'مات هيغ',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253l/52578297.jpg',
        descriptionEn: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
        descriptionAr: 'بين الحياة والموت توجد مكتبة، وفي تلك المكتبة، تمتد الأرفف إلى ما لا نهاية. كل كتاب يوفر فرصة لتجربة حياة أخرى كان بإمكانك أن تعيشها.',
        genresEn: ['Fantasy', 'Contemporary'],
        genresAr: ['خيال', 'معاصر'],
        rating: 4.8,
        ratingsCount: 12053,
        isEbookAvailable: true,
    },
    'book2': {
        id: 'book2',
        titleEn: 'Project Hail Mary',
        titleAr: 'مشروع هيل ماري',
        authorEn: 'Andy Weir',
        authorAr: 'آندي وير',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597818439l/54493401.jpg',
        descriptionEn: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
        descriptionAr: 'ريلاند جريس هو الناجي الوحيد في مهمة يائسة وأخيرة - وإذا فشل، فإن البشرية والأرض نفسها ستفنى.',
        genresEn: ['Sci-Fi', 'Thriller'],
        genresAr: ['خيال علمي', 'إثارة'],
        rating: 4.9,
        ratingsCount: 25890,
        isEbookAvailable: true,
    },
    'book3': {
        id: 'book3',
        titleEn: 'Dune',
        titleAr: 'كثيب',
        authorEn: 'Frank Herbert',
        authorAr: 'فرانك هربرت',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414l/44767458.jpg',
        descriptionEn: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange.',
        descriptionAr: 'تدور أحداث القصة على كوكب أراكيس الصحراوي، وهي قصة الصبي بول أتريديز، وريث عائلة نبيلة مكلفة بحكم عالم غير مضياف حيث الشيء الوحيد ذو القيمة هو "بهار" الميلانج.',
        genresEn: ['Sci-Fi', 'Classic'],
        genresAr: ['خيال علمي', 'كلاسيكي'],
        rating: 4.6,
        ratingsCount: 98765,
        isEbookAvailable: false,
    },
    'book4': {
        id: 'book4',
        titleEn: 'The Silent Patient',
        titleAr: 'المريض الصامت',
        authorEn: 'Alex Michaelides',
        authorAr: 'أليكس ميكايليديس',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582132389l/40097951.jpg',
        descriptionEn: 'Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London’s most desirable areas.',
        descriptionAr: 'حياة أليسيا بيرينسون تبدو مثالية. رسامة مشهورة متزوجة من مصور أزياء مطلوب، تعيش في منزل كبير بنوافذ كبيرة تطل على حديقة في واحدة من أكثر مناطق لندن المرغوبة.',
        genresEn: ['Thriller', 'Mystery'],
        genresAr: ['إثارة', 'غموض'],
        rating: 4.1,
        ratingsCount: 890123,
        isEbookAvailable: true,
    },
    'book5': {
        id: 'book5',
        titleEn: 'Circe',
        titleAr: 'سيرسي',
        authorEn: 'Madeline Miller',
        authorAr: 'مادلين ميلر',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1565909496l/35959740.jpg',
        descriptionEn: 'In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child--not powerful, like her father, nor viciously alluring like her mother.',
        descriptionAr: 'في منزل هيليوس، إله الشمس وأقوى الجبابرة، ولدت ابنة. لكن سيرسي طفلة غريبة - ليست قوية مثل والدها، ولا جذابة بوحشية مثل والدتها.',
        genresEn: ['Fantasy', 'Mythology'],
        genresAr: ['خيال', 'أساطير'],
        rating: 4.3,
        ratingsCount: 750321,
        isEbookAvailable: true,
    },
    'book6': {
        id: 'book6',
        titleEn: 'Atomic Habits',
        titleAr: 'العادات الذرية',
        authorEn: 'James Clear',
        authorAr: 'جيمس كلير',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320l/40121378.jpg',
        descriptionEn: 'Tiny Changes, Remarkable Results. An easy & proven way to build good habits & break bad ones.',
        descriptionAr: 'تغييرات صغيرة، نتائج ملحوظة. طريقة سهلة ومثبتة لبناء عادات جيدة وكسر عادات سيئة.',
        genresEn: ['Self Help', 'Non-fiction'],
        genresAr: ['مساعدة ذاتية', 'واقعي'],
        rating: 4.4,
        ratingsCount: 500123,
        isEbookAvailable: true,
    },
    'book7': {
        id: 'book7',
        titleEn: 'Educated',
        titleAr: 'متعلمة',
        authorEn: 'Tara Westover',
        authorAr: 'تارا ويستوفر',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635l/35133922.jpg',
        descriptionEn: 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
        descriptionAr: 'مذكرات عن فتاة صغيرة، مُنعت من الذهاب إلى المدرسة، تترك عائلتها الانعزالية وتذهب للحصول على درجة الدكتوراه من جامعة كامبريدج.',
        genresEn: ['Memoir', 'Non-fiction'],
        genresAr: ['مذكرات', 'واقعي'],
        rating: 4.5,
        ratingsCount: 680456,
        isEbookAvailable: false,
    },
    'book8': {
        id: 'book8',
        titleEn: 'Where the Crawdads Sing',
        titleAr: 'حيث يغني جراد البحر',
        authorEn: 'Delia Owens',
        authorAr: 'ديليا أوينز',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1585839728l/36809135.jpg',
        descriptionEn: 'For years, rumors of the “Marsh Girl” have haunted Barkley Cove, a quiet town on the North Carolina coast.',
        descriptionAr: 'لسنوات، طاردت شائعات "فتاة المستنقع" باركلي كوف، وهي بلدة هادئة على ساحل كارولينا الشمالية.',
        genresEn: ['Fiction', 'Mystery'],
        genresAr: ['خيال', 'غموض'],
        rating: 4.4,
        ratingsCount: 1200000,
        isEbookAvailable: true,
    },
    'book9': {
        id: 'book9',
        titleEn: 'Klara and the Sun',
        titleAr: 'كلارا والشمس',
        authorEn: 'Kazuo Ishiguro',
        authorAr: 'كازو إيشيغورو',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1603206535l/54120408.jpg',
        descriptionEn: 'A novel that looks at our changing world through the eyes of an unforgettable narrator, and explores the fundamental question: what does it mean to love?',
        descriptionAr: 'رواية تنظر إلى عالمنا المتغير من خلال عيون راوية لا تُنسى، وتستكشف السؤال الأساسي: ماذا يعني أن تحب؟',
        genresEn: ['Sci-Fi', 'Fiction'],
        genresAr: ['خيال علمي', 'خيال'],
        rating: 3.9,
        ratingsCount: 345678,
        isEbookAvailable: true,
    },
    'book10': {
        id: 'book10',
        titleEn: 'The Four Winds',
        titleAr: 'الرياح الأربع',
        authorEn: 'Kristin Hannah',
        authorAr: 'كريستين هانا',
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1601925686l/53138081.jpg',
        descriptionEn: 'An epic novel of love and heroism and hope, set during the Great Depression, a time when the country was in crisis and at war with itself, when millions were out of work and even the land seemed to have turned against them.',
        descriptionAr: 'رواية ملحمية عن الحب والبطولة والأمل، تدور أحداثها خلال فترة الكساد الكبير، وهي فترة كانت فيها البلاد في أزمة وفي حرب مع نفسها، عندما كان الملايين عاطلين عن العمل وحتى الأرض بدت وكأنها انقلبت عليهم.',
        genresEn: ['Historical Fiction', 'Fiction'],
        genresAr: ['خيال تاريخي', 'خيال'],
        rating: 4.3,
        ratingsCount: 450123,
        isEbookAvailable: false,
    },
};

export const mockTrendingBookIds = ['book1', 'book2'];

export const mockBookFlowData: BookFlowItem[] = [
    {
        bookId: 'book1',
        bookCoverUrl: mockBooks['book1'].coverUrl,
        quoteTextEn: 'Every book provides a chance to try another life you could have lived.',
        quoteTextAr: 'كل كتاب يوفر فرصة لتجربة حياة أخرى كان بإمكانك أن تعيشها.',
        authorEn: mockBooks['book1'].authorEn,
        authorAr: mockBooks['book1'].authorAr,
    },
    {
        bookId: 'book4',
        bookCoverUrl: mockBooks['book4'].coverUrl,
        quoteTextEn: 'We are all crazy, I believe, just in different ways.',
        quoteTextAr: 'كلنا مجانين، على ما أعتقد، ولكن بطرق مختلفة.',
        authorEn: mockBooks['book4'].authorEn,
        authorAr: mockBooks['book4'].authorAr,
    },
    {
        bookId: 'book5',
        bookCoverUrl: mockBooks['book5'].coverUrl,
        quoteTextEn: 'But in a solitary life, there are rare moments when another soul dips near yours, as stars once a year brush the earth.',
        quoteTextAr: 'ولكن في حياة منعزلة، هناك لحظات نادرة تقترب فيها روح أخرى من روحك، كما تلامس النجوم الأرض مرة في السنة.',
        authorEn: mockBooks['book5'].authorEn,
        authorAr: mockBooks['book5'].authorAr,
    },
    {
        bookId: 'book2',
        bookCoverUrl: mockBooks['book2'].coverUrl,
        quoteTextEn: 'Humanity is a science experiment. All living things are. We\'re all just seeing what happens.',
        quoteTextAr: 'البشرية تجربة علمية. كل الكائنات الحية كذلك. كلنا فقط نرى ما سيحدث.',
        authorEn: mockBooks['book2'].authorEn,
        authorAr: mockBooks['book2'].authorAr,
    },
    {
        bookId: 'book6',
        bookCoverUrl: mockBooks['book6'].coverUrl,
        quoteTextEn: 'You do not rise to the level of your goals. You fall to the level of your systems.',
        quoteTextAr: 'أنت لا ترتقي إلى مستوى أهدافك. أنت تسقط إلى مستوى أنظمتك.',
        authorEn: mockBooks['book6'].authorEn,
        authorAr: mockBooks['book6'].authorAr,
    },
    {
        bookId: 'book3',
        bookCoverUrl: mockBooks['book3'].coverUrl,
        quoteTextEn: 'I must not fear. Fear is the mind-killer.',
        quoteTextAr: 'يجب ألا أخاف. الخوف هو قاتل العقل.',
        authorEn: mockBooks['book3'].authorEn,
        authorAr: mockBooks['book3'].authorAr,
    },
    {
        bookId: 'book7',
        bookCoverUrl: mockBooks['book7'].coverUrl,
        quoteTextEn: 'The decisions I made after that moment were not the ones she would have made. They were the choices of a changed person, a new self.',
        quoteTextAr: 'القرارات التي اتخذتها بعد تلك اللحظة لم تكن تلك التي كانت ستتخذها. كانت خيارات شخص متغير، ذات جديدة.',
        authorEn: mockBooks['book7'].authorEn,
        authorAr: mockBooks['book7'].authorAr,
    },
    {
        bookId: 'book8',
        bookCoverUrl: mockBooks['book8'].coverUrl,
        quoteTextEn: 'I wasn\'t aware that words could hold so much. I didn\'t know a sentence could be so full.',
        quoteTextAr: 'لم أكن أدرك أن الكلمات يمكن أن تحمل الكثير. لم أكن أعرف أن جملة يمكن أن تكون ممتلئة إلى هذا الحد.',
        authorEn: mockBooks['book8'].authorEn,
        authorAr: mockBooks['book8'].authorAr,
    },
    {
        bookId: 'book9',
        bookCoverUrl: mockBooks['book9'].coverUrl,
        quoteTextEn: 'But what is a heart? Is it just something that pumps blood? Or is it the seat of the soul?',
        quoteTextAr: 'ولكن ما هو القلب؟ هل هو مجرد شيء يضخ الدم؟ أم أنه مقر الروح؟',
        authorEn: mockBooks['book9'].authorEn,
        authorAr: mockBooks['book9'].authorAr,
    },
    {
        bookId: 'book10',
        bookCoverUrl: mockBooks['book10'].coverUrl,
        quoteTextEn: 'Hope is a Ferris wheel—you have to wait for your turn to catch it.',
        quoteTextAr: 'الأمل عجلة فيريس - عليك أن تنتظر دورك لتمسك به.',
        authorEn: mockBooks['book10'].authorEn,
        authorAr: mockBooks['book10'].authorAr,
    },
];


// --- SHELVES ---
export const mockShelves: Shelf[] = [
    { id: 'currently-reading', titleEn: 'Currently Reading', titleAr: 'أقرأ حاليًا', entries: { 'book1': { bookId: 'book1', addedAt: '2023-10-26T10:00:00Z', progress: 65 } } },
    { id: 'want-to-read', titleEn: 'Want to Read', titleAr: 'أرغب في قراءته', entries: { 'book2': { bookId: 'book2', addedAt: '2023-10-20T10:00:00Z' } } },
    { id: 'sci-fi-faves', titleEn: 'Sci-Fi Faves', titleAr: 'مفضلاتي من الخيال العلمي', entries: { 'book2': { bookId: 'book2', addedAt: '2023-09-15T10:00:00Z' }, 'book3': { bookId: 'book3', addedAt: '2023-09-01T10:00:00Z' } } },
];

export const mockRecommendedShelves: RecommendedShelf[] = [
    { id: 'rec1', titleEn: "Epic Fantasy Worlds", titleAr: 'عوالم الفانتازيا الملحمية', ownerName: 'Jane Smith', bookCovers: [mockBooks['book3'].coverUrl, mockBooks['book1'].coverUrl], followerCount: 12500 },
    { id: 'rec2', titleEn: "Mind-Bending Sci-Fi", titleAr: 'خيال علمي محير للعقل', ownerName: 'BookBot5000', bookCovers: [mockBooks['book2'].coverUrl, mockBooks['book1'].coverUrl], followerCount: 8432 },
];


// --- QUOTES ---
export const mockQuoteOfTheDay: Quote = {
    id: 'qotd1',
    textEn: 'A reader lives a thousand lives before he dies . . . The man who never reads lives only one.',
    textAr: 'القارئ يعيش ألف حياة قبل أن يموت... الرجل الذي لا يقرأ أبدًا يعيش حياة واحدة فقط.',
    sourceEn: 'George R.R. Martin, A Dance with Dragons',
    sourceAr: 'جورج ر. ر. مارتن، رقصة مع التنانين',
};

export const mockUserQuotes: Quote[] = [
    mockQuoteOfTheDay,
    { id: 'q2', textEn: "So it goes.", textAr: "هكذا تسير الأمور.", sourceEn: "Kurt Vonnegut, Slaughterhouse-Five", sourceAr: "كورت فونيجت، المسلخ الخامس" },
];


// --- PROJECTS ---
export const mockProjects: Project[] = [
    { id: 'proj1', titleEn: 'Starfall', titleAr: 'سقوط النجم', typeEn: 'Novel', typeAr: 'رواية', status: 'Draft', wordCount: 25430, updatedAt: '2023-10-25T14:00:00Z', content: 'The night was cold on Kepler-186f...' },
    { id: 'proj2', titleEn: 'The Last Coffee Shop', titleAr: 'المقهى الأخير', typeEn: 'Short Story', typeAr: 'قصة قصيرة', status: 'Revision', wordCount: 5200, updatedAt: '2023-10-22T11:00:00Z', content: 'It was the last coffee shop at the end of the world.' },
];

// --- POSTS ---
export const mockPosts: Post[] = [
    {
        id: 'post1', authorId: 'jane_smith', authorName: 'Jane Smith', authorHandle: '@janesmith', authorAvatar: mockUsers[1].avatarUrl,
        content: "Just finished The Midnight Library and I'm speechless. What an incredible concept. Has anyone else read it?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        stats: { likes: 15, comments: 4, reposts: 2 },
        bookTagId: 'book1'
    },
    {
        id: 'post2', authorId: 'alex_doe', authorName: 'Alex Doe', authorHandle: '@alexdoe', authorAvatar: mockUsers[0].avatarUrl,
        content: "I'm about 65% through The Midnight Library. It's making me think about so many of my past choices. Highly recommend so far!",
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
        stats: { likes: 8, comments: 1, reposts: 0 },
        bookTagId: 'book1'
    },
];

// --- AGENTS ---
export const mockAgents: Agent[] = [
    {
        id: 'mentor', name: 'AI Mentor', descriptionEn: 'Get feedback on your writing', descriptionAr: 'احصل على ملاحظات على كتابتك',
        avatarUrl: '/assets/mentor-avatar.png', icon: MentorIcon, color: 'text-sky-400', isPremium: false,
        examplePromptsEn: ["Critique this paragraph...", "Does this character feel real?", "Suggest a better opening line."],
        examplePromptsAr: ["انقد هذه الفقرة...", "هل تبدو هذه الشخصية حقيقية؟", "اقترح سطراً افتتاحياً أفضل."],
        placeholderEn: "Paste your text or ask a question...",
        placeholderAr: "ألصق نصك أو اطرح سؤالاً..."
    },
    {
        id: 'librarian', name: 'AI Librarian', descriptionEn: 'Find your next favorite book', descriptionAr: 'اعثر على كتابك المفضل التالي',
        avatarUrl: '/assets/librarian-avatar.png', icon: ChatIcon, color: 'text-green-400', isPremium: false,
        examplePromptsEn: ["Find books like 'Dune'", "I want a fast-paced thriller", "Recommend a classic novel"],
        examplePromptsAr: ["ابحث عن كتب تشبه 'كثيب'", "أريد رواية إثارة سريعة الوتيرة", "أوصي برواية كلاسيكية"],
        placeholderEn: "Tell me what you're looking for...",
        placeholderAr: "أخبرني عما تبحث عنه..."
    },
    {
        id: 'quotes', name: 'Quote Finder', descriptionEn: 'Discover powerful quotes', descriptionAr: 'اكتشف اقتباسات قوية',
        avatarUrl: '/assets/quotes-avatar.png', icon: QuoteIcon, color: 'text-amber-400', isPremium: false,
        examplePromptsEn: ["Quotes about courage", "Find a quote from 'Project Hail Mary'"],
        examplePromptsAr: ["اقتباسات عن الشجاعة", "ابحث عن اقتباس من 'مشروع هيل ماري'"],
        placeholderEn: "What kind of quote are you seeking?",
        placeholderAr: "أي نوع من الاقتباسات تبحث عنه؟"
    },
    {
        id: 'lore', name: 'Lore Keeper', descriptionEn: 'Explore fictional worlds', descriptionAr: 'استكشف عوالم خيالية',
        avatarUrl: '/assets/lore-avatar.png', icon: LoreIcon, color: 'text-purple-400', isPremium: true,
        examplePromptsEn: [], examplePromptsAr: [], placeholderEn: "", placeholderAr: ""
    }
];

// --- TEMPLATES ---
export const mockTemplates: Template[] = [
    {
        id: 'novel-outline',
        titleEn: 'Novel Outline',
        titleAr: 'مخطط رواية',
        descriptionEn: 'Structure your epic.',
        descriptionAr: 'نظم ملحمتك.',
        icon: NovelIcon,
        boilerplateContent: `# Part 1: The Ordinary World\n\n## Chapter 1\n\n- Introduction to the protagonist...\n\n# Part 2: The Adventure Begins\n\n## Chapter 5\n\n- The inciting incident...\n`
    },
    {
        id: 'short-story-arc',
        titleEn: 'Short Story Arc',
        titleAr: 'قوس القصة القصيرة',
        descriptionEn: 'A simple three-act structure.',
        descriptionAr: 'هيكل بسيط من ثلاثة فصول.',
        icon: ShortStoryIcon,
        boilerplateContent: `# Act 1: Setup\n\n- \n\n# Act 2: Confrontation\n\n- \n\n# Act 3: Resolution\n\n- \n`
    },
    {
        id: 'academic-essay',
        titleEn: 'Academic Essay',
        titleAr: 'مقالة أكاديمية',
        descriptionEn: 'For research papers.',
        descriptionAr: 'لأوراق البحث.',
        icon: EssayIcon,
        boilerplateContent: `# Introduction\n\n- Hook:\n- Thesis Statement:\n\n# Body Paragraph 1\n\n- Topic Sentence:\n\n# Conclusion\n\n- Restate Thesis:\n`
    },
    {
        id: 'journal-entry',
        titleEn: 'Journal Entry',
        titleAr: 'إدخال يوميات',
        descriptionEn: 'Reflect on your day.',
        descriptionAr: 'تأمل في يومك.',
        icon: JournalIcon,
        boilerplateContent: `## Date: ${new Date().toLocaleDateString()}\n\n### How I'm feeling:\n\n\n### What happened today:\n\n\n### A thought to remember:\n\n`
    },
    {
        id: 'memoir',
        titleEn: 'Memoir',
        titleAr: 'مذكرات',
        descriptionEn: 'Share your life story.',
        descriptionAr: 'شارك قصة حياتك.',
        icon: MemoirIcon,
        boilerplateContent: `# Chapter 1: Early Years\n\n- \n\n# Chapter 2: The Turning Point\n\n- \n`
    },
    {
        id: 'poetry',
        titleEn: 'Poetry',
        titleAr: 'شعر',
        descriptionEn: 'Express with verse.',
        descriptionAr: 'عبر بالقافية.',
        icon: PoetryIcon,
        boilerplateContent: `## Title of Poem\n\nStanza 1...\n`
    },
    {
        id: 'book-review',
        titleEn: 'Book Review',
        titleAr: 'مراجعة كتاب',
        descriptionEn: 'Critique a recent read.',
        descriptionAr: 'انقد قراءة حديثة.',
        icon: BookReviewIcon,
        boilerplateContent: `# Review of [Book Title]\n\n## Summary\n\n## Analysis\n\n## Conclusion\n`
    },
    {
        id: 'screenplay',
        titleEn: 'Screenplay',
        titleAr: 'سيناريو',
        descriptionEn: 'Write for the screen.',
        descriptionAr: 'اكتب للشاشة.',
        icon: ScreenplayIcon,
        boilerplateContent: `FADE IN:\n\nEXT. LOCATION - DAY\n\nCHARACTER\n(V.O.)\nIt all started...\n`
    },
    {
        id: 'research-paper',
        titleEn: 'Research Paper',
        titleAr: 'ورقة بحثية',
        descriptionEn: 'For scholarly articles.',
        descriptionAr: 'للمقالات العلمية.',
        icon: ResearchPaperIcon,
        boilerplateContent: `# Abstract\n\n# Introduction\n\n# Methodology\n\n# Results\n\n# Discussion\n`
    },
    {
        id: 'blog-post',
        titleEn: 'Blog Post',
        titleAr: 'تدوينة',
        descriptionEn: 'Share your thoughts online.',
        descriptionAr: 'شارك أفكارك على الإنترنت.',
        icon: BlogPostIcon,
        boilerplateContent: `## Blog Post Title\n\n### Introduction\n\nBody content...\n`
    },
    {
        id: 'play-script',
        titleEn: 'Play Script',
        titleAr: 'نص مسرحي',
        descriptionEn: 'For the stage.',
        descriptionAr: 'للمسرح.',
        icon: PlayIcon,
        boilerplateContent: `## Act I\n\n### Scene 1\n\n[SETTING]\n\nCHARACTER 1\n(dialogue...)\n`
    },
    {
        id: 'character-profile',
        titleEn: 'Character Profile',
        titleAr: 'ملف شخصية',
        descriptionEn: 'Flesh out your characters.',
        descriptionAr: 'طور شخصياتك.',
        icon: CharacterProfileIcon,
        boilerplateContent: `# [Character Name]\n\n## Physical Description\n\n## Backstory\n\n## Goals\n\n## Flaws\n`
    }
];

// --- REVIEWS ---
export const mockReviews: Review[] = [
    {
        id: 'review1', bookId: 'book1', userId: 'jane_smith', rating: 5, text: 'A beautiful, thought-provoking novel that will stay with me for a long time. A must-read!',
        authorName: 'Jane Smith', authorHandle: '@janesmith', authorAvatar: mockUsers[1].avatarUrl,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    }
];


// --- MOCK DB STRUCTURE ---
export const MOCK_DATA = {
    users: {
        'alex_doe': mockUsers[0],
        'jane_smith': mockUsers[1],
    },
    catalog: {
        books: mockBooks,
    },
    recommendations_quick: {
        'alex_doe': {
            userId: 'alex_doe',
            bookIds: ['book2', 'book3', 'book1'],
            timestamp: new Date().toISOString(),
        }
    },
    reviews: {
        'review1': mockReviews[0],
    },
    posts: {
        'post1': mockPosts[0],
        'post2': mockPosts[1],
    }
};

// Add shelves and projects for alex_doe to the mock DB
(MOCK_DATA.users['alex_doe'] as any).shelves = mockShelves.reduce((acc, shelf) => {
    acc[shelf.id] = shelf;
    return acc;
}, {} as Record<string, Shelf>);

(MOCK_DATA.users['alex_doe'] as any).projects = mockProjects.reduce((acc, project) => {
    acc[project.id] = project;
    return acc;
}, {} as Record<string, Project>);

(MOCK_DATA.users['alex_doe'] as any).quotes = mockUserQuotes.reduce((acc, quote) => {
    acc[quote.id] = quote;
    return acc;
}, {} as Record<string, Quote>);