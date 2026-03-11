// Wrapper for the auto-generated Encore client
// This file creates and exports a singleton instance of the Client
import Client, { Local } from './client';

const backend = new Client(Local);

export default backend;
export { Local };
