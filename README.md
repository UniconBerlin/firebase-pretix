# Firebase <-> Pretix Integration

Single Firebase function running an express app. The app has two main concerns:
1. A REST API, powered by express.js
2. Webhook endpoints for pretix events.

The rest api functions are all under the /api endpoint.

The webhook endpoints are prefixed with /pretix-

Webflow integration scripts can be found at [UniconBerlin/webflow-firebase](https://github.com/UniconBerlin/webflow-firebase)

## Development Setup

Node 14.11.0 and 6.14.8 are required for development.

### Set up Firebase
```zsh
# Install firebase-tools
npm install -g firebase-tools

# Log in to Firebase
firebase login
```

### Run the development server
```zsh
# Clone the repository
git clone https://github.com/UniconBerlin/firebase-pretix

# Install dependencies
cd firebase-pretix/functions
npm install

# Start the firebase emulator
npm run serve
```

For local development of the functions, it's recommended to use [Postman](https://postman.com). Simply import the [postman collection](./firebase-pretix.postman_collection.json) provided in the repo and set the following collection environment variables:
- PROD_URL
- DEV_URL
- API_KEY
- email
- password

For easier access to fequently changed variables, import the postmant environment.

By changing the collection variable ENVIRONMENT from dev to prod, you can test the production endpoint.