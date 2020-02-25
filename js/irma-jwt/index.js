const JWT = require('jsonwebtoken');

module.exports = class IrmaJwt {
  constructor(method, options) {
    this._options = options || {};

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
    if (!this._options.secretKey)
      throw new Error('No secret key is defined in IrmaJwt instance');
    if (!this._options.iss)
      throw new Error('No iss field is specified in options');

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
    const jwtOptions = { algorithm: this._algorithm, issuer: this._options.iss,
      subject: subjects[rrequest.request.type] || subjectsContext[rrequest.request['@context']]
    };

    return JWT.sign({[ fields[jwtOptions.subject] ] : rrequest}, this._options.secretKey, jwtOptions);
  }

  verify(jwt) {
    switch (this._algorithm) {
      case "HS256":
        if (!this._options.secretKey)
          throw new Error('No hmac secret key is defined in IrmaJwt instance');
        return JWT.verify(jwt, this._options.secretKey);
      case "RS256":
        if (!this._options.publicKey)
          throw new Error('No public key is defined in IrmaJwt instance');
        return JWT.verify(jwt, this._options.publicKey);
      default:
        throw new Error(`Verification of JWTs`)
    }
  }

}
