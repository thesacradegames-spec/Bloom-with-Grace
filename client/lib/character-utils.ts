import { getCurrentUser } from './user-data-utils';
import { CUTE_CHARACTERS, Character, getCharacterById } from './characters';

/**
 * Get user's selected character from localStorage
 */
export function getUserCharacter(username?: string): Character {
  const user = username || getCurrentUser();
  if (!user) return CUTE_CHARACTERS[0]; // Default to first character
  
  const key = `bloom-user-${user.toLowerCase().replace(/\s+/g, '-')}-character`;
  const characterId = localStorage.getItem(key);
  
  if (characterId) {
    const character = getCharacterById(characterId);
    if (character) return character;
  }
  
  // Default to first character if none found
  return CUTE_CHARACTERS[0];
}

/**
 * Save user's selected character to localStorage
 */
export function saveUserCharacter(characterId: string, username?: string): void {
  const user = username || getCurrentUser();
  if (!user) return;
  
  const key = `bloom-user-${user.toLowerCase().replace(/\s+/g, '-')}-character`;
  localStorage.setItem(key, characterId);
}
