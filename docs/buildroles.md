# Build Roles

## Usage
`.buildroles`

For each item in the `approvedRoles` field in the config, sends a message to the channel
specified in `channels.roles`, saves the IDs to the database, and lets the role reaction
listener add and removes roles based on the reaction.

## Specification
Each element of the `approvedRoles` array should look like this:
```js
{
  'general', // unique ID
  name: 'General Roles', // name for roles group
  message: 'These are some general roles that we have for you to add.', // message for the roles group
  roles: { // object with the role name as keys
    { // role name (same as in server settings)
      'Developer', // the name that should be shown in the message
      emoji: '☕' // the emoji that will be used as the reaction
    }
  }
}
```

## Permission Requirements
`['ADMINISTRATOR']`

## Author
**devmod** © [RedXTech](https://github.com/redxtech), Released under the [MIT](../LICENSE.md) License.
