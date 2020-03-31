# IRMA backend Javascript (node.js) package

This packages contains a module `irma-backend`, for handling messages from and to the 
[`irma server`](https://irma.app/docs/irma-server/), and a module `irma-jwt`,
for generating and verifying IRMA JWTs.

## IRMA backend
This module can be used in the following way:
```javascript
const IrmaBackend = require('@privacybydesign/irma-backend');
const irmaBackend = new IrmaBackend(serverUrl, options);
```
#### Constructor parameters

 - `serverUrl` should be the URL where your [`irma server`](https://irma.app/docs/irma-server/)
   is running.
 - `options` (optional) specifies a struct where additional options can be specified.
   We currently support the following options:
    - `serverToken` field to enable
      [requestor authentication](https://irma.app/docs/irma-server/#requestor-authentication).
      By default this field is set to `false`, meaning that no authorization headers will be sent. 
      The default setting can only be used if the IRMA server is configured to
      accept unauthenticated requests. When request authentication is enabled at your `irma server`,
      a `serverToken` must be specified.
    - `debugging` field to enable printing helpful output to the console for debugging.
      By default this field is set to `false`.

#### Available methods
##### `startSession(request)`
This method starts a session at the IRMA server. The `request` parameter may either
be a [session request object](https://irma.app/docs/session-requests/)
or a [signed session request JWT](https://irma.app/docs/session-requests/#jwts-signed-session-requests).
The function returns a promise which on resolve gives the session identifiers
`{sessionPtr: ..., token: ...}`.

##### `cancelSession(sessionToken)`
This method cancels the session with token `sessionToken` at the IRMA server. The parameter
`sessionToken` concerns the token as being returned by `startSession`. It returns a promise.
On resolve the session is cancelled successfully.

##### `getSessionResult(sessionToken)`
This method fetches the session result object. The parameter `sessionToken` concerns the token
as being returned by `startSession`. It returns a promise which on resolve gives the [session
result object](https://irma.app/docs/api-irma-server/#get-session-token-result).
When the result is not available yet, the promise is rejected.

##### `getSessionResultJwt(sessionToken)`
This method behaves the same as `getSessionResult`, but fetches the
[session result JWT](https://irma.app/docs/api-irma-server/#get-session-token-result-jwt) instead.

##### `getSessionStatus(sessionToken)`
This method fetches the current [status](https://irma.app/docs/api-irma-server/#get-session-token-status)
of the IRMA session. The parameter `sessionToken` concerns the token as being returned by
`startSession`. The function returns a promise which on resolve gives the current session status.
A struct with the possible values for the session status can be retrieved using the static call
`IrmaBackend.SessionStatus`.

##### `getServerPublicKey()`
This method fetches the JWT public key of the IRMA server. It returns a promise which on resolve
gives the public key in a PEM encoded string. When no JWT public key is configured at the IRMA server,
the promise will be rejected.

**Important remark:** when using method `hmac` for JWT signing, the same key is used for both
signing and verification. This means in this case there is no public key and therefore this
function will also not return one.

##### `subscribeStatusEvents(sessionToken, eventCallback)`
With this method you can subscribe on receiving events on status updates of a particular IRMA
session. The parameter `sessionToken` concerns the token as being returned by `startSession`.
The parameter `eventCallback` concerns a 'error-first' callback function to receive the events.

The callback function signature is `(error, status) => {}`. When error is being `null`, the status
parameter will contain the new [session status](https://irma.app/docs/api-irma-server/#get-session-token-status). 
A struct with the possible values for the session status can be retrieved using the static call
`IrmaBackend.SessionStatus`.

#### Code example
Below a small example of how `irma-backend` can be used:
```javascript
const IrmaBackend = require('@privacybydesign/irma-backend');
const irmaBackend = new IrmaBackend(serverUrl, options);

const irmaRequest = {
  '@context': 'https://irma.app/ld/request/disclosure/v2',
  'disclose': [
    [
      [ 'irma-demo.MijnOverheid.ageLower.over18' ]
    ]
  ]
};

irmaBackend.startSession(irmaRequest)
.then(({sessionPtr, token}) => {

  // Send sessionPtr to the frontend

  // Fetch the result if present
  irmaBackend.subscribeStatusEvents(token, (error, status) => {
    if (error != null) {
      throw error;
    }
    if (status === IrmaBackend.SessionStatus.Done) {
      irmaBackend.getSessionResult(token)
      .then( result => { 
        // Do something with result
      });
    }
  });
});
```

## IRMA JWT
This module can be used in the following way:
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

## Run examples
In the examples directory small examples can be found that show some of the methods of `irma-backend`
and `irma-jwt`. The examples require a running IRMA server at port 8088. The examples can be started
in the following way:
```
npm install

# For irma-backend example
npm run start-backend
# For irma-jwt example
npm run start-jwt
```
