/*
 * Gabe Dunn 2019
 * File to run the main bot through ESM compatibility.
 */

const r = require('esm')(module)

// Import the main module.
module.exports = r('./main.js')
