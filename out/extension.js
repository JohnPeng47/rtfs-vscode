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
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const summary_1 = require("./component/summary");
class ExtensionComponent {
    context;
    constructor(context) {
        this.context = context;
    }
}
class RTFSViewManager extends ExtensionComponent {
    register_component() {
        let disposable = vscode.commands.registerCommand('myextension.openHtmlTab', () => {
            const panel = vscode.window.createWebviewPanel('htmlView', 'HTML View', vscode.ViewColumn.Beside, {
                enableScripts: true
            });
            this.updateWebview(panel);
        });
        this.context.subscriptions.push(disposable);
    }
    getView() {
        const initialized = false;
        const p = path.join(this.context.extensionPath, 'app.json');
        const appConfig = JSON.parse(fs.readFileSync(p, 'utf8'));
        // if (!appConfig.initialized) {
        //     return WelcomeView
        // }
        return new summary_1.SummaryView(this.context.extensionPath);
    }
    updateWebview(panel) {
        const view = this.getView();
        console.log("Getting view: ", view);
        panel.webview.html = view.getWebviewContent();
        panel.webview.onDidReceiveMessage((data) => {
            console.log("Data: ", data);
            view.registerViewFuncs(data);
        });
    }
}
function activate(context) {
    console.log('Extension is now active!');
    const manager = new RTFSViewManager(context);
    manager.register_component();
}
//# sourceMappingURL=extension.js.map