# /test-stand
**Usage**: `/test-stand` 
Create and launch a production test stand to verify implementation WITHOUT committing to GitHub:

1. **Check vite.config.ts** for correct base (for Pages: '/repo-name/').
2. **Build project**: npm run build (creates /dist).
3. **Start local preview server**: npm run preview (opens http://localhost:4173).
4. **For public access** (share link without deploying):
   - Install localtunnel: npm i -g localtunnel (if not installed).
   - In new terminal: lt --port 4173 --subdomain my-test-stand.
   - Get public link: https://my-test-stand.loca.lt.
5. **Watch mode** (auto-rebuild on changes): add script "preview:watch": "vite preview --watch" to package.json and run.
6. **Stop**: Ctrl+C in terminals.

Show copy-paste commands, open preview in browser, and provide link for testing.