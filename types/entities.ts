// FIX: Import React to provide types for component props.
import React from 'react';

export interface User {
    id: string;
    name: string;
    handle: string;
    email: string;
    avatarUrl: string;
    bannerUrl: string;
    bioEn: string;
    bioAr: string;
    role: 'user' | 'admin' | 'superuser';
    followers: number;
    following: number;
    joinDate: string; // ISO Date string
    lastActive?: string; // ISO Date string
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
    isEbookAvailable?: boolean;
}

export interface Shelf {
    id: string;
    titleEn: string;
    titleAr: string;
    // This allows the mock DB to attach entries to the shelf object.
    entries?: Record<string, ShelfEntry>;
}

export interface ShelfEntry {
    bookId: string;
    addedAt: string; // ISO Date string
    progress?: number; // 0-100 for 'currently-reading'
}

export interface Quote {
    id: string;
    textEn: string;
    textAr: string;
    sourceEn: string; // e.g., "Book Title, Author"
    sourceAr: string;
}

export interface Project {
    id: string;
    titleEn: string;
    titleAr: string;
    typeEn: 'Novel' | 'Short Story' | 'Poetry';
    typeAr: 'رواية' | 'قصة قصيرة' | 'شعر';
    status: 'Idea' | 'Draft' | 'Revision' | 'Final';
    wordCount: number;
    updatedAt: string; // ISO Date string
}

export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorHandle: string;
    authorAvatar: string;
    content: string;
    timestamp: string; // ISO Date string
    bookTagId?: string; // ID of a book tagged in the post
    stats: {
        likes: number;
        comments: number;
        reposts: number;
    };
}

export interface Review {
    id: string;
    bookId: string;
    userId: string;
    authorName: string;
    authorHandle: string;
    authorAvatar: string;
    rating: number; // 1-5
    text: string;
    timestamp: string; // ISO Date string
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: string; // ISO Date string
}

export interface Agent {
    id: 'mentor' | 'librarian' | 'quotes' | 'lore';
    name: string;
    descriptionEn: string;
    descriptionAr: string;
    avatarUrl: string;
    isPremium: boolean;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
    examplePromptsEn: string[];
    examplePromptsAr: string[];
    placeholderEn: string;
    placeholderAr: string;
}

export interface QuickRecommendations {
    bookIds: string[];
    timestamp: string; // ISO Date string
}