export interface Character {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export const CUTE_CHARACTERS: Character[] = [
  {
    id: 'unicorn',
    name: 'Magical Unicorn',
    emoji: '🦄',
    description: 'Sparkly and magical',
    color: 'from-pink-400 to-purple-400'
  },
  {
    id: 'cat',
    name: 'Cute Kitty',
    emoji: '🐱',
    description: 'Adorable and playful',
    color: 'from-orange-400 to-pink-400'
  },
  {
    id: 'bunny',
    name: 'Sweet Bunny',
    emoji: '🐰',
    description: 'Soft and cuddly',
    color: 'from-pink-300 to-rose-400'
  },
  {
    id: 'panda',
    name: 'Happy Panda',
    emoji: '🐼',
    description: 'Calm and wise',
    color: 'from-gray-400 to-gray-600'
  },
  {
    id: 'fox',
    name: 'Clever Fox',
    emoji: '🦊',
    description: 'Smart and cunning',
    color: 'from-orange-400 to-red-400'
  },
  {
    id: 'koala',
    name: 'Sleepy Koala',
    emoji: '🐨',
    description: 'Peaceful and chill',
    color: 'from-gray-300 to-blue-400'
  },
  {
    id: 'hamster',
    name: 'Tiny Hamster',
    emoji: '🐹',
    description: 'Small but mighty',
    color: 'from-yellow-300 to-orange-400'
  },
  {
    id: 'owl',
    name: 'Wise Owl',
    emoji: '🦉',
    description: 'Intelligent and thoughtful',
    color: 'from-brown-400 to-yellow-600'
  },
  {
    id: 'penguin',
    name: 'Cool Penguin',
    emoji: '🐧',
    description: 'Stylish and fun',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'butterfly',
    name: 'Pretty Butterfly',
    emoji: '🦋',
    description: 'Graceful and colorful',
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: 'bee',
    name: 'Busy Bee',
    emoji: '🐝',
    description: 'Hard-working and sweet',
    color: 'from-yellow-400 to-amber-500'
  },
  {
    id: 'ladybug',
    name: 'Lucky Ladybug',
    emoji: '🐞',
    description: 'Brings good fortune',
    color: 'from-red-400 to-pink-400'
  },
  {
    id: 'dolphin',
    name: 'Friendly Dolphin',
    emoji: '🐬',
    description: 'Playful and smart',
    color: 'from-blue-400 to-teal-400'
  },
  {
    id: 'octopus',
    name: 'Creative Octopus',
    emoji: '🐙',
    description: 'Multi-talented genius',
    color: 'from-purple-400 to-indigo-400'
  },
  {
    id: 'star',
    name: 'Shining Star',
    emoji: '⭐',
    description: 'Bright and inspiring',
    color: 'from-yellow-300 to-yellow-500'
  },
  {
    id: 'rainbow',
    name: 'Happy Rainbow',
    emoji: '🌈',
    description: 'Colorful and joyful',
    color: 'from-pink-400 to-blue-400'
  }
];

export function getCharacterById(id: string): Character | null {
  return CUTE_CHARACTERS.find(char => char.id === id) || null;
}

export function getRandomCharacter(): Character {
  const randomIndex = Math.floor(Math.random() * CUTE_CHARACTERS.length);
  return CUTE_CHARACTERS[randomIndex];
}
