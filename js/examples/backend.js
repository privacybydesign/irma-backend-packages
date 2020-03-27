const http = require('http');

const IrmaBackend = require('irma-backend');

const IrmaCore    = require('@privacybydesign/irma-core');
const IrmaClient  = require('@privacybydesign/irma-client');
const IrmaConsole = require('@privacybydesign/irma-console');

const port = 8080;

const irmaServerUrl = 'http://localhost:8088';

const irmaRequest = {
  '@context': 'https://irma.app/ld/request/disclosure/v2',
  'disclose': [
    [
      [ 'irma-demo.MijnOverheid.ageLower.over18' ]
    ]
  ]
};

const irmaBackend = new IrmaBackend(irmaServerUrl, {debugging: true});

// Create HTTP endpoint to serve session
const requestHandler = async (request, response) => {
  const session = await irmaBackend.startSession(irmaRequest);
  irmaBackend.subscribeStatusEvents(session.token, (error, status) => {
    if (error)
      return console.log('Error occured in session:', error);
    if (status === 'DONE') {
      irmaBackend.getSessionResult(session.token)
        .then(result => console.log('Session successfully received by backend:\n', result));
    }
  });
  response.end(JSON.stringify(session));
};

const server = http.createServer(requestHandler);
server.listen(port, err => {
  if (err)
    return console.log('Error while running server', err);
});

const irmaFrontend = new IrmaCore({
  debugging: true,
  session: {
    // Point this to your IRMA server:
    url: 'http://localhost:8080',

    // Define your disclosure request:
    start: {
      url: o => o.url,
      method: 'GET',
      headers: {}
    },
    result: false
  }
});
irmaFrontend.use(IrmaClient);
irmaFrontend.use(IrmaConsole);

irmaFrontend.start()
  .then(result => console.log("Successful! 🎉", result))
  .catch(error => console.error("Couldn't do what you asked 😢", error))
  .finally(() => server.close());
