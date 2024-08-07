import * as vscode from 'vscode';
import * as path from 'path';

// export function getCurrentEditorFolderPath(): string | undefined {
//     const activeEditor = vscode.window.activeTextEditor;
//     if (activeEditor) {
//         const currentFilePath = activeEditor.document.uri.fsPath;
//         return path.dirname(currentFilePath);
//     }
//     return undefined;
// }

export function getCurrentEditorFolderPath(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  
  if (workspaceFolders && workspaceFolders.length > 0) {
      // Return the path of the first (or only) workspace folder
      return path.basename(workspaceFolders[0].uri.fsPath);
  }
  
  return undefined;
}
