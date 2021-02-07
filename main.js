const arg = require('arg');
const chalk = require('chalk');
const fs = require('fs');
const packageJson = require('./package.json');
const path = require('path');
const { exit } = require('process');
const {Settings} = require('./src/settings');
const {createServer} = require('./src/server');

const args = arg({
    '--server': Boolean,
    '--host': String,
    '--port': Number,
    '--help': Boolean,
    '--settings': Boolean,
    '--reset-settings': Boolean,
    '--reset-downloads': Boolean,
    '--log': Boolean,

    '-S': '--server',
    '-H': '--host',
    '-h': '--help',
    '-p': '--port'
}, {argv: process.argv.slice(1)});

function executeCli() {
    if (args['--help']) {
        console.log(`
${chalk.bold.blue('Freezer PC')} ${chalk.bold(`v${packageJson.version}`)} by exttex

${chalk.bold('USAGE:')}
--help, -h         Prints this and exits
--server, -S       Starts in server mode
--host, -H         Override host (default: 127.0.0.1)
--port, -p         Override port (default: 10069)

${chalk.bold('TOOLS:')}
--settings         Prints current settings and exits
--log              Prints server log and exits
--reset-settings   Reset settings to default
--reset-downloads  Delete downloads cache and database
        `);
        exit(0);
    }
    if (args["--settings"]) {
        let settings = new Settings();
        settings.load();
        console.log(JSON.stringify(settings, null, 2));
        exit(0);
    }
    if (args["--reset-settings"]) {
        fs.unlinkSync(Settings.getPath());
        exit(0);
    }
    if (args['--reset-downloads']) {
        fs.unlinkSync(Settings.getDownloadsDB());
        fs.rmdirSync(Settings.getTempDownloads(), {recursive: true});
        exit(0);
    }
    if (args['--log']) {
        let p = path.join(Settings.getDir(), "freezer-server.log");
        console.log(fs.readFileSync(p, {encoding: 'utf-8'}).toString());
        exit(0);
    }
}

async function startServer() {

    let override = {};
    if (args["--host"])
        override['host'] = args["--host"];
    if (args["--port"])
        override['port'] = args["--port"];

    settings = await createServer(false, () => {
        process.exit()
    }, override);
}
executeCli();
startServer();
