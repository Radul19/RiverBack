"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const objId = mongoose_1.SchemaTypes.ObjectId;
const ItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    commerce: { type: objId, ref: 'Commerce', required: true },
    categories: { type: Array, required: true },
    // units: { type: String, required: true },
    favorites: { type: Array, default: [] },
    reviews: [{
            type: new mongoose_1.Schema({
                user: { type: objId, ref: 'User', required: true },
                text: { type: String, required: true },
                stars: { type: Number, required: true },
            }, { timestamps: true })
        }],
    images: [{
            secure_url: String,
            public_id: String,
        }],
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Item', ItemSchema);
// module.exports = model('Item', ItemSchema)
//# sourceMappingURL=itemSchema.js.map