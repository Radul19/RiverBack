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
exports.download = exports.searchItems = exports.getMarket = exports.getItem = exports.register = exports.login = exports.test = void 0;
//@ts-ignore
const bcrypt_1 = __importDefault(require("bcrypt"));
//@ts-ignore
const jsonwebtoken_1 = require("jsonwebtoken");
const debug_1 = __importDefault(require("../helpers/debug"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const itemSchema_1 = __importDefault(require("../models/itemSchema"));
const commerceSchema_1 = __importDefault(require("../models/commerceSchema"));
const mongoose_1 = require("mongoose");
const ObjectId = (val) => {
    return new mongoose_1.Types.ObjectId(val);
};
const test = (req, res) => {
    if (debug_1.default)
        console.log("#test");
    // console.log(filter.clean("What an asshole"))
    res.send("WORKING");
};
exports.test = test;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log("#login");
    try {
        const { email, password: pass } = req.body;
        console.log(email);
        const user = yield userSchema_1.default.findOne({ email });
        if (!user)
            return res.status(401).json({ msg: "Correo incorrecto" });
        bcrypt_1.default.compare(pass, user.password, function (_, result) {
            if (!result)
                return res.status(401).json({ msg: "Contraseña incorrecta" });
            user.populate("commerce");
            console.log(user.commerce);
            const { name, email, avatar, card_id, commerce, _id } = user;
            let token = (0, jsonwebtoken_1.sign)({ data: user._id, exp: Math.floor(Date.now() / 1000 + 2592000) }, process.env.SECRET);
            return res.send({ name, email, avatar, card_id, commerce, token, _id });
        });
    }
    catch (error) {
        res.status(404).json({ msg: error.message });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log("#register");
    try {
        const { name, email, card_id, password: pass, avatar } = req.body;
        let password = bcrypt_1.default.hashSync(pass, bcrypt_1.default.genSaltSync(10));
        let findEmail = yield userSchema_1.default.findOne({ email });
        let findCardId = yield userSchema_1.default.findOne({ card_id });
        if (findEmail)
            return res.status(409).json({ msg: "El correo ya esta en uso" });
        if (findCardId)
            return res.status(409).json({ msg: "La cedula ya esta en uso" });
        const newUser = yield userSchema_1.default.create({
            name,
            email,
            card_id,
            password,
            avatar,
        });
        let token = (0, jsonwebtoken_1.sign)({ data: newUser._id, exp: Math.floor(Date.now() / 1000 + 2592000) }, process.env.SECRET);
        // console.log(token)
        const { name: n, email: e, avatar: a, card_id: ci, commerce, _id, } = newUser;
        res.send({
            name: n,
            email: e,
            avatar: a,
            card_id: ci,
            commerce,
            token,
            _id,
        });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.register = register;
const getItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log("#getItem");
    const { id } = req.params;
    const result = yield itemSchema_1.default.findOne({ _id: id }).populate("reviews.user commerce", "name avatar logo schedules");
    if (result)
        res.send(result);
    else
        res.status(404).json({ msg: "Elemento no encontrado" });
});
exports.getItem = getItem;
const getMarket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log("#getMarket");
    const { id } = req.params;
    const shop = yield commerceSchema_1.default.findOne({ _id: id });
    const items = yield itemSchema_1.default.find({ owner_id: id }).populate("reviews.user", "name avatar");
    if (shop)
        res.send({ shop, items });
    else
        res.status(404).json({ msg: "Elemento no encontrado" });
});
exports.getMarket = getMarket;
const searchItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log("#searchItems");
    try {
        const { text = false, categories = false, commerce = false } = req.body;
        const markets = categories ? categories.includes("market") : false;
        if (markets) {
            categories.splice(categories.indexOf("market"), 1);
            const result = yield commerceSchema_1.default.find({
                $or: [
                    { name: text ? new RegExp(text, "i") : { $exists: true } },
                    { description: text ? new RegExp(text, "i") : { $exists: true } },
                ],
                categories: categories && categories.length > 0
                    ? { $in: categories }
                    : { $exists: true },
                owner_id: commerce ? commerce : { $exists: true },
            });
            return res.send(result);
        }
        else {
            const items = yield itemSchema_1.default.find({
                $or: [
                    { name: text ? new RegExp(text, "i") : { $exists: true } },
                    { description: text ? new RegExp(text, "i") : { $exists: true } },
                ],
                categories: categories ? { $in: categories } : { $exists: true },
                commerce: commerce ? ObjectId(commerce) : { $exists: true },
            }).populate("reviews.user commerce", "name avatar logo schedules");
            return res.send(items);
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
});
exports.searchItems = searchItems;
const download = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = `${__dirname}/riverV0.1.1.apk`;
    res.download(file); // Set disposition and send it.
});
exports.download = download;
//# sourceMappingURL=guest.js.map