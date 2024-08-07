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
exports.SummaryView = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const htmlView_1 = require("./htmlView");
class SummaryView extends htmlView_1.HTMLView {
    constructor(extensionPath) {
        super();
        const jsonPath = path.join(extensionPath, 'data.json');
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        this.nodes = jsonData;
    }
    ;
    nodes;
    getWebviewContent() {
        const content = this.mapSummaryNodes();
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HTML View</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                button { cursor: pointer; padding: 5px 10px; }
                .children { margin-left: 20px; }
            </style>
        </head>
        <body>
            <div id="content">${content}</div>
            <script>
                const vscode = acquireVsCodeApi();
                function openLink(filePath, lineNumber) {
                    vscode.postMessage({ type: 'openLink', filePath: filePath, lineNumber: lineNumber });
                }
            </script>
        </body>
        </html>
    `;
    }
    registerViewFuncs(data) {
        if (data.type === 'openLink') {
            this.openLink(data.filePath, data.lineNumber);
        }
    }
    mapSummaryNodes() {
        return this.nodes.map(node => this.generateNodeHtml(node)).join('');
    }
    generateNodeHtml(node, level = 0) {
        const indent = '  '.repeat(level);
        let html = `
${indent}<details>
${indent}  <summary>${this.escapeHtml(node.title)}</summary>
${indent}  <p><strong>Keywords:</strong> ${this.escapeHtml(node.keywords.join(', '))}</p>
${indent}  <p><strong>Summary:</strong> ${this.escapeHtml(node.summary)}</p>
${indent}  <ul>
${node.chunks.map(chunk => `${indent}    <li><button onclick="openLink('${chunk.file_path}', ${chunk.start_line})">Open ${this.escapeHtml(chunk.id)}</button></li>`).join('\n')}
${indent}  </ul>
`;
        if (node.children.length > 0) {
            html += `${indent}  <div class="children">
${node.children.map(child => this.generateNodeHtml(child, level + 2)).join('\n')}
${indent}  </div>
`;
        }
        html += `${indent}</details>`;
        return html;
    }
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    async openLink(filePath, lineNumber) {
        const openPath = vscode.Uri.file(filePath);
        console.log("Opening filepath: ", filePath);
        try {
            const document = await vscode.workspace.openTextDocument(openPath);
            const editor = await vscode.window.showTextDocument(document);
            const range = editor.document.lineAt(lineNumber).range;
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to open file: ${filePath}`);
        }
    }
}
exports.SummaryView = SummaryView;
//# sourceMappingURL=summary.js.map