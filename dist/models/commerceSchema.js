"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const objId = mongoose_1.SchemaTypes.ObjectId;
const CommerceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    owner_id: { type: String, required: true },
    logo: { type: String, required: true },
    logo_id: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    rif: { type: String },
    delivery: { type: Boolean, required: true },
    reviews: [{
            type: new mongoose_1.Schema({
                user: { type: objId, ref: 'User', required: true },
                text: { type: String, required: true },
                stars: { type: Number, required: true },
            }, { timestamps: true })
        }],
    socials: {
        telegram: { type: String },
        whatsapp: { type: String },
        messenger: { type: String },
        instagram: { type: String },
    },
    schedules: { type: Array, default: [] },
    categories: { type: Array, default: [] },
    favorites: { type: Array, default: [] }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Commerce', CommerceSchema);
// module.exports = model('Item', ItemSchema)
//# sourceMappingURL=commerceSchema.js.map