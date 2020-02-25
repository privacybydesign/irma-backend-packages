# IRMA backend Javascript (node.js) package

This packages contains a module `irma-backend` for dealing with `irma server` and a module `irma-jwt`
for generating and verifying IRMA JWTs.

## IRMA backend
This module can be used in the following way:
```javascript
const IrmaBackend = require('irma-backend');
const irma = new IrmaBackend(serverUrl, options);
```
#### Constructor parameters

 - `serverUrl` should the be URL where your [IRMA server](https://irma.app/docs/irma-server/)
   is running
 - `options` (optional) specifies a struct where additional options can be specified.
   We currently support the following options:
    - `serverToken` field to enable
      [requestor authentication](https://irma.app/docs/irma-server/#requestor-authentication).
      By default this field is set to `false`, meaning that no authorization headers will be sent. 
      This can only be used if the IRMA server is configured to accept unauthenticated requests.
    - `debugging` field to enable printing helpful output to the console for debugging.
      By default this field is set to `false`.

#### Available methods
##### `startSession(request)`
This method starts a session at the IRMA server. The `request` parameter may either
be a session request object or a signed session request JWT. The function returns
a promise with on resolve the session identifiers `{sessionPtr: ..., token: ...}`.

##### `cancelSession(sessionToken)`
This method cancels the session with token `sessionToken` at the IRMA server. The parameter
`sessionToken` concerns the token as being returned by `startSession`. It returns a promise.
On resolve the session is cancelled successfully.

##### `getSessionResult(sessionToken)`
This method fetches the session result object. The parameter `sessionToken` concerns the token
as being returned by `startSession`. It returns a promise with on resolve the session
result object. When the result is not available yet, the promise is rejected.

##### `getSessionResultJwt(sessionToken)`
This method behaves the same as `getSessionResult`, but fetches the session result JWT instead.

##### `getSessionStatus(sessionToken)`
This method fetches the current status of the IRMA session. The parameter `sessionToken` concerns
the token as being returned by `startSession`. The function returns a promise with on resolve
the session status. A struct with the possible values for the session status can be retrieved
using `IrmaBackend.SessionStatus()`.

##### `getServerPublicKey()`
This method fetches the JWT public key of the IRMA server. It returns a promise with on resolve
the public key in a PEM encoded string. When no JWT public key is configured at the IRMA server,
the promise will be rejected.

**Important remark:** when using method `hmac` for JWT signing, the same key is used for both
signing and verification. This means in this case there is no public key and therefore this
function will also not return one.

##### `subscribeStatusEvents(sessionToken, eventCallback)`
With this method you can subscribe on receiving events on status updates of a particular IRMA
session. The parameter `sessionToken` concerns the token as being returned by `startSession`.
The parameter `eventCallback` concerns a 'error-first' callback function to receive the events.

The callback function signature is `(error, status) => {}`. When error is being `null`, the status
parameter will contain the new session status. A struct with the possible values for the session
status can be retrieved using `IrmaBackend.SessionStatus()`.

## IRMA JWT
This module can be used in the following way:
```javascript
const IrmaJwt = require('irma-jwt');
const irma = new IrmaJwt(method, options);
```

#### Constructor parameters
 - `method` concerns the algorithm that is used to sign the JWT. Currently IRMA supports the methods
   `hmac` for a HS256 signed JWT and `publickey` for a RS256 signed JWT.
 - `options` is a struct that defines the specific options related to the chosen `method`:
    - `secretKey` field indicates the secret key that is going to be used. For the method `hmac` this
    field is required, since the secret key there is both used for signing and verification. 
    For the method `publickey` the secretKey is only used for signing. In that case the `publicKey`
    is used for verification. Therefore, if you only need verification, you can omit this field.
    - `publicKey` field indicates the public key that is going to be used. This field is only relevant
    when using JWT verification using the method `publickey`. Otherwise you can omit this field. 
    - `iss` field concerns the name being recorded in the 'issuer' field (iss) of the JWT. This parameter is only
   required if you want to sign JWTs.

#### Available methods
##### `signSessionRequest(request)`
This method signs the request being passed and returns the JWT.

##### `verify(jwt)`
This method verifies whether the JWT is valid according to the specified key material.
It returns the JWT body of the supplied [session request JWT](https://irma.app/docs/session-requests/#jwts-signed-session-requests)
or [session result JWT](https://irma.app/docs/api-irma-server/#get-session-token-result-jwt),
depending on the JWT type.

## Examples
In the examples directory a small example can be found that shows some of the methods of `irma-backend`
and `irma-jwt`. The example requires a running IRMA server. The example can be started in the following way:
```
npm install
npm start
```
