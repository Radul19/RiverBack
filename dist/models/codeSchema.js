"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CodeSchema = new mongoose_1.Schema({
    code: { type: String, required: true },
    enable: { type: Boolean, required: true, default: true },
    user_id: { type: String, required: true, default: '_' },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Code', CodeSchema);
//# sourceMappingURL=codeSchema.js.map