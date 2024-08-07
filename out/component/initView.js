"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitView = void 0;
const htmlView_1 = require("./htmlView");
class InitView extends htmlView_1.HTMLView {
    constructor(extensionPath) {
        super();
    }
    getWebviewContent() { return ""; }
    ;
    registerViewFuncs() { }
    ;
}
exports.InitView = InitView;
//# sourceMappingURL=initView.js.map