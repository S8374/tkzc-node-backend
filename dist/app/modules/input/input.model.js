"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormFieldModel = void 0;
const mongoose_1 = require("mongoose");
const formFieldSchema = new mongoose_1.Schema({
    label: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    tab: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["text", "number", "textarea", "screenshot"],
        required: true,
    },
    placeholder: String,
    required: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
    paymentMethodId: {
        type: mongoose_1.Types.ObjectId,
        ref: "PaymentMethod",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isBonusField: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });
exports.FormFieldModel = (0, mongoose_1.model)("FormField", formFieldSchema);
