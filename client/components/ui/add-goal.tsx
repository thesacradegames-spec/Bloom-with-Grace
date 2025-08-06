import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./button";

interface AddGoalProps {
  onAddGoal: (text: string) => void;
}

export function AddGoal({ onAddGoal }: AddGoalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [goalText, setGoalText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goalText.trim()) {
      onAddGoal(goalText.trim());
      setGoalText("");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-dreamlavender to-primary hover:from-dreamlavender/90 hover:to-primary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-6"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Dream Goal
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-dreampink/30 shadow-lg">
      <div className="flex gap-3">
        <label htmlFor="goal-input" className="sr-only">
          What's your dream goal for today?
        </label>
        <input
          id="goal-input"
          type="text"
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          placeholder="What's your dream goal for today?"
          className="flex-1 px-4 py-3 bg-dreamblush/30 border border-dreampink/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dreamlavender/50 focus:ring-offset-2 transition-all duration-200"
          autoFocus
          aria-required="true"
        />
        <Button
          type="submit"
          size="sm"
          className="bg-dreamlavender hover:bg-dreamlavender/90 text-white px-6 rounded-xl"
          disabled={!goalText.trim()}
        >
          Add
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setIsOpen(false);
            setGoalText("");
          }}
          className="border-dreampink/30 text-foreground/70 hover:bg-dreampink/10 rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
