const SessionState  = require('./session-state');
const SessionStatus = require('./session-status');

if ( typeof fetch === 'undefined' )
  require('isomorphic-fetch');

module.exports = class IrmaBackend {
  // Make SessionStatus struct accessible from outside this class
  static get SessionStatus() {
    return SessionStatus;
  }

  constructor(serverUrl, serverToken) {
    this._sessionStates = {};
    this._serverUrl = serverUrl;
    this._serverToken = serverToken;
  }

  _serverFetch(endpoint, requestOptions) {
    if (this._serverToken)
      requestOptions.headers['Authorization'] = this._serverToken;

    return fetch(`${this._serverUrl}/${endpoint}`, requestOptions)
    .then(r => {
      if ( r.status != 200 )
        throw(`Error while communicating with irma server: status other than 200 OK. Status: ${r.status} ${r.statusText}`);

      // Only unmarshal JSON when there actually is content
      if (r.headers.get('content-length') > 0)
        return r.json();
    })
  }

  startSession(request) {
    const requestOptions = {
      body:     request,
      method:   'POST',
      headers:   {},
    };

    if (typeof request === 'string') {
      requestOptions.headers['Content-Type'] = 'text/plain';
    } else {
      requestOptions.body = JSON.stringify(requestOptions.body);
      requestOptions.headers['Content-Type'] = 'application/json';
    }

    return this._serverFetch('session', requestOptions);
  }

  cancelSession(sessionToken) {
    return this._serverFetch(`session/${sessionToken}`, {method: 'DELETE'});
  }

  getSessionResult(sessionToken) {
    return this._serverFetch(`session/${sessionToken}/result`, {method: 'GET'});
  }

  getSessionResultJwt(sessionToken) {
    return this._serverFetch(`session/${sessionToken}/result-jwt`, {method: 'GET'});
  }

  getSessionStatus(sessionToken) {
    return this._serverFetch(`session/${sessionToken}/status`, {method: 'GET'});
  }

  getServerPublicKey() {
    return this._serverFetch('publickey', {method: 'GET'})
  }

  subscribeStatusEvents(sessionToken, eventCallback) {
    let sessionState = this._sessionStates[sessionToken];
    if (!sessionState) {
      sessionState = new SessionState(`${this._serverUrl}/session/${sessionToken}`);
      this._sessionStates[sessionToken] = sessionState;
    }
    sessionState.observe(eventCallback);
  }

}
