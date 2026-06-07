const fs = require('fs');
try {
  const code = fs.readFileSync('/Users/mayur/STUDY-ROOM-MOCK/client/src/pages/Room.jsx', 'utf8');
  // Simple check for matching brackets/braces using acorn or just logging lengths
  console.log("File read successfully, length:", code.length);
} catch (e) {
  console.error("Error reading file:", e);
}
