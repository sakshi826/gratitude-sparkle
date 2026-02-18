import { useState } from "react";
import { getUserId } from "../lib/auth";
import { saveGratitudeEntry, GratitudeEntry } from "../lib/db";

const EMOJIS = ["🌟", "💛", "✨"];
const PLACEHOLDERS = ["I'm grateful for...", "I'm grateful for...", "I'm grateful for..."];

const GratitudeCheckIn = () => {
  const [items, setItems] = useState(["", "", ""]);
  const [submitted, setSubmitted] = useState(false);

  const hasAnyText = items.some((item) => item.trim().length > 0);

  const updateItem = (index: number, value: string) => {
    setItems((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const handleSubmit = async () => {
    const userId = getUserId();
    if (!userId) return;

    const nonEmpty = items.filter((item) => item.trim().length > 0);
    const loggedAt = new Date().toISOString();

    try {
      // Save each item as a separate gratitude entry
      await Promise.all(nonEmpty.map(text =>
        saveGratitudeEntry(userId, {
          gratitude_text: text.trim(),
          logged_at: loggedAt,
          is_shared: false,
          tags: []
        })
      ));
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to save gratitude entries:", error);
    }
  };

  const handleSkip = () => {
    setItems(["", "", ""]);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 animate-slide-up">
          <span className="text-6xl animate-check-pop">🙏</span>
          <h2 className="text-2xl font-bold text-foreground">Gratitude Logged!</h2>
          <p className="text-muted-foreground text-center max-w-xs">
            Taking a moment to appreciate the good things makes all the difference.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setItems(["", "", ""]);
            }}
            className="mt-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        {/* Header */}
        <div
          className="flex flex-col items-center gap-2 animate-slide-up"
          style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
        >
          <h1 className="text-2xl font-bold text-foreground">Gratitude Check-In</h1>
          <p className="text-muted-foreground">Name 3 things you're grateful for</p>
        </div>

        {/* Inputs */}
        <div className="flex w-full flex-col gap-4">
          {EMOJIS.map((emoji, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-slide-up"
              style={{
                animationDelay: `${(index + 1) * 200}ms`,
                animationFillMode: "backwards",
              }}
            >
              <span className="text-2xl select-none">{emoji}</span>
              <input
                type="text"
                value={items[index]}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={PLACEHOLDERS[index]}
                className="flex-1 rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
              />
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          className="flex w-full flex-col items-center gap-3 animate-slide-up"
          style={{ animationDelay: "800ms", animationFillMode: "backwards" }}
        >
          <button
            onClick={handleSubmit}
            disabled={!hasAnyText}
            className="w-full rounded-full bg-primary px-8 py-3.5 text-lg font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Log Gratitude
          </button>
          <button
            onClick={handleSkip}
            className="rounded-full px-6 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default GratitudeCheckIn;
