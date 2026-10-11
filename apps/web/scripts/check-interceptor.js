const fs = require('fs');
const html = fs.readFileSync('C:/Users/Dimi/Documents/Discordbot/apps/web/public/framer-home.html', 'utf8');
const hasInterceptor = html.includes('FRAMER_ROUTE_MAP');
const hasBaseHref = html.includes('<base href="/">');
const interceptorBefore = html.indexOf('FRAMER_ROUTE_MAP');
const framerJsBefore = html.indexOf('script_main.BYlQb-ML.mjs');
console.log('Has interceptor:', hasInterceptor);
console.log('Has base href:', hasBaseHref);
console.log('Interceptor pos:', interceptorBefore);
console.log('Framer JS pos:', framerJsBefore);
console.log('Interceptor comes BEFORE Framer JS:', interceptorBefore < framerJsBefore);
if (hasInterceptor) {
  const start = Math.max(0, interceptorBefore - 50);
  console.log('Snippet around interceptor:');
  console.log(html.substring(start, interceptorBefore + 150));
}
