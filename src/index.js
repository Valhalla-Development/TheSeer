import TheSeerClient from './Structures/TheSeerClient.js';
import 'dotenv/config';

const config = process.env;

const client = new TheSeerClient(config);
client.start();
