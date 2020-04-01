## IRMA JWT
This module can be used for generating and verifying IRMA JWTs in the following way:
```javascript
const IrmaJwt = require('@privacybydesign/irma-jwt');
const irmaJwt = new IrmaJwt(method, options);
```

#### Constructor parameters
 - `method` concerns the algorithm that is used to sign the JWT. Currently IRMA supports the methods
   `hmac` for a HS256 signed JWT and `publickey` for a RS256 signed JWT.
 - `options` is a struct that defines the specific options related to the chosen `method`:
    - `secretKey` field indicates the secret key that is going to be used. For the method `hmac` this
    field is required, since the HS256 secret key is both used for signing and verification. 
    For the method `publickey` the secretKey is only used for signing. In that case the `publicKey`
    is used for verification. Therefore, if you only need verification, you can omit the `secretKey` field.
    - `publicKey` field indicates the public key that is going to be used. This field is only relevant
    when using JWT verification using the method `publickey`. Otherwise you can omit this field. 
    - `iss` field concerns the name being recorded in the 'issuer' field (iss) of the JWT. This parameter is only
   required if you want to sign JWTs.

#### Available methods
##### `signSessionRequest(request)`
This method signs the [session request object](https://irma.app/docs/session-requests/)
being passed and returns the JWT.

##### `verify(jwt)`
This method verifies whether the JWT is valid according to the specified key material.
It returns the JWT body of the supplied [session request JWT](https://irma.app/docs/session-requests/#jwts-signed-session-requests)
or [session result JWT](https://irma.app/docs/api-irma-server/#get-session-token-result-jwt),
depending on the JWT type.

#### Code example
Below a small example of how `irma-backend` can be used:
```javascript
const IrmaJwt = require('@privacybydesign/irma-jwt');
const irmaJwt = new IrmaJwt('hmac', {secretKey: 'test-key', iss: 'localhost'});

const irmaRequest = {
  '@context': 'https://irma.app/ld/request/disclosure/v2',
  'disclose': [
    [
      [ 'irma-demo.MijnOverheid.ageLower.over18' ]
    ]
  ]
};


// Sign a session request
const jwt = irmaJwt.signSessionRequest(irmaRequest);

// Verify the JWT
const verifiedJwt = irmaJwt.verify(jwt);
```
