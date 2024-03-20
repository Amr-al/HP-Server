const Jimp = require("jimp")
const fs = require("fs");
const getDimensions = (H, W, h, w, ratio) => {
    let hh, ww;
    if ((H / W) < (h / w)) {    //GREATER HEIGHT
        hh = ratio * H;
        ww = hh / h * w;
    } else {                //GREATER WIDTH
        ww = ratio * W;
        hh = ww / w * h;
    }
    return [hh, ww];
}
const addQRCode = () => {
    return (req, res, next) => {
        req.files.map(async (file) => {
            const main = await Jimp.read(`${__dirname}/../uploads/properties/` + file.filename);
            const qrcode = await Jimp.read(`${__dirname}/../uploads/qrcode/qr.jpg`);
            const [newHeight, newWidth] = getDimensions(main.getHeight(), main.getWidth(), qrcode.getHeight(), qrcode.getWidth(), .2);
            qrcode.resize(newWidth, newHeight);
            main.quality(70);
            const positionX = (main.getWidth() - newWidth);     //Centre aligned
            const positionY = (main.getHeight() - newHeight);   //Centre aligned

            main.composite(qrcode,
                positionX,
                positionY,
                Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
            main.write(`${__dirname}/../uploads/properties/` + file.filename);

        })
        next()
    }
}

module.exports = {
    addQRCode
}