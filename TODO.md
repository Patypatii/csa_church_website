# Backend MongoDB Connection Fix - Progress Tracker

## Information Gathered
- MongoDB URI in .env correct but connection fails with \"Invalid scheme\"
- Caused by potential trailing whitespace/newline in env var
- Multiple dotenv.config() calls
- \"undefined\" from console.log(TOKEN) in emailConfig.js

## Steps
- [x] Created test-mongo.js to isolate connect
- [ ] Run test-mongo.js - confirm URI parsing
- [ ] Edit backEnd/src/Configs/dbConfig.js - add URI.trim(), validation
- [ ] Edit backEnd/src/server.js - add dotenv.config() once at top
- [ ] Remove redundant dotenv.config() from other files (Tokens.js, Login.js, etc.)
- [ ] Test: cd backEnd &amp;&amp; npm run dev
- [ ] Delete test-mongo.js &amp;&amp; attempt_completion

## Dependent Files
- backEnd/src/Configs/dbConfig.js
- backEnd/src/server.js
- backEnd/src/middleWares/Tokens.js
- backEnd/src/controllers/Login.js
- backEnd/src/Configs/serverConfigs.js
- backEnd/src/Configs/emailConfig.js

Updated: Initial TODO
