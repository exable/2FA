import sp from "speakeasy"
import { promisify } from 'util';
import crypto from 'node:crypto';
import {PRIVATE_USERNAME, PRIVATE_PASSWORD,SECRET } from "$env/static/private"


const scryptAsync = promisify(crypto.scrypt);

export function getCode(secret) {
    return {
        code: sp.totp({secret: secret.split(" ").join().trim(), encoding: 'base32', step: 30}),
        expires: timestampOfNextCode()
    }
}

export function timestampOfNextCode() {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeStep = 30; // Time step for TOTP (in seconds)
    const lastGeneratedTime = Math.floor(now / timeStep) * timeStep; // Round down to the last time step
    const nextCodeTime = lastGeneratedTime + timeStep;
  
    return nextCodeTime;
}


export async function getUser(cookie) {
    if(!cookie || cookie.length < 1) return false;
    const decrypted = await decrypt(cookie, SECRET);
    if(decrypted == PRIVATE_USERNAME+PRIVATE_PASSWORD){
        return PRIVATE_USERNAME
    } else {
        return false
    }

}

export async function decrypt(encryptedText, secretKey) {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    const tag = Buffer.from(encryptedText.slice(-32), 'hex');
    const encryptedData = encryptedText.slice(32, -32);
    const keyBuffer = await scryptAsync(secretKey, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}

export async function encrypt(text, secretKey) {
    const iv = crypto.randomBytes(16); // Initialization Vector
    const keyBuffer = await scryptAsync(secretKey, 'salt', 32); // Derive a 32-byte key

    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return iv.toString('hex') + encrypted + tag.toString('hex');
}

export function detectEncoding(secret) {
    if (/^[A-Z2-7]+$/.test(secret) && secret.length % 8 === 0) {
      return 'base32';
    } else if (/^[A-Za-z0-9+/]+={0,2}$/.test(secret) && secret.length % 4 === 0) {
      return 'base64';
    } else if (/^[0-9A-Fa-f]+$/.test(secret) && secret.length % 2 === 0) {
      return 'hex';
    } else if (/^[\x20-\x7E]+$/.test(secret)) {
      return 'ascii';
    } else {
      return 'Unknown';
    }
  }