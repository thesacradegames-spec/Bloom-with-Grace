interface DailyQuote {
  text: string;
  author?: string;
  category: 'life' | 'happiness' | 'consistency' | 'hard_work' | 'spirituality' | 'motivation';
}

const DAILY_QUOTES: DailyQuote[] = [
  // Life quotes
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: "life" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "life" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "life" },
  { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr.", category: "life" },
  { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll", category: "life" },

  // Happiness quotes  
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "happiness" },
  { text: "The most important thing is to enjoy your life—to be happy—it's all that matters.", author: "Audrey Hepburn", category: "happiness" },
  { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi", category: "happiness" },
  { text: "For every minute you are angry you lose sixty seconds of happiness.", author: "Ralph Waldo Emerson", category: "happiness" },
  { text: "Happiness is not a goal; it is a by-product.", author: "Eleanor Roosevelt", category: "happiness" },

  // Consistency quotes
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier", category: "consistency" },
  { text: "It's not what we do once in a while that shapes our lives, but what we do consistently.", author: "Tony Robbins", category: "consistency" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.", author: "John C. Maxwell", category: "consistency" },
  { text: "Consistency is the hallmark of the unimaginative.", author: "Oscar Wilde", category: "consistency" },
  { text: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and starting on the first one.", author: "Mark Twain", category: "consistency" },

  // Hard work quotes
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke", category: "hard_work" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon", category: "hard_work" },
  { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills", category: "hard_work" },
  { text: "Opportunities are usually disguised as hard work, so most people don't recognize them.", author: "Ann Landers", category: "hard_work" },
  { text: "Hard work is a prison sentence only if it does not have meaning.", author: "Malcolm Gladwell", category: "hard_work" },

  // Spirituality quotes
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius", category: "spirituality" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha", category: "spirituality" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi", category: "spirituality" },
  { text: "The spiritual journey is individual, highly personal. It can't be organized or regulated.", author: "Ram Dass", category: "spirituality" },
  { text: "In the depths of winter, I finally learned that there was in me an invincible summer.", author: "Albert Camus", category: "spirituality" },

  // Motivation quotes
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "motivation" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "motivation" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "motivation" },

  // Additional inspiring quotes for variety
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "life" },
  { text: "Yesterday is history, tomorrow is a mystery, today is a gift.", category: "motivation" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "motivation" },
  { text: "She believed she could, so she did.", category: "motivation" },
  { text: "A diamond is a chunk of coal that is made good under pressure.", category: "hard_work" },
  { text: "Stars can't shine without darkness.", category: "spirituality" },
  { text: "Bloom where you are planted.", category: "life" },
  { text: "Every flower must grow through dirt.", category: "hard_work" },
  { text: "You are exactly where you need to be.", category: "spirituality" },
  { text: "Progress, not perfection.", category: "consistency" },
  { text: "Choose joy every day.", category: "happiness" },
  { text: "Your only limit is your mind.", category: "motivation" },
  { text: "Dream it. Believe it. Achieve it.", category: "motivation" },
  { text: "Small steps every day lead to big changes one year from now.", category: "consistency" },
  { text: "Be the energy you want to attract.", category: "spirituality" }
];

/**
 * Get a daily quote based on the current date
 * This ensures the same quote appears for the entire day
 */
export function getDailyQuote(date?: string): DailyQuote {
  const currentDate = date || new Date().toISOString().split('T')[0];
  
  // Create a simple hash from the date string
  let hash = 0;
  for (let i = 0; i < currentDate.length; i++) {
    const char = currentDate.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}

/**
 * Get quotes by category
 */
export function getQuotesByCategory(category: DailyQuote['category']): DailyQuote[] {
  return DAILY_QUOTES.filter(quote => quote.category === category);
}

/**
 * Get a random quote from a specific category
 */
export function getRandomQuoteByCategory(category: DailyQuote['category']): DailyQuote {
  const categoryQuotes = getQuotesByCategory(category);
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
}

/**
 * Get all available quote categories
 */
export function getQuoteCategories(): DailyQuote['category'][] {
  return ['life', 'happiness', 'consistency', 'hard_work', 'spirituality', 'motivation'];
}
