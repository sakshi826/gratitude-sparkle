import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Sparkles, Heart, Sun } from "lucide-react";
import { getUserId } from "../lib/auth";
import { saveGratitudeEntry } from "../lib/db";

const GratitudeCheckIn = () => {
  const [entry, setEntry] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const userId = getUserId();
    if (userId && entry.trim()) {
      setIsSaving(true);
      try {
        await saveGratitudeEntry(userId, {
          content: entry.trim(),
          logged_at: new Date().toISOString(),
        });
        setIsSaved(true);
      } catch (error) {
        console.error("Failed to save gratitude:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isSaved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-amber/20 flex items-center justify-center">
          <Sun className="w-10 h-10 text-amber animate-pulse" strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Gratitude Logged!</h2>
          <p className="text-muted-foreground mt-2 max-w-xs">Noticing the good things increases your inner light. âœ¨</p>
        </div>
        <Button
          variant="outline"
          onClick={() => { setIsSaved(false); setEntry(""); }}
          className="rounded-full px-8"
        >
          Share more gratitude
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-10 py-8 px-4 animate-in fade-in duration-700">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 text-amber text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          Daily Sparkle
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">What's one thing you're grateful for?</h1>
        <p className="text-muted-foreground text-lg italic">"Gratitude turns what we have into enough."</p>
      </div>

      <div className="relative">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-amber/10 rounded-full flex items-center justify-center">
          <Heart className="w-6 h-6 text-amber fill-current" />
        </div>
        <Textarea
          placeholder="Today, I am grateful for..."
          className="min-h-[200px] rounded-3xl border-2 border-amber/20 bg-amber/5 p-8 text-xl leading-relaxed focus:bg-background focus:border-amber focus:ring-0 transition-all font-medium"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
      </div>

      <Button
        className="w-full h-16 rounded-3xl text-lg font-bold bg-amber hover:bg-amber/90 text-white shadow-xl hover:shadow-amber/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        disabled={!entry.trim() || isSaving}
        onClick={handleSave}
      >
        {isSaving ? "Saving..." : "Log Gratitude"}
      </Button>

      <p className="text-center text-xs text-muted-foreground opacity-50">
        Focusing on 3 things daily can significantly reduce stress and improve mental health.
      </p>
    </div>
  );
};

export default GratitudeCheckIn;
