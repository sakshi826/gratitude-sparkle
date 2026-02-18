import { supabase, setUserContext } from './supabase';

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

export async function upsertUser(userId: number): Promise<void> {
    await setUserContext(userId);
    const { error } = await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
    if (error) throw error;
}

export async function saveGratitudeEntry(userId: number, entry: GratitudeEntry) {
    await setUserContext(userId);
    const { error } = await supabase.from('gratitude_entries').insert({
        user_id: userId,
        ...entry
    });
    if (error) throw error;
}

export async function getGratitudeEntries(userId: number): Promise<GratitudeEntry[]> {
    await setUserContext(userId);
    const { data, error } = await supabase
        .from('gratitude_entries')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function deleteGratitudeEntry(userId: number, id: string) {
    await setUserContext(userId);
    const { error } = await supabase
        .from('gratitude_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) throw error;
}

export async function saveGratitudeStreak(userId: number, streak: GratitudeStreak) {
    await setUserContext(userId);
    const { error } = await supabase
        .from('gratitude_streak')
        .upsert({ user_id: userId, ...streak }, { onConflict: 'user_id' });

    if (error) throw error;
}

export async function getGratitudeStreak(userId: number): Promise<GratitudeStreak | null> {
    await setUserContext(userId);
    const { data, error } = await supabase
        .from('gratitude_streak')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}
