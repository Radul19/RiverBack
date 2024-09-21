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
Object.defineProperty(exports, "__esModule", { value: true });
// const { Schema, model } = require('mongoose')
const mongoose_1 = require("mongoose");
const objId = mongoose_1.SchemaTypes.ObjectId;
// const defaultProfile = 'https://res.cloudinary.com/deliveryplanet/image/upload/v1674949797/user_twylfd.png'
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: Number, required: true },
    card_id: { type: String, required: true },
    commerce: { type: objId, ref: 'Commerce', default: null },
    password: { type: String, required: true },
}, {
    timestamps: true,
});
UserSchema.methods.changeName = function () {
    // console.log(`Testing name here ${this.name}`)
    return this.name = 'Testing here';
};
UserSchema.methods.presignedProfile = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this;
    });
};
exports.default = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=userSchema.js.map