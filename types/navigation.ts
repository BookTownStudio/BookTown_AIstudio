import { ReactElement } from "react";

export type TabName = 'home' | 'read' | 'discover' | 'write' | 'social';
export type DrawerScreenName = 
    'profile' | 
    'bookmarks' | 
    'quotes' | 
    'authors' | 
    'venues' | 
    'feedback' |
    'settings' |
    'email' |
    'adminDashboard' |
    'books';
    
export type ImmersiveScreenName = 'bookDetails' | 'editor' | 'agentChat' | 'reader' | 'liveSearch' | 'postComposer' | 'profile' | 'authorDetails' | 'quoteDetails' | 'discoveryFlow' | 'venueDetails';

// A flexible params type for navigation
export interface NavigationParams {
    [key: string]: any;
    from?: View; // Can store the previous view for back navigation
}

export type View =
  | { type: 'tab'; id: TabName; params?: NavigationParams }
  | { type: 'drawer'; id: DrawerScreenName; params?: NavigationParams }
  | { type: 'immersive'; id: ImmersiveScreenName; params?: NavigationParams };