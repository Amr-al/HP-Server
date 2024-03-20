const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');

const getDimensions = (H, W, h, w, ratio) => {
  let hh, ww;
  if (H / W < h / w) {
    //GREATER HEIGHT
    hh = ratio * H;
    ww = (hh / h) * w;
  } else {
    //GREATER WIDTH
    ww = ratio * W;
    hh = (ww / w) * h;
  }
  return [hh, ww];
};
const addWatermark = () => {
  return async (req, res, next) => {
    const watermark = await Jimp.read(
      `${__dirname}/../uploads/watermark/logo_200_85.png`
    );

    req.files["images"] = await Promise.all(
      req.files["images"].map(async (file) => {
        const main = await Jimp.read(file.path);
        const copy = main.clone();
        const resizedImage = await copy.quality(5).resize(10, 10);
        const blurDataURL = await resizedImage.getBase64Async(Jimp.MIME_JPEG);
        const [newHeight, newWidth] = getDimensions(
          main.getHeight(),
          main.getWidth(),
          watermark.getHeight(),
          watermark.getWidth(),
          0.2
        );

        watermark.resize(newWidth, newHeight);
        const positionX = (main.getWidth() - newWidth) / 2; //Centre aligned
        const positionY = (main.getHeight() - newHeight) / 2; //Centre aligned

        main.composite(
          watermark,
          positionX,
          positionY,
          Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
        );

        main
          .quality(50)
          .write(`${__dirname}/../uploads/properties/` + file.filename);
        file.placeholder = blurDataURL;
        return file;
      })
    );

    const main = await Jimp.read(req.files["mainimage"][0].path);
    const copy = main.clone();
    const resizedImage = await copy.quality(5).resize(10, 10);
    const blurDataURL = await resizedImage.getBase64Async(Jimp.MIME_JPEG);
    const [newHeight, newWidth] = getDimensions(
      main.getHeight(),
      main.getWidth(),
      watermark.getHeight(),
      watermark.getWidth(),
      0.2
    );
    watermark.resize(newWidth, newHeight);
    const positionX = (main.getWidth() - newWidth) / 2; // Centre aligned
    const positionY = (main.getHeight() - newHeight) / 2; // Centre aligned

    main.composite(
      watermark,
      positionX,
      positionY,
      Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
    );

    main
      .quality(50)
      .write(
        `${__dirname}/../uploads/properties/` +
        req.files["mainimage"][0].filename
      );
    req.files["mainimage"][0].placeholder = blurDataURL;

    next();
  };
};
const addWatermarkMain = () => {
  return async (req, res, next) => {
    const watermark = await Jimp.read(
      `${__dirname}/../uploads/watermark/logo_200_85.png`
    );

    const main = await Jimp.read(req.files["mainimage"][0].path);
    const copy = main.clone();
    const resizedImage = await copy.quality(5).resize(10, 10);
    const blurDataURL = await resizedImage.getBase64Async(Jimp.MIME_JPEG);
    const [newHeight, newWidth] = getDimensions(
      main.getHeight(),
      main.getWidth(),
      watermark.getHeight(),
      watermark.getWidth(),
      0.2
    );
    watermark.resize(newWidth, newHeight);
    const positionX = (main.getWidth() - newWidth) / 2; // Centre aligned
    const positionY = (main.getHeight() - newHeight) / 2; // Centre aligned

    main.composite(
      watermark,
      positionX,
      positionY,
      Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
    );

    main
      .quality(50)
      .write(
        `${__dirname}/../uploads/properties/` +
        req.files["mainimage"][0].filename
      );
    req.files["mainimage"][0].placeholder = blurDataURL;

    next();
  };
};
const addWatermarkNoMain = () => {
  return async (req, res, next) => {
    const watermark = await Jimp.read(
      `${__dirname}/../uploads/watermark/logo_200_85.png`
    );

    req.files = await Promise.all(
      req.files.map(async (file) => {
        const main = await Jimp.read(file.path);
        const copy = main.clone();
        const resizedImage = await copy.quality(5).resize(10, 10);
        const blurDataURL = await resizedImage.getBase64Async(Jimp.MIME_JPEG);

        const [newHeight, newWidth] = getDimensions(
          main.getHeight(),
          main.getWidth(),
          watermark.getHeight(),
          watermark.getWidth(),
          0.2
        );

        watermark.resize(newWidth, newHeight);
        const positionX = (main.getWidth() - newWidth) / 2; //Centre aligned
        const positionY = (main.getHeight() - newHeight) / 2; //Centre aligned
        main.composite(
          watermark,
          positionX,
          positionY,
          Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
        );
        main
          .quality(50)
          .write(`${__dirname}/../uploads/properties/` + file.filename);

        file.placeholder = blurDataURL;
        return file;
      })
    );
    next();
  };
};
const changeWatermarks = () => {
  return (req, res, next) => {
    const folderPath = path.join(
      __dirname,
      "../",
      "uploads",
      "properties",
      "original"
    );
    fs.readdirSync(folderPath)?.map(async (file) => {
      try {
        const watermark = await Jimp.read(
          `${__dirname}/../uploads/watermark/logo_200_85.png`
        );
        const main = await Jimp.read(folderPath + "\\" + file);
        // console.log(main);
        const [newHeight, newWidth] = getDimensions(
          main.getHeight(),
          main.getWidth(),
          watermark.getHeight(),
          watermark.getWidth(),
          0.2
        );

        watermark.resize(newWidth, newHeight);
        const positionX = (main.getWidth() - newWidth) / 2; //Centre aligned
        const positionY = (main.getHeight() - newHeight) / 2; //Centre aligned
        main.composite(
          watermark,
          positionX,
          positionY,
          Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
        );
        main
          .quality(50)
          .write(`${__dirname}/../uploads/properties/` + file);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("Done");
      }
    });
    next();
  };
};
module.exports = {
  addWatermark,
  changeWatermarks,
  addWatermarkNoMain,
  addWatermarkMain,
};

/*
    const folderPath = path.join(
      __dirname,
      "../",
      "uploads",
      "properties",
      "original"
    );
    fs.readdirSync(folderPath)?.map(async (file) => {
      const main = await Jimp.read(folderPath + "/" + file);
      const watermark = await Jimp.read(`uploads\\watermark\\logo_200_85.png`);
      const [newHeight, newWidth] = getDimensions(
        main.getHeight(),
        main.getWidth(),
        watermark.getHeight(),
        watermark.getWidth(),
        0.2
      );
      watermark.resize(newWidth, newHeight);
      const positionX = (main.getWidth() - newWidth) / 2; //Centre aligned
      const positionY = (main.getHeight() - newHeight) / 2; //Centre aligned
      main.composite(
        watermark,
        positionX,
        positionY,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      );

      main.quality(100).write(`uploads\\properties\\` + file);
    });
    next();
    */