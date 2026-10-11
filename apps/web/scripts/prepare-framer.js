const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcPath = 'C:/Users/Dimi/Downloads/real-sense-374960.framer.app/index.html';
const destPath = 'C:/Users/Dimi/Documents/Discordbot/apps/web/public/framer-home.html';

let html = fs.readFileSync(srcPath, 'utf8');

// Clean up injected extension scripts
html = html.replace(/<script src="chrome-extension:[^>]*><\/script>/g, '');
html = html.replace(/bis_register="[^"]*"/g, '');
html = html.replace(/bis_skin_checked="[^"]*"/g, '');
html = html.replace(/bis_use="[^"]*"/g, '');
html = html.replace(/__processed_[^"]*="true"/g, '');

// Clean up file: protocol preview banner
html = html.replace(/<script>\s*if\s*\(location\.protocol==='file:'\)[\s\S]*?<\/script>/, '');

// Clean relative paths
html = html.replace(/href="styles\.css"/g, 'href="/styles.css"');

// Update Links
const BOT_INVITE = 'https://discord.com/oauth2/authorize?client_id=1528870506881875988&permissions=8&scope=bot%20applications.commands';

html = html.replace(/href="\.\/sign-in"/g, 'href="/login"');
html = html.replace(/href="\.\/contact#\s*"/g, `href="${BOT_INVITE}"`);
html = html.replace(/href="\.\/contact"/g, `href="${BOT_INVITE}"`);
html = html.replace(/href="\.\/#\s*"/g, 'href="/"');
html = html.replace(/href="\.\/#features"/g, 'href="#features"');
html = html.replace(/href="\.\/#use-cases"/g, 'href="#use-cases"');
html = html.replace(/href="\.\/#faq"/g, 'href="#faq"');
html = html.replace(/href="\.\/legal\/privacy-policy"/g, 'href="/privacy"');
html = html.replace(/href="\.\/legal\/terms-of-service"/g, 'href="/terms"');
html = html.replace(/https:\/\/real-sense-374960\.framer\.app\//g, 'https://uselayer.de/');
html = html.replace(/https:\/\/real-sense-374960\.framer\.app/g, 'https://uselayer.de');
html = html.replace(/href="https:\/\/uselayer\.de\/login"/g, 'href="/login"');
html = html.replace(/href="https:\/\/uselayer\.de\/invite"/g, 'href="/invite"');
html = html.replace(/href="https:\/\/uselayer\.de\/add"/g, 'href="/invite"');

// Add base href tag if missing to ensure assets always load from root /
if (!html.includes('<base href="/">')) {
  html = html.replace('<head>', '<head>\n<base href="/">');
}

// Inject interceptor: catches Framer SPA pushState calls for /__framer/* paths
// and does a real full-page navigation to the correct Next.js route.
// This must go BEFORE the Framer JS runs, so inject right after <base href="/">.
const interceptorScript = `<script>
(function() {
  // Map /__framer/* paths to real Next.js routes
  var FRAMER_ROUTE_MAP = {
    '/__framer/sign-in': '/login',
    '/__framer/sign-up': '/login',
    '/__framer/otp':     '/login',
    '/__framer/account': '/dashboard',
    '/__framer/contact': '/invite',
  };

  function interceptNav(url) {
    if (!url) return null;
    var urlStr = typeof url === 'string' ? url : String(url);
    // Strip query/hash for matching
    var pathname = urlStr.split('?')[0].split('#')[0];
    return FRAMER_ROUTE_MAP[pathname] || null;
  }

  var _push = history.pushState.bind(history);
  var _replace = history.replaceState.bind(history);

  history.pushState = function(state, title, url) {
    var redirect = interceptNav(url);
    if (redirect) { window.location.href = redirect; return; }
    return _push(state, title, url);
  };

  history.replaceState = function(state, title, url) {
    var redirect = interceptNav(url);
    if (redirect) { window.location.href = redirect; return; }
    return _replace(state, title, url);
  };

  // Also catch any direct href clicks via event delegation
  document.addEventListener('click', function(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    var redirect = interceptNav(href);
    if (redirect) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = redirect;
    }
  }, true);
})();
<\/script>`;

// Inject right after <base href="/">
html = html.replace('<base href="/">', '<base href="/">\n' + interceptorScript);

fs.writeFileSync(destPath, html, 'utf8');
console.log(`Successfully created framer-home.html (${html.length} bytes)`);


// Also copy assets & styles from Framer export
execSync('xcopy /E /I /Y "C:\\Users\\Dimi\\Downloads\\real-sense-374960.framer.app\\assets" "C:\\Users\\Dimi\\Documents\\Discordbot\\apps\\web\\public\\assets"', { stdio: 'inherit' });
execSync('copy /Y "C:\\Users\\Dimi\\Downloads\\real-sense-374960.framer.app\\styles.css" "C:\\Users\\Dimi\\Documents\\Discordbot\\apps\\web\\public\\styles.css"', { stdio: 'inherit' });
console.log('Assets copied.');

// Patch Framer SPA route map so /sign-in etc. redirect to Next.js pages
execSync('node scripts/patch-framer-routes.js', { stdio: 'inherit', cwd: 'C:/Users/Dimi/Documents/Discordbot/apps/web' });
console.log('Route patches applied.');
