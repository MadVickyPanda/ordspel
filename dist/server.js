"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expressApp_1 = __importDefault(require("./expressApp"));
const PORT = 5080;
// ======================
// START SERVER
// ======================
// Viktigt: exporteras indirekt via app så tests kan importera den utan att starta servern
if (require.main === module) {
    expressApp_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}
exports.default = expressApp_1.default;
