# IRMA backend packages
IRMA backend packages is a collection of libraries in multiple programming languages
to integrate IRMA in the backend of your application. Using the libraries in this repository
you can start and manage IRMA sessions from your backend and generate and verify IRMA JWTs
for session requests and session results. These libraries all build upon the [IRMA server](https://irma.app/docs/what-is-irma#irma-servers)
as implemented [irmago](https://github.com/privacybydesign/irmago).

In particular, these libraries allow you to do the following:
 - Starting IRMA sessions using a [session request](https://irma.app/docs/session-requests/)
   or a [JWT](https://irma.app/docs/session-requests/#jwts-signed-session-requests) at the IRMA server
 - Retrieving the current [status of IRMA sessions](https://irma.app/docs/api-irma-server/#get-session-token-status)
   (only once or by receiving events on status updates)
 - Retrieving the [session result](https://irma.app/docs/api-irma-server/#get-session-token-result)
   or [session result JWT](https://irma.app/docs/api-irma-server/#get-session-token-result-jwt)
   when a session succeeded
 - Cancelling IRMA sessions
 - Retrieving the JWT public key of the IRMA server
 - Generating a JWT of a session request
 - Verifying a JWT of a session request or a session result

Depending on the programming language, the libraries achieve this by either directly including
the IRMA server functionality, or by consuming the [REST API](https://irma.app/docs/api-irma-server)
exposed by the irma server.

The library will slightly differ per language, since each programming language has its own conventions.

## [Go](https://golang.org/)
The IRMA server itself is implemented in Go. If you want to integrate the IRMA server in your
backend application you can therefore simply import the IRMA server as a library. No separate
IRMA server is needed then. The details of the IRMA server library can be found
[here](https://irma.app/docs/irma-server-lib/).

## Node.js / Javascript
The Javascript packages can be found in the `js` directory. This package consists of two
modules: `irma-backend` for starting and managing sessions and `irma-jwt` for generating
and verifying JWTs. A detailed explanation of the methods available can be found in the
[README](/js) within the `js` directory.

The `irma-backend` module only provides backend functionalities for session management
and starting sessions. A session cannot be handled via the console. For this you can use
the [`irma-frontend-packages`](https://github.com/privacybydesign/irma-frontend-packages)
library which provides a `irma-console` plugin for handling IRMA sessions from the
command line using Node.js. `irma-frontend-packages` also provides Javascript packages
for handling user interaction in browser environments.

## Other languages
When the programming language of your choice is not available yet, you can always use
the [IRMA server REST API](https://irma.app/docs/api-irma-server/). If you think the
programming language of your choice would benefit being part of `irma-backend-packages`,
you can always contact us or make an issue on Github.

When you made a library for a programming language yourself that we do not support yet
or when you added features to existing libraries, you can always send us a pull request.
We are always interested in extending the IRMA ecosystem with support for additional
programming languages.

## Documentation
The information from this README can also be found in the
[IRMA documentation](https://irma.app/docs/irma-backend/).
