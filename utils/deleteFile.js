const fs = require('fs');
const path = require('path');

module.exports = (file) => {
  const filePath = path.join(__dirname, `../public/${file}`);
  fs.unlink(filePath, () => {});
};
