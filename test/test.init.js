'use strict';

const config = require('nconf')
    .argv()
    .env({ lowerCase: true, separator: '__' })

// chai for assertion
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-string'))
    .should();

process.on('unhandledRejection', (reason, promise) => {
    /* eslint-disable no-console */
    console.error('Unhandled promise rejection:'); 
    console.error(reason);
    process.exit(57);
    // If you noticed an exit code of 57, and grepped for it, now you know why.
    /* eslint-enable no-console */
});


module.exports = {
    config,
    should,
};
