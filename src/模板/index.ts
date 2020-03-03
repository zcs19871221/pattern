abstract class HttpClient {
  send() {
    this.parseHeader();
    this.handleBody();
    this.sendRequest();
    if (this.isNeedHandleRedirect()) {
      this.redirect();
    }
  }

  private parseHeader() {
    console.log('parse header');
  }

  protected abstract handleBody(): void;

  protected abstract sendRequest(): void;
  protected abstract redirect(): void;

  protected isNeedHandleRedirect(): boolean {
    console.log('redirect hooks: no need redirect');
    return false;
  }
}

class BrowserClient extends HttpClient {
  handleBody() {
    console.log('handle browser body');
  }

  sendRequest() {
    console.log('xhr send request');
  }

  redirect() {
    throw new Error('xhr no need handle redirect');
  }
}

class NodeClient extends HttpClient {
  handleBody() {
    console.log('handle node body');
  }

  sendRequest() {
    console.log('node http send request');
  }

  redirect() {
    console.log('node handling redirect');
  }

  protected isNeedHandleRedirect(): boolean {
    console.log('redirect hooks: node need redirect');
    return true;
  }
}
(function main() {
  const nodeClient = new NodeClient();
  const browserClient = new BrowserClient();
  console.log('\n-------node client sending...');
  nodeClient.send();
  console.log('\n-------browser client sending...');
  browserClient.send();
})();
