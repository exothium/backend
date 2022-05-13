# Exothium website backend
This is the backend repository of Exothium's website developed in Node.js

# Packages
The packages that are being used in this project are:

- Express
- Express-session
- CORS
- Passport (Login with Twitter and Github)
- Dotenv (for environment variables)
- Nodemon (Dev. dependency to automatically restart the server after saving changes)


# Environment variables
Create a `.env` file in the root of the project with the following variables:

| Name | Type |
| ---- | ---- |
| TWITTER_API_KEY | String |
| TWITTER_API_SECRET | String |
| SESSION_SECRET | String |
| GITHUB_CLIENT_ID | String |
| GITHUB_CLIENT_SECRET | String |
| DISCORD_CLIENT_ID | String |
| DISCORD_CLIENT_SECRET | String |
| ENVIRONMENT | String - production or development |
| PORT | Int |

# Installation
```sh
cd ./project
npm install
node index.js
```

For development:
```sh
cd ./project
npm install
npm run dev
```
