"use strict";
// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";
// dotenv.config();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImages = exports.deleteImage = exports.uploadImages = exports.uploadImage = void 0;
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   secure: true,
// });
// type Image = {
//   secure_url: string,
//   public_id: string
// }
// /** TODO, CHECK IMAGE HANDLER, IF IT IS OBJECT OR STRING FROM 'type Image' */
// type UpImage = (base64: string) => Promise<Image>
// type UpImages = (arrImages: Image[]) => Promise<Image[]>
// export const uploadImage: UpImage = async (base64: string) => {
//   const { secure_url, public_id } = await cloudinary.uploader.upload(base64, {})
//   return { secure_url, public_id }
// }
// export const uploadImages: UpImages = async (arrImages) => {
//   const sendImg: UpImage = (base64) => {
//     return new Promise(async (res, rej) => {
//       res(await uploadImage(base64))
//     })
//   }
//   let images = await Promise.all(arrImages.map(img => sendImg(img.secure_url)))
//   return images
// }
// export const deleteImage = async (public_id: string) => {
//   await cloudinary.uploader.destroy(public_id)
//   // .then(() => true).catch(() => false)
// }
// export const deleteImages = async (arrImages: Image[]) => {
//   const sendImg = (public_id: string) => {
//     return new Promise(async (res, rej) => {
//       res(await deleteImage(public_id))
//     })
//   }
//   await Promise.all(arrImages.map(img => sendImg(img.public_id)))
//   return true
// }
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});
const regx = /data:image/;
// const regx = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const uploadImage = (img) => __awaiter(void 0, void 0, void 0, function* () {
    const isBase64 = regx.test(img.secure_url);
    // if the secure_url is a base64, upload it, if it is a cloudinary url, just return normal values
    if (isBase64) {
        const { secure_url, public_id } = yield cloudinary_1.v2.uploader.upload(img.secure_url, {});
        if (img.public_id && img.public_id.length > 0)
            yield (0, exports.deleteImage)(img.public_id);
        return { secure_url, public_id };
    }
    else
        return img;
});
exports.uploadImage = uploadImage;
const uploadImages = (arrImages) => __awaiter(void 0, void 0, void 0, function* () {
    const sendImg = (img) => {
        return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
            res(yield (0, exports.uploadImage)(img));
        }));
    };
    let images = yield Promise.all(arrImages.map((img) => sendImg(img)));
    return images;
});
exports.uploadImages = uploadImages;
const deleteImage = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield cloudinary_1.v2.uploader.destroy(public_id);
    // .then(() => true).catch(() => false)
});
exports.deleteImage = deleteImage;
const deleteImages = (arrImages) => __awaiter(void 0, void 0, void 0, function* () {
    const sendImg = (public_id) => {
        return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
            res(yield (0, exports.deleteImage)(public_id));
        }));
    };
    yield Promise.all(arrImages.map((img) => sendImg(img.public_id)));
    return true;
});
exports.deleteImages = deleteImages;
//# sourceMappingURL=uploadImages.js.map