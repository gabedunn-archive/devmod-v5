# LMGTFY

## Usage
`.lmgtfy <query> [<site> <type>]`

Sends a 'let me google that for you link'.

`<site>` can be one of these options (the key - with the hyphen)
```js
const sites = {
    '-g': 'g', // google
    '-y': 'y', //yahoo
    '-b': 'b', // bing
    '-k': 'k', // ask
    '-a': 'a', // aol
    '-d': 'd' // duckduckgo
}
```
The same applies to the type of query:
```js
const types = {
    '-w': 'w', // web
    '-i': 'i' // image
}
```


## Permission Requirements
`['SEND_MESSAGES']`

## Author
**devmod** © [RedXTech](https://github.com/redxtech), Released under the [MIT](../LICENSE.md) License.
