const JWT = require('jsonwebtoken');

module.exports = class IrmaJwt {
  constructor(method, keys, iss) {
    this._keys = keys;
    this._iss = iss;

    switch (method) {
      case 'publickey':
        this._algorithm = 'RS256';
        break;
      case 'hmac':
        this._algorithm = 'HS256';
        break;
      default:
        throw new Error(`Unsupported signing method ${method}`);
    }
  }

  signSessionRequest(request) {
    if (!this._keys.sk)
      throw new Error('No secret key is defined in IrmaJwt instance');

    let rrequest;
    if (request.type || request['@context']) {
      rrequest = { request };
    } else if (request.request) {
      rrequest = request;
    }

    const subjects = { disclosing: 'verification_request', issuing: 'issue_request', signing: 'signature_request' };
    const subjectsContext = {
      'https://irma.app/ld/request/disclosure/v2': 'verification_request',
      'https://irma.app/ld/request/signature/v2' : 'signature_request',
      'https://irma.app/ld/request/issuance/v2'  : 'issue_request',
    };

    if (!subjects[rrequest.request.type] && !subjectsContext[rrequest.request['@context']])
      throw new Error('Not an IRMA session request');

    const fields = { 'verification_request': 'sprequest', 'issue_request': 'iprequest', 'signature_request': 'absrequest' };
    const jwtOptions = { algorithm: this._algorithm, issuer: this._iss,
      subject: subjects[rrequest.request.type] || subjectsContext[rrequest.request['@context']]
    };

    return JWT.sign({[ fields[jwtOptions.subject] ] : rrequest}, this._keys.sk, jwtOptions);
  }

  verify(jwt) {
    switch (this._algorithm) {
      case "HS256":
        if (!this._keys.sk)
          throw new Error('No hmac secret key is defined in IrmaJwt instance');
        return JWT.verify(jwt, this._keys.sk);
      case "RS256":
        if (!this._keys.pk)
          throw new Error('No public key is defined in IrmaJwt instance');
        return JWT.verify(jwt, this._keys.pk);
      default:
        throw new Error(`Verification of JWTs`)
    }
  }

}
