export abstract class HTMLView {
  abstract getWebviewContent(): string;
  abstract registerViewFuncs(data: any): void;
}