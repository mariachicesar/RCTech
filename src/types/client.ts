export interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    website_id: number;
    google_business_profile?: GoogleBusinessProfile;
    created_at: string;
    updated_at: string;
}

export interface GoogleBusinessProfile {
    id: number;
    client_id: number;
    business_name: string;
    place_id: string;
    access_token?: string;
    refresh_token?: string;
    account_id: string;
    location_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ScheduledPost {
    id: number;
    client_id: number;
    google_business_profile_id: number;
    content: string;
    media_urls?: string[];
    scheduled_date: string;
    status: 'scheduled' | 'published' | 'failed' | 'cancelled';
    post_id?: string;
    created_at: string;
    updated_at: string;
}

export interface PostFormData {
    content: string;
    media_urls: string[];
    scheduled_date: string;
    client_id: number;
}
