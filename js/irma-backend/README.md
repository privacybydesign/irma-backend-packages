# IRMA backend
This module can be used for handling messages from and to the 
[`irma server`](https://irma.app/docs/irma-server/) in the following way:
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
      accept unauthenticated requests or when only sending [signed JWT session requests](https://irma.app/docs/session-requests/#jwts-signed-session-requests).
    - `debugging` field to enable printing helpful output to the console for debugging.
      By default this field is set to `false`.

#### Available methods
##### `startSession(request)`
This method starts a session at the IRMA server. The `request` parameter may either
be a [session request object](https://irma.app/docs/session-requests/)
or a [signed JWT session request](https://irma.app/docs/session-requests/#jwts-signed-session-requests).
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
