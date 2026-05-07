/**
 * Script para gerar NEXTAUTH_SECRET
 * 
 * Uso: node scripts/generate-secret.js
 */

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 NEXTAUTH_SECRET gerado com sucesso!\n');
console.log('Cole este valor no seu arquivo .env:\n');
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log('\n');
