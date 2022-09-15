import TheSeerClient from './Structures/TheSeerClient.js';

import * as config from '../config.json' assert { type: 'json' };

const client = new TheSeerClient(config.default);
client.start();
