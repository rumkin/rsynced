'use strict';

const path = require('path');
const sync = require('../');

const DEBUG = !! process.env.DEBUG;
const dir = process.env.DIR || process.cwd();
const config = require(path.resolve(dir, 'rsync.json'));

const name = process.argv[2] || 'default';

const destinations = {};
config.destinations.forEach(dest => {
    var name = dest.name || 'default';
    destinations[name] = dest;
});

if (name in destinations === false) {
    throw new Error(`Configuration "${name}" not found`);
}

Object.assign(config, destinations[name]);

sync({
    dir,
    config,
})
.then((result) => {
    console.log('DONE'); // if verbose?
    process.exit(result ? 0 : 1);
})
.catch(error => {
    if (error) {
        DEBUG
            ? console.error(error.message)
            : console.error(error.stack);
    }

    process.exit(1);
});
