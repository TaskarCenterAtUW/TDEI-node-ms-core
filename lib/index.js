"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TDEICore = void 0;
const core_1 = require("./core");
class TDEICore {
    static getLogger() {
        if (this.logger != undefined)
            return this.logger;
        else
            throw new Error("Configuration not initialized");
    }
    static initialize(config) {
        switch (config.provider) {
            case 'Azure':
                this.logger = new core_1.Logger(config);
                break;
            default:
                break;
        }
    }
}
exports.TDEICore = TDEICore;
