/*
 * Gabe Dunn 2019
 * File to run the main bot through ESM compatibility.
 */

require = require('esm')(module)

// Import the main module.
module.exports = require('./main.js')
