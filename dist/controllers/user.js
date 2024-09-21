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
exports.marketFavorite = exports.itemFavorite = exports.updateReview = exports.orderHistory = exports.validateToken = exports.createCode = exports.existCode = exports.editUserData = exports.searchFavorites = void 0;
//@ts-ignore
const jsonwebtoken_1 = require("jsonwebtoken");
//@ts-ignore
const connector_1 = require("@binance/connector");
//@ts-ignore
const bad_words_es_1 = __importDefault(require("bad-words-es"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const commerceSchema_1 = __importDefault(require("../models/commerceSchema"));
const itemSchema_1 = __importDefault(require("../models/itemSchema"));
const codeSchema_1 = __importDefault(require("../models/codeSchema"));
const debug_1 = __importDefault(require("../helpers/debug"));
const filter = new bad_words_es_1.default();
const searchFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#searchFavorites');
    try {
        const { text = false, user_id } = req.body;
        const project = { favorites: 0 };
        let result = {
            items: yield itemSchema_1.default.find({ $or: [{ name: text ? new RegExp(text, "i") : { $exists: true } }, { description: text ? new RegExp(text, "i") : { $exists: true }, }], favorites: { $in: user_id } }, project),
            markets: yield commerceSchema_1.default.find({ $or: [{ name: text ? new RegExp(text, "i") : { $exists: true } }, { description: text ? new RegExp(text, "i") : { $exists: true }, }], favorites: { $in: user_id } }, project)
        };
        res.send(result);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.searchFavorites = searchFavorites;
const editUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#editUserData');
    try {
        const { user_id, email, name, avatar, password = false } = req.body;
        const user = yield userSchema_1.default.updateOne({ _id: user_id }, { $set: { name, email, avatar } });
        if (user.matchedCount > 0)
            res.send(true);
        else
            res.send(false);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.editUserData = editUserData;
const existCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#existCode');
    const { code } = req.body;
    const result = yield codeSchema_1.default.findOne({ code, enable: true });
    if (result)
        res.send(true);
    else
        res.status(400).json({ msg: 'Codigo incorrecto' });
});
exports.existCode = existCode;
const createCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#createCode');
    try {
        let code = Math.floor(Math.random() * (999999 - 100000) + 100000);
        let result = yield codeSchema_1.default.create({ code });
        res.send(result);
    }
    catch (error) {
        res.status(400).json(error.message);
    }
});
exports.createCode = createCode;
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#validateToken');
    const { token } = req.body;
    try {
        (0, jsonwebtoken_1.verify)(token, process.env.SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (err)
                    return res.status(400).json({ msg: 'Token expirado' });
                else {
                    const findUser = yield userSchema_1.default.findOne({ _id: decoded.data }, { password: 0 }).populate('commerce');
                    if (findUser)
                        return res.send(findUser);
                    else
                        return res.status(404).json({ msg: 'Usuario no encontrado' });
                }
            }
            catch (error) {
                res.status(400).json(error.message);
            }
        }));
    }
    catch (error) {
        res.status(400).json(error.message);
    }
});
exports.validateToken = validateToken;
const orderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#orderHistory');
    try {
        const { owner_id, payment_id } = req.body;
        const apiKey = process.env.BINANCE_API_KEY || '';
        const apiSecret = process.env.BINANCE_API_SECRET || '';
        const client = new connector_1.Spot(apiKey, apiSecret);
        yield client.payHistory({
            startTime: 1706334673000,
            endTime: 1711518673000,
        }).then((response) => {
            response.data.data.forEach((payment) => {
                if (payment.currency === "USDT" && payment.orderId === payment_id && payment.amount === '20') {
                    return res.send(payment);
                }
            });
            res.send('not ok');
        }).catch((error) => res.send(error.response.data));
        // paymentHistory.forEach(payment => {
        //     if(payment.currency === "USDT" && payment.orderId === payment_id && payment.amount === '20'){
        //         return res.send(payment)
        //     }
        // });
        // res.send('not ok')
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.orderHistory = orderHistory;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug_1.default)
        console.log('#updateReview');
    try {
        const { user_id, text, stars, isEdit, item_id, market_id } = req.body;
        if (market_id) {
            if (!isEdit) {
                const result = yield commerceSchema_1.default.findOneAndUpdate({ _id: item_id }, {
                    $push: { reviews: { user: user_id, text, stars } }
                }, { new: true }).populate('reviews.user', 'name avatar');
                res.send(result);
            }
            else {
                const result = yield commerceSchema_1.default.findOneAndUpdate({ _id: item_id, 'reviews.user': user_id }, {
                    $set: { 'reviews.$.text': text, 'reviews.$.stars': stars }
                }, { new: true }).populate('reviews.user', 'name avatar');
                res.send(result);
            }
        }
        else {
            if (!isEdit) {
                const result = yield itemSchema_1.default.findOneAndUpdate({ _id: item_id }, {
                    $push: { reviews: { user: user_id, text, stars } }
                }, { new: true }).populate('reviews.user', 'name avatar');
                res.send(result);
            }
            else {
                const result = yield itemSchema_1.default.findOneAndUpdate({ _id: item_id, 'reviews.user': user_id }, {
                    $set: { 'reviews.$.text': text, 'reviews.$.stars': stars }
                }, { new: true }).populate('reviews.user', 'name avatar');
                res.send(result);
            }
        }
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.updateReview = updateReview;
const itemFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (true)
        console.log('#itemFavorite');
    try {
        const { user_id, item_id, state } = req.body;
        // console.log(req.body);
        if (!state) {
            yield itemSchema_1.default.findOneAndUpdate({ _id: item_id }, { $pull: { favorites: user_id } });
        }
        else {
            yield itemSchema_1.default.findOneAndUpdate({ _id: item_id }, { $push: { favorites: user_id } });
        }
        res.send({ ok: true });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.itemFavorite = itemFavorite;
const marketFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (true)
        console.log('#marketFavorite');
    try {
        const { user_id, market_id, state } = req.body;
        // console.log(req.body);
        if (!state) {
            yield commerceSchema_1.default.findOneAndUpdate({ _id: market_id }, { $pull: { favorites: user_id } });
        }
        else {
            yield commerceSchema_1.default.findOneAndUpdate({ _id: market_id }, { $push: { favorites: user_id } });
        }
        res.send({ ok: true });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.marketFavorite = marketFavorite;
// export const marketFavorite: ReqRes = async (req, res) => {
//     if (debugg) console.log('#marketFavorite')
//     try {
//         const { user_id, market_id, state } = req.body
//         if (state) {
//             await Commerce.findOneAndUpdate({ _id: market_id }, { $pull: { favorites: user_id } })
//         } else {
//             await Commerce.findOneAndUpdate({ _id: market_id }, { $push: { favorites: user_id } })
//         }
//         res.send({ ok: true })
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
// }
// export const namehere : ReqRes = async (req,res)=>{
//     if(debugg) console.log('#namehere')
//     res.send('ok')
// }
//# sourceMappingURL=user.js.map