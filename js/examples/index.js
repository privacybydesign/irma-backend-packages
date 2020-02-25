const IrmaBackend = require('irma-backend');
const IrmaJwt     = require('irma-jwt');

const serverUrl = 'http://localhost:8088';

const request = {
  '@context': 'https://irma.app/ld/request/disclosure/v2',
  'disclose': [
    [
      [ 'irma-demo.MijnOverheid.ageLower.over18' ]
    ]
  ]
};

const irmaBackend = new IrmaBackend(serverUrl);
const irmaJwt = new IrmaJwt('hmac', {sk: 'test-key'}, 'localhost');

// Show how to sign and verify JWTs
console.log('JWT example:');
const jwt = irmaJwt.signSessionRequest(request);
console.log('JWT:', jwt);
console.log('Verified JWT:', irmaJwt.verify(jwt));

// Start a session, show initial status and immediately cancel again
console.log('\nStarting IRMA session example:');
irmaBackend.startSession(request)

// Get session pointer and session token of started IRMA session
.then(r => {
  console.log('Session started:', r.sessionPtr);
  return r.token;
})

.then((token) => {
  // Subscribe to status events
  irmaBackend.subscribeStatusEvents(token, (error, status) => console.log('Status change:', status));

  // Show the current session state
  irmaBackend.getSessionStatus(token).then(r => console.log('Current session status:', r))

  // Cancel the session again
  .then(() => irmaBackend.cancelSession(token).then(() => console.log('Session nicely cancelled again.')));
});
