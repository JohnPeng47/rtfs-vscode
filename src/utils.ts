import * as vscode from 'vscode';
import * as path from 'path';

export function getCurrentEditorFolderPath(): string | undefined {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const currentFilePath = activeEditor.document.uri.fsPath;
        return path.dirname(currentFilePath);
    }
    return undefined;
}
