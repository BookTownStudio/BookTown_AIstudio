export interface User {
    uid: string;
    email: string;
    name: string;
    handle: string;
    avatarUrl: string;
    bannerUrl: string;
    joinDate: string; // ISO string
    bioEn: string;
    bioAr: string;
    followers: number;
    following: number;
    role: 'user' | 'admin' | 'superuser';
    lastActive: string; // ISO string
    booksRead: number;
    quotesSaved: number;
    shelvesCount: number;
    wordsWritten: number;
    sharedInterest?: string; // e.g., "Shares your love for Sci-Fi"
}

export interface Book {
    id: string;
    titleEn: string;
    titleAr: string;
    authorEn: string;
    authorAr: string;
    coverUrl: string;
    descriptionEn: string;
    descriptionAr: string;
    genresEn: string[];
    genresAr: string[];
    rating: number;
    ratingsCount: number;
    isEbookAvailable: boolean;
}

export interface ShelfEntry {
    bookId: string;
    addedAt: string; // ISO string
    progress?: number; // 0-100 for 'currently-reading'
}

export interface Shelf {
    id: string;
    titleEn: string;
    titleAr: string;
    entries: { [bookId: string]: ShelfEntry };
}

export interface RecommendedShelf {
    id: string;
    titleEn: string;
    titleAr: string;
    ownerName: string;
    bookCovers: string[];
    followerCount: number;
}


export interface Quote {
    id: string;
    textEn: string;
    textAr: string;
    sourceEn: string;
    sourceAr: string;
}

export interface Project {
    id: string;
    titleEn: string;
    titleAr: string;
    typeEn: string;
    typeAr: string;
    status: 'Idea' | 'Draft' | 'Revision' | 'Final';
    wordCount: number;
    updatedAt: string; // ISO string
    content: string; // The actual content of the project
}

export type PostAttachment = 
  | { type: 'book'; bookId: string }
  | { type: 'quote'; quoteId: string, quoteOwnerId: string }
  | { type: 'media'; url: string }
  | { type: 'author'; authorId: string }
  | { type: 'shelf'; shelfId: string, ownerId: string }
  | { type: 'venue'; name: string, location: string }
  | { type: 'post'; postId: string };


export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorHandle: string;
    authorAvatar: string;
    content: string;
    timestamp: string; // ISO string
    stats: {
        likes: number;
        comments: number;

        reposts: number;
    };
    bookTagId?: string; // Optional book tag
    attachment?: PostAttachment;
}

export interface Agent {
    id: string;
    name: string;
    descriptionEn: string;
    descriptionAr: string;
    avatarUrl: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
    isPremium: boolean;
    examplePromptsEn: string[];
    examplePromptsAr: string[];
    placeholderEn: string;
    placeholderAr: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: string; // ISO string
}

export interface Review {
    id: string;
    bookId: string;
    userId: string;
    rating: number; // 1-5
    text: string;
    authorName: string;
    authorHandle: string;
    authorAvatar: string;
    timestamp: string; // ISO string
}

export interface QuickRecommendations {
    userId: string;
    bookIds: string[];
    timestamp: string; // ISO string
}

export interface Template {
    id: string;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    boilerplateContent: string;
}

export interface BookFlowItem {
  bookId: string;
  bookCoverUrl: string;
  quoteTextEn: string;
  quoteTextAr: string;
  authorEn: string;
  authorAr: string;
}