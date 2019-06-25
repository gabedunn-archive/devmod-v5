/*
 * Gabe Dunn 2019
 * Export a function to create consistent Discord embedded error messages.
 */

import { red } from './colours'

// Given a title and a description, return the object for a Discord embedded error message.
export const createErrorMessage = (title, description) => {
  return {
    title,
    color: red,
    description
  }
}
