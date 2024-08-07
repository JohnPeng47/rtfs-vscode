import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { HTMLView } from './component/htmlView';
import { SummaryView } from './component/summary';
import { getCurrentEditorFolderPath } from './utils';

interface AppConfig {
    initialized: boolean
}

abstract class ExtensionComponent {
    constructor(protected context: vscode.ExtensionContext) {}

    abstract register_component(): void;
}

class RTFSViewManager extends ExtensionComponent {
    register_component(): void {
        let disposable = vscode.commands.registerCommand('myextension.openHtmlTab', () => {
            const panel = vscode.window.createWebviewPanel(
                'htmlView',
                'HTML View',
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true
                }
            );

            this.updateWebview(panel);
        });

        this.context.subscriptions.push(disposable);
    }

    private getView(): HTMLView{
        const initialized = false;

        const p = path.join(this.context.extensionPath, 'app.json');
        const appConfig = JSON.parse(fs.readFileSync(p, 'utf8')) as AppConfig;
        
        // if (!appConfig.initialized) {
        //     return WelcomeView
        // }

        return new SummaryView(this.context.extensionPath)
    }

    private updateWebview(panel: vscode.WebviewPanel) {        
        const view = this.getView()

        panel.webview.html = view.getWebviewContent();
        panel.webview.onDidReceiveMessage((data) => {
            view.registerViewFuncs(data);
        });
    }

}

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension is now active!');

    const manager = new RTFSViewManager(context);
    manager.register_component();
}