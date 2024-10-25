import * as fs from 'fs';
import * as path from 'path';

const logFile = path.join(__dirname, 'logs.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function logToFile(message: string) {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
}

console.log = (message: any, ...optionalParams: any[]) => {
  logToFile(message);
  process.stdout.write(`${message}\n`);
};

console.error = (message: any, ...optionalParams: any[]) => {
  logToFile(`ERROR: ${message}`);
  process.stderr.write(`ERROR: ${message}\n`);
};

console.info = (message: any, ...optionalParams: any[]) => {
  logToFile(`INFO: ${message}`);
  process.stdout.write(`INFO: ${message}\n`);
};

console.warn = (message: any, ...optionalParams: any[]) => {
  logToFile(`WARN: ${message}`);
  process.stdout.write(`WARN: ${message}\n`);
};

console.debug = (message: any, ...optionalParams: any[]) => {
  logToFile(`DEBUG: ${message}`);
  process.stdout.write(`DEBUG: ${message}\n`);
};

console.trace = (message: any, ...optionalParams: any[]) => {
  logToFile(`TRACE: ${message}`);
  process.stdout.write(`TRACE: ${message}\n`);
};

console.dir = (message: any, ...optionalParams: any[]) => {
  logToFile(`DIR: ${message}`);
  process.stdout.write(`DIR: ${message}\n`);
};

console.time = (label: string) => {
  logToFile(`TIME: ${label}`);
  console.time(label);
};

console.timeEnd = (label: string) => {
  logToFile(`TIME END: ${label}`);
  console.timeEnd(label);
};