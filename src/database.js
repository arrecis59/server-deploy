var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require('./assets/firebase_api_key.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://enfermedades-db.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
module.exports = admin;