/*
 * Gabe Dunn 2019
 * Export a function to capitalize the first letter of a word.
 */

// Return a string with the first character.toUpperCase() and the rest the word sliced from index 1 onward.
export const capitalize = word => `${word[0].toUpperCase()}${word.slice(1)}`
