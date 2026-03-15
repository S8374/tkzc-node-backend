"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositType = exports.DepositStatus = void 0;
var DepositStatus;
(function (DepositStatus) {
    DepositStatus["PENDING"] = "PENDING";
    DepositStatus["APPROVED"] = "APPROVED";
    DepositStatus["REJECTED"] = "REJECTED";
    DepositStatus["CANCELLED"] = "CANCELLED";
})(DepositStatus || (exports.DepositStatus = DepositStatus = {}));
var DepositType;
(function (DepositType) {
    DepositType["MANUAL"] = "manual";
    DepositType["AUTO"] = "auto";
    DepositType["CRYPTO"] = "crypto";
})(DepositType || (exports.DepositType = DepositType = {}));
