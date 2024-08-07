export abstract class HTMLView {
  // abstract constructor(extensionPath: string) {};

  abstract getWebviewContent(): string;
  abstract registerViewFuncs(data: any): void;
}