const fs = require('fs');

exports.fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (e) {
    return false;
  }
};
