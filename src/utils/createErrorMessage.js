import { red } from './colours'

export const createErrorMessage = (title, description) => {
  return {
    title,
    color: red,
    description
  }
}
