const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file

const DOMAIN_NAME = process.env.DOMAIN_NAME;

let privateKey;
let certificate;

if (DOMAIN_NAME === 'localhost') {
  // For local, load certificates from the certs folder
  privateKey = fs.readFileSync(path.join(__dirname, 'certs', 'privkey.pem'), 'utf8');
  certificate = fs.readFileSync(path.join(__dirname, 'certs', 'fullchain.pem'), 'utf8');
} else {
  // For production, load certificates from a specified directory or Let's Encrypt
  privateKey = fs.readFileSync(`F:/projects/PartyCash/PartyCashBE/certs/privkey.pem`, 'utf8');
  certificate = fs.readFileSync(`F:/projects/PartyCash/PartyCashBE/certs/fullchain.pem`, 'utf8');
}

const credentials = { key: privateKey, cert: certificate };
module.exports = credentials;