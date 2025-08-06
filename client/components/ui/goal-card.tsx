import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ id, text, completed, onToggle, onDelete }: GoalCardProps) {
  return (
    <div 
      className={cn(
        "group bg-white/80 backdrop-blur-sm p-4 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
        completed 
          ? "border-dreamlavender/50 bg-dreamlavender/10" 
          : "border-dreampink/30 hover:border-dreamlavender/40"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(id)}
          aria-label={`${completed ? 'Mark as incomplete' : 'Mark as complete'}: ${text}`}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-dreamlavender/50 focus:ring-offset-2",
            completed
              ? "bg-dreamlavender border-dreamlavender text-white"
              : "border-dreampink/60 hover:border-dreamlavender hover:bg-dreamlavender/10"
          )}
        >
          {completed && <Check className="w-4 h-4" />}
        </button>
        
        <span className={cn(
          "flex-1 text-foreground transition-all duration-200",
          completed && "line-through opacity-60"
        )}>
          {text}
        </span>
        
        <button
          onClick={() => onDelete(id)}
          aria-label={`Delete goal: ${text}`}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:ring-offset-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
