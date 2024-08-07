import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import {HTMLView} from './htmlView';

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


export class SummaryView extends HTMLView {
  public constructor(nodes: GraphNode[]) {
      super();

      this.nodes = nodes;
  };
  private nodes: GraphNode[];

  public getWebviewContent() {
    const content = this.mapSummaryNodes()
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

  public registerViewFuncs(data: any): void {
    if (data.type === 'openLink') {
      this.openLink(data.filePath, data.lineNumber);
    }
  }

  private mapSummaryNodes(): string {
      return this.nodes.map(node => this.generateNodeHtml(node)).join('');
  }

  private generateNodeHtml(node: GraphNode, level: number = 0): string {
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

  private escapeHtml(unsafe: string): string {
      return unsafe
           .replace(/&/g, "&amp;")
           .replace(/</g, "&lt;")
           .replace(/>/g, "&gt;")
           .replace(/"/g, "&quot;")
           .replace(/'/g, "&#039;");
  }

  private async openLink(filePath: string, lineNumber: number) {
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
}