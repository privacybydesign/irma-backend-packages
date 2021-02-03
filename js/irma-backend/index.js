const SessionState  = require('./session-state');
const SessionStatus = require('./session-status');
const merge         = require('deepmerge');

if ( typeof fetch === 'undefined' )
  require('isomorphic-fetch');

module.exports = class IrmaBackend {
  // Make SessionStatus struct accessible from outside this class
  static get SessionStatus() {
    return SessionStatus;
  }

  constructor(serverUrl, options) {
    this._sessionStates = {};
    this._serverUrl = serverUrl;
    this._options = this._sanitizeOptions(options);
  }

  _serverFetch(endpoint, requestOptions) {
    if (this._options.serverToken)
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': this._options.serverToken,
    };

    const url = `${this._serverUrl}/${endpoint}`;

    if (this._options.debugging)
      console.log(`🌎 Fetching ${url}`);

    return fetch(`${this._serverUrl}/${endpoint}`, requestOptions)
    .then(r => {
      if ( r.status != 200 )
        throw(`Error while communicating with irma server: status other than 200 OK. Status: ${r.status} ${r.statusText}`);
      return r;
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

    return this._serverFetch('session', requestOptions).then(r => r.json());
  }

  cancelSession(sessionToken) {
    return this._serverFetch(`session/${sessionToken}`, {method: 'DELETE'}).then(() => undefined);
  }

  getSessionResult(sessionToken) {
    return this._serverFetch(`session/${sessionToken}/result`, {method: 'GET'}).then(r => r.json());
  }

  getSessionResultJwt(sessionToken) {
    return this._serverFetch(`session/${sessionToken}/result-jwt`, {method: 'GET'}).then(r => r.text());
  }

  getSessionStatus(sessionToken) {
    return this._serverFetch(`session/${sessionToken}/status`, {method: 'GET'}).then(r => r.json());
  }

  getServerPublicKey() {
    return this._serverFetch('publickey', {method: 'GET'}).then(r => r.text());
  }

  subscribeStatusEvents(sessionToken, eventCallback) {
    let sessionState = this._sessionStates[sessionToken];
    if (!sessionState) {
      sessionState = new SessionState(`${this._serverUrl}/session/${sessionToken}`, this._options);
      this._sessionStates[sessionToken] = sessionState;
    }
    sessionState.observe(eventCallback);
  }

  _sanitizeOptions(options) {
    const defaults = {
      debugging: false,

      // Token to authenticate at the irma server
      serverToken: false,
    };

    return merge(defaults, options || {});
  }

}
