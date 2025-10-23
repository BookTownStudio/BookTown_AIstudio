import React from 'react';

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

export interface Author {
    id: string;
    nameEn: string;
    nameAr: string;
    avatarUrl: string;
    bioEn: string;
    bioAr: string;
    lifespan: string;
    countryEn: string;
    countryAr: string;
    languageEn: string;
    languageAr: string;
}

export interface Book {
    id: string;
    authorId: string;
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
    publicationDate?: string;
    pageCount?: number;
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
    bookId?: string;
    authorId?: string;
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
  | { type: 'venue'; venueId: string }
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
    upvotes: number;
    downvotes: number;
    commentsCount: number;
}

export interface VenueReview {
    id: string;
    venueId: string;
    userId: string;
    rating: number; // 1-5
    text: string;
    authorName: string;
    authorHandle: string;
    authorAvatar: string;
    timestamp: string; // ISO string
    upvotes: number;
    downvotes: number;
    commentsCount: number;
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

export interface Venue {
    id: string;
    ownerId: string;
    name: string;
    type: string; // e.g., "Bookstore & Cafe"
    address: string;
    imageUrl: string;
    descriptionEn: string;
    descriptionAr: string;
    openingHours?: string;
}

export interface Event {
    id: string;
    ownerId: string;
    titleEn: string;
    titleAr: string;
    type: string; // "Author Signing", "Book Reading"
    dateTime: string; // ISO string
    imageUrl: string;
    privacy: 'public' | 'private';
    duration?: string;
    isOnline?: boolean;
    venueName?: string;
    link?: string;
}

export interface BookFair {
    id: string;
    nameEn: string;
    nameAr: string;
    dates: string; // e.g., "October 28-30, 2024"
    location: string;
    taglineEn: string;
    taglineAr: string;
    imageUrl: string;
}

export type ForYouFlowItem =
  | { type: 'book'; data: BookFlowItem }
  | { type: 'user'; data: User }
  | { type: 'quote'; data: Quote }
  | { type: 'venue'; data: Venue }
  | { type: 'event'; data: Event }
  | { type: 'bookfair'; data: BookFair };

export type BookmarkType = 'book' | 'quote' | 'post' | 'author' | 'venue' | 'event';

export interface Bookmark {
    id: string;
    type: BookmarkType;
    entityId: string;
    timestamp: string; // ISO string
    quoteOwnerId?: string;
}

export type FeedbackType = 'action-required' | 'praise-general';

export interface Feedback {
    id: string;
    userId: string;
    type: FeedbackType;
    text: string;
    email?: string;
    attachments?: string[]; // Array of image URLs/references
    timestamp: string; // ISO string
}