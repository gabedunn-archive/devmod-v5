/*
 * Gabe Dunn 2019
 * A few functions relating to member & getName objects.
 */

// Given a member or getName, return a string with the name of the member.
export const getName = user => {
  // If he the user has a 'user' field (read: is a member), return the nickname or user.username. Otherwise, return the user.username.
  return Object.prototype.hasOwnProperty.call(user, 'user')
    ? user.nickname
      ? user.nickname
      : user.user.username
    : user.username
}

// Given a member or getName, return an object of the author field for a message.
export const getAuthor = user => {
  // Create an initial author object with the name of the user.
  const author = {
    name: getName(user)
  }

  // If the user has a 'user' field (read: is a member), set the icon_url to the user.avatarURL(). Otherwise, set it to the avatarURL.
  if (Object.prototype.hasOwnProperty.call(user, 'user')) {
    author.icon_url = user.user.avatarURL()
  } else {
    author.icon_url = user.avatarURL()
  }

  // Return the author object.
  return author
}
