# IRMA backend Javascript (node.js) package

This package contains a module `irma-backend`, for handling messages from and to the 
[`irma server`](https://irma.app/docs/irma-server/), and a module `irma-jwt`,
for generating and verifying IRMA JWTs.

The modules can also be found on npm in the scoped packages `@privacybydesign/irma-backend`
and `@privacybydesign/irma-jwt`.

For more information about the usage of these packages, check their READMEs:
 * [IRMA backend](irma-backend)
 * [IRMA JWT](irma-jwt)

## Run examples
In the examples directory small examples can be found that show some of the methods of `irma-backend`
and `irma-jwt`. The examples require a running IRMA server at port 8088. The examples can be started
in the following way:
```
cd examples
npm install

# For irma-backend example
npm run start-backend
# For irma-jwt example
npm run start-jwt
```
