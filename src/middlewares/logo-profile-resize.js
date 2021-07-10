const path = require('path');
const sharp = require('sharp');
const {uploadDir} = require('../../config/config');
const {slugify} = require('../utils/slugify');

exports.resizeImage = async (req, res, next) => {
  if (!req.file) return next();
  const fileExtension = path.extname(req.file.originalname);
  const fileBase = path.basename(req.file.originalname, fileExtension);
  const fileSlug = `${slugify(fileBase)}-${Date.now()}${fileExtension}`;
  await sharp(req.file.buffer)
      .resize(100, 100, {
        fit: 'contain',
        position: 'center',
        background: {r: 0, g: 0, b: 0, alpha: 0},
      })
      .toFormat('png')
      .png({quality: 100})
      .toFile(`${uploadDir}/${fileSlug}`);
  req.file.path = `${uploadDir}/${fileSlug}`;
  next();
};
