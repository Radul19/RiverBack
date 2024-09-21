"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user = __importStar(require("../controllers/user"));
// router.get('/', test)
router.get('/createCode', user.createCode);
router.post('/orderHistory', user.orderHistory);
router.post('/editUserData', user.editUserData);
router.post('/existCode', user.existCode);
router.post('/searchFavorites', user.searchFavorites);
router.post('/updateReview', user.updateReview);
router.post('/validateToken', user.validateToken);
router.post('/itemFavorite', user.itemFavorite);
router.post('/marketFavorite', user.marketFavorite);
exports.default = router;
// module.exports = router
// XRH7J5O2OZJ6T1EGNTONG8PG30PIXJJA
//# sourceMappingURL=user.routes.js.map