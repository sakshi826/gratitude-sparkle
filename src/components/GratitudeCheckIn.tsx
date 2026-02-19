import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GratitudeCheckIn = () => {
  return (
    <div className="max-w-md mx-auto space-y-8 py-8 px-4 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Gratitude Sparkle</h1>
          <p className="text-muted-foreground text-lg italic">"Gratitude doesnt need words right now. Just feel it."</p>
        </div>
      </div>

      <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 space-y-6 text-center">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary opacity-70">Focus for today</h3>
        <p className="text-2xl font-medium text-foreground italic">
          "A moment of peace today"
        </p>
      </div>

      <Button
        className="w-full h-14 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 group"
        onClick={() => window.location.reload()}
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
      </Button>
    </div>
  );
};

export default GratitudeCheckIn;