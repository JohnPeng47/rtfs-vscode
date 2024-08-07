import {HTMLView} from './htmlView';

export class InitView extends HTMLView {
  public constructor(extensionPath: string) {
    super();
  }

  public getWebviewContent()  {return ""};
  public registerViewFuncs() {};
}