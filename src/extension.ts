import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface Chunk {
    id: string
    file_path: string
    start_line: number
}

interface GraphNode {
    title: string;
    keywords: string[];
    summary: string;
    chunks: Chunk[];
    children: GraphNode[];
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension is now active!');

    let disposable = vscode.commands.registerCommand('myextension.openHtmlTab', () => {
        const panel = vscode.window.createWebviewPanel(
            'htmlView',
            'HTML View',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );

        updateWebview(panel, context.extensionUri);
    });

    context.subscriptions.push(disposable);
}

function updateWebview(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    const jsonPath = path.join(extensionUri.fsPath, 'data.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as GraphNode[];
    
    const content = generateHtmlContent(jsonData);

    panel.webview.html = getWebviewContent(content);

    panel.webview.onDidReceiveMessage(async (data) => {
        if (data.type === 'openLink') {
            openLink(data.filePath, data.lineNumber);
        }
    });
}

function generateHtmlContent(nodes: GraphNode[]): string {
    return nodes.map(node => generateNodeHtml(node)).join('');
}

function generateNodeHtml(node: GraphNode, level: number = 0): string {
    console.log(node)
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

function escapeHtml(unsafe: string): string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function getWebviewContent(content: string) {
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

async function openLink(filePath: string, lineNumber: number) {
    const openPath = vscode.Uri.file(filePath);
    console.log("Opening filepath: ", filePath);
    
    try {
        const document = await vscode.workspace.openTextDocument(openPath);
        const editor = await vscode.window.showTextDocument(document);

        const range = editor.document.lineAt(lineNumber).range;
        editor.selection = new vscode.Selection(range.start, range.end);
        editor.revealRange(range);

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to open file: ${filePath}`);
    }
}