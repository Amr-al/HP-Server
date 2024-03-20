const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/properties/original`)) {
      fs.mkdirSync(`${__dirname}/../uploads/properties/original`, {
        recursive: true,
      });
    }
    cb(null, `${__dirname}/../uploads/properties/original`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];

    cb(null, 0 + "-" + uniqueSuffix + `.${ext}`);
  },
});
const mainWithImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../uploads/properties/original`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];

    cb(null, 0 + "-" + uniqueSuffix + `.${ext}`);
  },
});
const tenantImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "IDImage") {
      cb(null, `${__dirname}/../uploads/tenants/IDImage`);
    } else if (file.fieldname === "passportImage") {
      cb(null, `${__dirname}/../uploads/tenants/passportImage`);
    } else {
      cb(null, `${__dirname}/../uploads/tenants/contractIma  ge`);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];

    cb(null, 0 + "-" + uniqueSuffix + `.${ext}`);
  },
});
const watermarkStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/watermark/`)) {
      fs.mkdirSync(`${__dirname}/../uploads/watermark/`, {
        recursive: true,
      });
    }
    cb(null, `${__dirname}/../uploads/watermark/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    cb(null, "logo_200_85" + `.${ext}`);
  },
});
const blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/blogs/`)) {
      fs.mkdirSync(`${__dirname}/../uploads/blogs/`, {
        recursive: true,
      });
    }
    cb(null, `${__dirname}/../uploads/blogs/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    cb(null, 0 + "-" + uniqueSuffix + `.${ext}`);
  },
});
const allowedFiles = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|svg)$/)) {
    req.fileValidationError =
      "Only jpg|JPG|jpeg|JPEG|png|PNG file type are allowed!";
    return cb(
      new multer.MulterError(
        "Only jpg|JPG|jpeg|JPEG|png|PNG|webp|svg file type  are allowed!"
      ),
      false
    );
  } else cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: allowedFiles,
  limits: { fileSize: 1024 * 1024 * 5 },
});
const uploadMainWithImage = multer({
  storage: mainWithImageStorage,
  fileFilter: allowedFiles,
  limits: { fileSize: 1024 * 1024 * 5 },
});
const uploadTenant = multer({
  storage: tenantImageStorage,
  fileFilter: allowedFiles,
  limits: { fileSize: 1024 * 1024 * 5 },
});
const uploadWatermark = multer({
  storage: watermarkStorage,
  fileFilter: allowedFiles,
  limits: { fileSize: 1024 * 1024 * 5 },
});
const uploadBlog = multer({
  storage: blogStorage,
  fileFilter: allowedFiles,
  limits: { fileSize: 1024 * 1024 * 5 },
});
const mainWithImage = (keyName, maxNumOfFiles) => {
  return (req, res, next) => {
    const files = uploadMainWithImage.fields([
      { name: "mainimage", maxCount: 1 },
      { name: "images" },
    ]);
    files(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        res.status(400).send({
          message:
            "Error while uploading media :( Make sure you are uploading a PNG, JPG or JPEG file with less than 3 MBs of space",
        });
      } else if (err) {
        res.status(503).send({
          message: "Server Error while uploading media :(",
        });
      } else next();
    });
  };
};
const tenantUpload = (keyName, maxNumOfFiles) => {
  return (req, res, next) => {
    const files = uploadTenant.fields([
      { name: "IDImage", maxCount: 1 },
      { name: "passportImage" },
      { name: "contractImage" },
    ]);

    files(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).send({
          message:
            "Error while uploading media :( Make sure you are uploading a PNG, JPG or JPEG file with less than 3 MBs of space",
        });
      } else if (err) {
        console.log(err);
        res.status(503).send({
          message: "Server Error while uploading media :(",
        });
      } else next();
    });
  };
};
const multiFiles = (keyName, maxNumOfFiles) => {
  return (req, res, next) => {
    const files = upload.array(`${keyName}`, maxNumOfFiles);

    files(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).send({
          message:
            "Error while uploading media :( Make sure you are uploading a PNG, JPG or JPEG file with less than 3 MBs of space",
        });
      } else if (err) {
        res.status(503).send({
          message: "Server Error while uploading media :(",
        });
      } else next();
    });
  };
};
const watermarkUpload = (keyName) => {
  return (req, res, next) => {
    const folderPath = path.join(__dirname, "../", "uploads", "watermark");
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.join(folderPath, file);
        fs.unlinkSync(filePath);
      });

      fs.rmdirSync(folderPath);
    } else {
      console.error(`Directory not found: ${folderPath}`);
    }

    const files = uploadWatermark.single(`${keyName}`);

    files(req, res, function (err) {
      console.log(err);
      if (err instanceof multer.MulterError) {
        res.status(400).send({
          message:
            "Error while uploading media :( Make sure you are uploading a PNG, JPG or JPEG file with less than 3 MBs of space",
        });
      } else if (err) {
        res.status(503).send({
          message: "Server Error while uploading media :(",
        });
      } else next();
    });
  };
};
const blogImageUpload = (keyName) => {
  return (req, res, next) => {
    const files = uploadBlog.single(`${keyName}`);
    files(req, res, function (err) {
      console.log(err);
      if (err instanceof multer.MulterError) {
        res.status(400).send({
          message:
            "Error while uploading media :( Make sure you are uploading a PNG, JPG or JPEG file with less than 3 MBs of space",
        });
      } else if (err) {
        res.status(503).send({
          message: "Server Error while uploading media :(",
        });
      } else next();
    });
  };
};
module.exports = {
  mainWithImage,
  multiFiles,
  watermarkUpload,
  blogImageUpload,
  tenantUpload,
};
