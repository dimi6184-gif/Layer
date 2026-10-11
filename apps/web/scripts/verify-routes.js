const fs = require('fs');
const content = fs.readFileSync('C:/Users/Dimi/Documents/Discordbot/apps/web/public/assets/js/script_main.BYlQb-ML.mjs', 'utf8');

// Find all path:` ... ` entries
const regex = /path:`([^`]+)`/g;
let m;
const paths = [];
while ((m = regex.exec(content)) !== null) {
  paths.push(m[1]);
}
console.log('Remaining route paths in script_main:', [...new Set(paths)]);

// Confirm sign-in is gone
console.log('Contains /sign-in?', content.includes("path:`/sign-in`"));
console.log('Contains /sign-up?', content.includes("path:`/sign-up`"));
console.log('Contains /otp?', content.includes("path:`/otp`"));
console.log('Contains /account?', content.includes("path:`/account`"));
console.log('Contains /contact?', content.includes("path:`/contact`"));
