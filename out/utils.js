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
exports.getCurrentEditorFolderPath = getCurrentEditorFolderPath;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
// export function getCurrentEditorFolderPath(): string | undefined {
//     const activeEditor = vscode.window.activeTextEditor;
//     if (activeEditor) {
//         const currentFilePath = activeEditor.document.uri.fsPath;
//         return path.dirname(currentFilePath);
//     }
//     return undefined;
// }
function getCurrentEditorFolderPath() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        // Return the path of the first (or only) workspace folder
        return path.basename(workspaceFolders[0].uri.fsPath);
    }
    return undefined;
}
//# sourceMappingURL=utils.js.map