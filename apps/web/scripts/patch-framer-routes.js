const fs = require('fs');
const path = 'C:/Users/Dimi/Documents/Discordbot/apps/web/public/assets/js/script_main.BYlQb-ML.mjs';
let content = fs.readFileSync(path, 'utf8');

const before = content.length;
let changes = 0;

// STRATEGY: Map Framer internal SPA routes to GARBAGE paths that will never match
// real pages. Then the interceptor script (injected into framer-home.html) will
// catch pushState calls and do full page navigations to the correct Next.js routes.
//
// Framer route IDs:
// I1ur1SZDM  -> /sign-in  (Sign In page)
// jPFeYLL3A  -> /sign-up  (Sign Up page)
// QLPbhSIfF  -> /otp      (OTP code entry page)
// LErbGtErJ  -> /account  (Account page)
// G9l6HTB3t  -> /contact  (Contact page)
//
// We map them to unique internal paths that the interceptor recognizes and handles
// by doing window.location.href navigation to real Next.js pages.

function replacePath(src, fromPath, toPath) {
  const searchStr = 'path:`' + fromPath + '`';
  const replaceStr = 'path:`' + toPath + '`';
  if (src.includes(searchStr)) {
    return { result: src.split(searchStr).join(replaceStr), changed: true };
  }
  return { result: src, changed: false };
}

// Map framer internal pages to /__framer/* paths that won't clash with Next.js
// The interceptor in framer-home.html will catch these and redirect accordingly
let r = replacePath(content, '/sign-in', '/__framer/sign-in');
if (r.changed) { content = r.result; changes++; console.log('Patched /sign-in -> /__framer/sign-in'); }
else { console.log('WARNING: /sign-in path not found (already patched?)'); }

r = replacePath(content, '/sign-up', '/__framer/sign-up');
if (r.changed) { content = r.result; changes++; console.log('Patched /sign-up -> /__framer/sign-up'); }
else { console.log('WARNING: /sign-up path not found (already patched?)'); }

r = replacePath(content, '/otp', '/__framer/otp');
if (r.changed) { content = r.result; changes++; console.log('Patched /otp -> /__framer/otp'); }
else { console.log('WARNING: /otp path not found (already patched?)'); }

r = replacePath(content, '/account', '/__framer/account');
if (r.changed) { content = r.result; changes++; console.log('Patched /account -> /__framer/account'); }
else { console.log('WARNING: /account path not found (already patched?)'); }

r = replacePath(content, '/contact', '/__framer/contact');
if (r.changed) { content = r.result; changes++; console.log('Patched /contact -> /__framer/contact'); }
else { console.log('WARNING: /contact path not found (already patched?)'); }

// Also handle already-patched paths from previous run (login -> /__framer/sign-in, etc.)
r = replacePath(content, '/login', '/__framer/sign-in');
if (r.changed) { content = r.result; changes++; console.log('Re-patched /login -> /__framer/sign-in'); }

r = replacePath(content, '/dashboard', '/__framer/account');
if (r.changed) { content = r.result; changes++; console.log('Re-patched /dashboard -> /__framer/account'); }

console.log('Total changes:', changes, '| Size before:', before, '-> after:', content.length);
fs.writeFileSync(path, content, 'utf8');
console.log('Done patching script_main.BYlQb-ML.mjs');
