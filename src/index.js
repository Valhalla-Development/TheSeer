const TheSeerClient = require('./Structures/TheSeerClient');
const config = require('../config.json');

const client = new TheSeerClient(config);
client.start();
