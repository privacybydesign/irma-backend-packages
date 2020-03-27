const IrmaJwt     = require('irma-jwt');

const irmaJwt = new IrmaJwt('hmac', {secretKey: 'test-key', iss: 'localhost'});

const irmaRequest = {
  '@context': 'https://irma.app/ld/request/disclosure/v2',
  'disclose': [
    [
      [ 'irma-demo.MijnOverheid.ageLower.over18' ]
    ]
  ]
};

// Show how to sign and verify JWTs
console.log('Starting JWT example:');
const jwt = irmaJwt.signSessionRequest(irmaRequest);
console.log('JWT:', jwt);
console.log('Verified JWT:', irmaJwt.verify(jwt));
