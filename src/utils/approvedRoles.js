const generalRoles = {
  name: 'General Roles',
  message: 'These are some general roles that we have for you to add.',
  roles: {
    developer: { name: 'Developer', emoji: '☕' },
    challenges: { name: 'Challenges', emoji: '👌' }
  }
}

const helpRoles = {
  name: 'Help Roles',
  message: 'These are roles that you can add to yourself to say that you\'re able and willing to help in the specified area.',
  roles: {
    'helper': { name: 'Helper', emoji: '🚁' },
    'help-javascript': { name: 'JavaScript Helper', emoji: '🖥' },
    'help-html-css': { name: 'HTML & CSS Helper', emoji: '📰' },
    'help-design': { name: 'Design Helper', emoji: '📱' },
    'help-ux': { name: 'UX Helper', emoji: '♦' },
    'help-php': { name: 'PHP Helper', emoji: '💩' }
  }
}

export const allRoles = [
  generalRoles,
  helpRoles
]
