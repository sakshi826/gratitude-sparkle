import { supabase, setUserContext, isSupabaseConfigured } from './supabase';

export interface GratitudeEntry {
    id?: string;
    logged_at: string;
    gratitude_text: string;
    category?: string;
    intensity?: number;
    is_shared: boolean;
    tags: string[];
}

export interface GratitudeStreak {
    current_streak: number;
    longest_streak: number;
    last_entry_date?: string;
    total_entries: number;
    streak_goal: number;
}

const MOCK_ENTRIES: GratitudeEntry[] = [
    { logged_at: new Date().toISOString(), gratitude_text: 'Thankful for a sunny day!', is_shared: false, tags: ['nature'] }
];

const MOCK_STREAK: GratitudeStreak = { current_streak: 3, longest_streak: 10, total_entries: 25, streak_goal: 7 };

export async function upsertUser(userId: number): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
    } catch (e) {
        console.warn('DB: upsertUser failed:', e);
    }
}

export async function saveGratitudeEntry(userId: number, entry: GratitudeEntry) {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        const { error } = await supabase.from('gratitude_entries').insert({
            user_id: userId,
            ...entry
        });
        if (error) throw error;
    } catch (e) {
        console.error('DB: saveGratitudeEntry failed:', e);
    }
}

export async function getGratitudeEntries(userId: number): Promise<GratitudeEntry[]> {
    if (!isSupabaseConfigured) return MOCK_ENTRIES;
    try {
        await setUserContext(userId);
        const { data, error } = await supabase
            .from('gratitude_entries')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: false });

        if (error) throw error;
        return data || MOCK_ENTRIES;
    } catch (e) {
        console.error('DB: getGratitudeEntries failed:', e);
        return MOCK_ENTRIES;
    }
}

export async function deleteGratitudeEntry(userId: number, id: string) {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        const { error } = await supabase
            .from('gratitude_entries')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
    } catch (e) {
        console.error('DB: deleteGratitudeEntry failed:', e);
    }
}

export async function saveGratitudeStreak(userId: number, streak: GratitudeStreak) {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        const { error } = await supabase
            .from('gratitude_streak')
            .upsert({ user_id: userId, ...streak }, { onConflict: 'user_id' });

        if (error) throw error;
    } catch (e) {
        console.error('DB: saveGratitudeStreak failed:', e);
    }
}

export async function getGratitudeStreak(userId: number): Promise<GratitudeStreak> {
    if (!isSupabaseConfigured) return MOCK_STREAK;
    try {
        await setUserContext(userId);
        const { data, error } = await supabase
            .from('gratitude_streak')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || MOCK_STREAK;
    } catch (e) {
        console.error('DB: getGratitudeStreak failed:', e);
        return MOCK_STREAK;
    }
}