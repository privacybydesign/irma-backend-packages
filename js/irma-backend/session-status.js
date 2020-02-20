const SessionStatus = {
  Initialized: 'INITIALIZED', // The session has been started and is waiting for the client to connect (scan the QR)
  Connected  : 'CONNECTED',   // The client has retrieved the session request, we wait for its response
  Cancelled  : 'CANCELLED',   // The session is cancelled, possibly due to an error
  Done       : 'DONE',        // The session has completed successfully
  Timeout    : 'TIMEOUT',     // Session timed out
};

module.exports = SessionStatus;
