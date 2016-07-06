const Rsync = require('rsync');
const path = require('path');

module.exports = sync;

const defaults = {
    user: 'root',
    root: '/',
    source: '.',
};

function sync({dir, config}) {
    if (config.cwd) {
        process.cwd(path.resolve(dir, config.cwd));
    }

    Object.getOwnPropertyNames(defaults).forEach(prop => {
        if (! config.hasOwnProperty(prop)) {
            config[prop] = defaults[prop];
        }
    });

    var rsync = new Rsync();
    var keyFile = config.sshKey
        ? path.resolve(process.cwd(), config.sshKey)
        : path.join(process.env.HOME, '.ssh', 'id_rsa');

    rsync
    .shell(`ssh -i ${keyFile}`)
    .dirs()
    .flags()
    .recursive();

    if (config.relative) {
        rsync.set('relative', config.relative);
    }

    if (config.source) {
        rsync.source(config.source);
    }

    if (config.exclude) {
        rsync.exclude(config.exclude);
    }

    if (config.include) {
        rsync.include(config.include);
    }

    rsync.destination(
        path.join(
            config.user + '@' + config.host + ':' + (config.root || ''), config.dest
        )
    );

    return exec(rsync);
}

function exec(rsync) {
    return new Promise((resolve, reject) => {
        var child;

        function onQuit() {
            if (child) {
                child.kill();
            }

            reject(new Error('Unexpectedly exited'));
            unbind();
        };

        function onStop() {
            resolve(false);
            unbind();
        }

        function bind() {
            process.on('SIGINT', onStop);
            process.on('SIGTERM', onStop);
            process.on('exit', onQuit);
        }

        function unbind() {
            process.removeListener('SIGINT', onStop);
            process.removeListener('SIGTERM', onStop);
            process.removeListener('exit', onQuit);
        }

        child = rsync.execute(function(error){
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }

            unbind();
        });

        bind();
    });
}

sync.defaults = defaults;
