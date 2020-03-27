
switch (process.argv[2]) {
  case 'jwt':
    return require('./jwt');
  case 'backend':
    return require('./backend');
  default:
    return console.log('Run \'node index.js backend\' or \'node index.js jwt\'')
}
