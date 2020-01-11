/*
 * Gabe Dunn 2019
 * File to run the verification bot through ESM compatibility.
 */

const r = require('esm')(module)

// Import the main module.
module.exports = r('./verify.js')
