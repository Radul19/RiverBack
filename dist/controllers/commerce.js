"use strict";
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
exports.deleteItem = exports.updateItem = exports.createItem = exports.editMarketData = exports.registerCommerce = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const itemSchema_1 = __importDefault(require("../models/itemSchema"));
const commerceSchema_1 = __importDefault(require("../models/commerceSchema"));
const debug_1 = __importDefault(require("../helpers/debug"));
const uploadImages_1 = require("../helpers/uploadImages");
const codeSchema_1 = __importDefault(require("../models/codeSchema"));
const registerCommerce = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#registerCommerce');
    let aux = [];
    try {
        const { name, owner_id, logo, description, email, categories, address, delivery, rif, socials, phone, code } = req.body;
        const { secure_url, public_id } = yield (0, uploadImages_1.uploadImage)({ secure_url: logo, public_id: '' });
        aux.push({ public_id, secure_url: '_' });
        const newCommerce = yield commerceSchema_1.default.create({
            name, owner_id, description, email, address, delivery, rif, socials, phone,
            logo: secure_url, logo_id: public_id, categories
        });
        yield userSchema_1.default.findOneAndUpdate({ _id: owner_id }, { $set: { commerce: newCommerce._id } });
        yield codeSchema_1.default.findOneAndUpdate({ code, enable: true }, { $set: { enable: false, user_id: owner_id } });
        res.send(newCommerce);
    }
    catch (error) {
        if (aux.length > 0)
            yield (0, uploadImages_1.deleteImages)(aux);
        res.status(400).json({ msg: error.message });
    }
});
exports.registerCommerce = registerCommerce;
const editMarketData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#editMarketData');
    try {
        const { market_id, name, phone, description, email, address, categories, rif, socials, delivery, logo, logo_id, schedules } = req.body;
        let { secure_url, public_id } = yield (0, uploadImages_1.uploadImage)({ secure_url: logo, public_id: logo_id });
        const market = yield commerceSchema_1.default.findOneAndUpdate({ _id: market_id }, { $set: { name, email, phone, description, address, rif, socials, delivery, schedules, logo: secure_url, logo_id: public_id, categories } }, { new: true });
        if (market)
            res.send(market);
        else
            res.status(400).json({ msg: "Comercio no encontrado" });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.editMarketData = editMarketData;
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#createItem');
    let aux = [];
    try {
        const { name, description, commerce, images, categories, price } = req.body;
        const imagesInfo = yield (0, uploadImages_1.uploadImages)(images);
        let arrImg = [];
        imagesInfo.forEach((img) => {
            arrImg.push({
                secure_url: img.secure_url,
                public_id: img.public_id,
            });
            aux.push({ public_id: img.public_id, secure_url: '_' });
        });
        const newItem = yield itemSchema_1.default.create({
            name, description, commerce, categories, images: arrImg, price,
        });
        res.send(newItem);
    }
    catch (error) {
        if (aux.length > 0)
            yield (0, uploadImages_1.deleteImages)(aux);
        res.status(400).json({ msg: error.message });
    }
});
exports.createItem = createItem;
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#updateItem');
    try {
        const { name, price, description, images, _id, owner_id } = req.body;
        // console.log(images);
        const imgs = yield (0, uploadImages_1.uploadImages)(images);
        const result1 = yield itemSchema_1.default.findOneAndUpdate({ _id }, {
            $set: { name, price, description, images: imgs }
        });
        if (result1) {
            const result2 = yield itemSchema_1.default.find({ owner_id });
            res.send(result2);
        }
        else {
            res.status(400).json({ msg: 'No se ha podido actualizar el articulo' });
        }
        // res.send({ok:true})
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.updateItem = updateItem;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#deleteItem');
    try {
        const { item_list } = req.body;
        const items = yield itemSchema_1.default.find({ _id: { $in: item_list } });
        let auxImgs = [];
        if (items) {
            items.forEach(itm => {
                itm.images.forEach(itmigs => {
                    auxImgs.push(itmigs);
                });
            });
        }
        yield (0, uploadImages_1.deleteImages)(auxImgs);
        yield itemSchema_1.default.deleteMany({ _id: { $in: item_list } });
        res.send({ ok: true });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.deleteItem = deleteItem;
/**
 * // let market
        // if (logo) {
        //     let { secure_url, public_id } = await uploadImage({secure_url:logo,public_id:logo_id})
        //     // await deleteImage(logo_id)
        //     market = await Commerce.updateOne({ _id: market_id }, { $set: { name, email, phone, description, address, rif, socials, logo: secure_url, logo_id: public_id, schedules } })
        // } else {
        //     market = await Commerce.updateOne({ _id: market_id }, { $set: { name, email, phone, description, address, rif, socials, schedules } })
        // }
 */ 
//# sourceMappingURL=commerce.js.map