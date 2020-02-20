_Work in progress - See https://github.com/privacybydesign/irmajs or https://irma.app/docs/api-irma-server/ for now_

# IRMA backend packages
IRMA backend packages is a collection of libraries to integrate IRMA in the backend of your application.
Using the libraries in this package you can start and manage IRMA sessions from your backend and
generate and verify IRMA JWTs for session requests and session results.

The libraries for starting and managing IRMA sessions implement the REST API of `irma server`
as implemented in [irmago](https://github.com/privacybydesign/irmago). The exact outline
of this REST API can be found in the [documentation](https://irma.app/docs/api-irma-server/).

A general overview of functionalities this library provides to you:
 - Starting IRMA sessions using a session request or a JWT at the IRMA server
 - Retrieving the current status of IRMA sessions (only once or by receiving events on status updates)
 - Retrieving session result or session result JWT when a session succeeded
 - Cancelling IRMA sessions
 - Retrieving the JWT public key of the IRMA server
 - Generating a JWT of a session request
 - Verifying a JWT of a session request or a session result

The exact use of these features depends per programming language.

## [Go](https://golang.org/)
The IRMA server itself is implemented in Go. If you want to integrate the IRMA server in your
backend application you can therefore simply import the IRMA server as a library. No separate
IRMA server is needed then. The details of the IRMA server library can be found
[here](https://irma.app/docs/irma-server-lib/).

## Node.js / Javascript
The Javascript packages can be found in the `js` directory. This package consists of two
modules: `irma-backend` for starting and managing sessions and `irma-jwt` for generating
and verifying JWTs. A detailed explanation of the methods available can be found in the
README within the `js` directory.

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
