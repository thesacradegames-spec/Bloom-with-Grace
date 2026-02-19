import { useState } from "react";
import { Calendar, User, Sparkles } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { CUTE_CHARACTERS } from "@/lib/characters";

interface ProfileData {
  name: string;
  birthday: string;
  character: string;
}

interface ProfileFormProps {
  onComplete: (data: ProfileData) => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(CUTE_CHARACTERS[0].id);
  const [errors, setErrors] = useState<{ name?: string; birthday?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { name?: string; birthday?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!birthday) {
      newErrors.birthday = "Birthday is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors and submit
    setErrors({});
    onComplete({
      name: name.trim(),
      birthday,
      character: selectedCharacter
    });
  };

  const selectedCharacterData = CUTE_CHARACTERS.find(char => char.id === selectedCharacter) || CUTE_CHARACTERS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-white/8 to-pink-300/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-300/15 to-blue-400/15 rounded-full blur-3xl"></div>
        
        {[...Array(8)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/10"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
              fontSize: '16px',
            }}
          />
        ))}
      </div>

      {/* Form container */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-white/20 to-white/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your Garden! 🌸</h2>
          <p className="text-white/80 text-sm">Let's personalize your blooming journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-white font-medium">Your Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 focus:ring-white/20"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="birthday" className="text-white font-medium">Birthday</Label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white/60" />
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="bg-white/10 border-white/20 text-white focus:border-white/40 focus:ring-white/20 [&::-webkit-calendar-picker-indicator]:invert"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.birthday && <p className="text-red-300 text-xs mt-1">{errors.birthday}</p>}
          </div>

          <div>
            <Label className="text-white font-medium mb-3 block">Choose Your Character 🎭</Label>
            <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto bg-white/5 rounded-xl p-3 border border-white/20">
              {CUTE_CHARACTERS.map((character) => (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => setSelectedCharacter(character.id)}
                  className={`p-3 rounded-xl transition-all duration-300 border-2 ${
                    selectedCharacter === character.id
                      ? `border-white/60 bg-gradient-to-r ${character.color} shadow-lg scale-105`
                      : 'border-white/20 bg-white/10 hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  <div className="text-2xl mb-1">{character.emoji}</div>
                  <div className="text-white text-xs font-medium">{character.name}</div>
                </button>
              ))}
            </div>
            <p className="text-white/70 text-xs mt-2">
              Selected: {selectedCharacterData.name} - {selectedCharacterData.description} ✨
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white py-3 text-lg font-semibold"
          >
            Start Blooming! 🌺
          </Button>
        </form>
      </div>
    </div>
  );
}
