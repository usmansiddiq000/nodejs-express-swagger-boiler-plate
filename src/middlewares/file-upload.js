const multer = require("multer");

exports.upload = () => {
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  };
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: multerFilter,
  });

  return upload;
};
