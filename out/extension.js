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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    console.log('Extension is now active!');
    let disposable = vscode.commands.registerCommand('myextension.openHtmlTab', () => {
        const panel = vscode.window.createWebviewPanel('htmlView', 'HTML View', vscode.ViewColumn.Beside, {
            enableScripts: true
        });
        updateWebview(panel, context.extensionUri);
    });
    context.subscriptions.push(disposable);
}
function updateWebview(panel, extensionUri) {
    const jsonPath = path.join(extensionUri.fsPath, 'data.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const content = generateHtmlContent(jsonData);
    panel.webview.html = getWebviewContent(content);
    panel.webview.onDidReceiveMessage(async (data) => {
        if (data.type === 'openLink') {
            openLink(data.filePath, data.lineNumber);
        }
    });
}
function generateHtmlContent(nodes) {
    return nodes.map(node => generateNodeHtml(node)).join('');
}
function generateNodeHtml(node, level = 0) {
    console.log(node);
    const indent = '  '.repeat(level);
    let html = `
${indent}<details>
${indent}  <summary>${escapeHtml(node.title)}</summary>
${indent}  <p><strong>Keywords:</strong> ${escapeHtml(node.keywords.join(', '))}</p>
${indent}  <p><strong>Summary:</strong> ${escapeHtml(node.summary)}</p>
${indent}  <ul>
${node.chunks.map(chunk => `${indent}    <li><button onclick="openLink('${chunk.file_path}', ${chunk.start_line})">Open ${escapeHtml(chunk.id)}</button></li>`).join('\n')}
${indent}  </ul>
`;
    if (node.children.length > 0) {
        html += `${indent}  <div class="children">
${node.children.map(child => generateNodeHtml(child, level + 2)).join('\n')}
${indent}  </div>
`;
    }
    html += `${indent}</details>`;
    return html;
}
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function getWebviewContent(content) {
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
async function openLink(filePath, lineNumber) {
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
//# sourceMappingURL=extension.js.map