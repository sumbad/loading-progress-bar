// jest-puppeteer.config.js
module.exports = {
  server: {
    command: 'npx browser-sync "www" --index "test.html" -w --port 8082 --no-open',
    debug: true,
    waitOnScheme: {
      delay: 1000,
    },
  },
};
