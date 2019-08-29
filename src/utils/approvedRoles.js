/*
 * Gabe Dunn 2019
 * List and gather all roles approved for use with automatic role assignment.
 */

// TODO: change to allow for discord emoji

// For each category of roles, make an object with a unique ID and name, a message, and an object consisting of
// {role: {name, emoji}} groups.
const generalRoles = {
  id: 'general',
  name: 'General Roles',
  message: 'These are some general roles that we have for you to add.',
  roles: {
    developer: { name: 'Developer', emoji: '☕' },
    challenges: { name: 'Challenges', emoji: '👌' }
  }
}

const helpRoles = {
  id: 'help',
  name: 'Help Roles',
  message: 'These are roles that you can add to yourself to say that you\'re able and willing to help in the specified area.',
  roles: {
    'helper': { name: 'Helper', emoji: '🚁' },
    'help-javascript': { name: 'JavaScript Helper', emoji: '🖥' },
    'help-frontend': { name: 'Frontend Helper', emoji: '📰' },
    'help-design': { name: 'Design Helper', emoji: '📱' },
    'help-ux': { name: 'UX Helper', emoji: '♦' },
    'help-php': { name: 'PHP Helper', emoji: '💩' }
  }
}

// Export a list of all available roles.
export const allRoles = [
  generalRoles,
  helpRoles
]
