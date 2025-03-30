const path = require('path');

module.exports = {
  mode: 'development', // ✅ Fix 1: Explicitly set mode to "development"
  entry: './public/assets/js/script.js', // ✅ Fix 2: Use the correct path for script.js
  output: {
    filename: 'bundle.js', // ✅ Webpack will output this file
    path: path.resolve(__dirname, 'public/assets/js'),
  },
};
