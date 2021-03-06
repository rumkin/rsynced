#!/usr/bin/env node
'use strict';

const path = require('path');
const sync = require('../');

const DEBUG = !! process.env.DEBUG;
const dir = process.env.DIR || process.cwd();
const syncfile = process.env.SYNCFILE || path.join(dir, 'rsync.json');
const config = require(path.resolve(process.cwd(), syncfile));

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
