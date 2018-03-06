
console.log("testing firestore query ...");


const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'YOUR_PROJECT_ID',
  keyFilename: '/path/to/keyfile.json',
});

const document = firestore.doc('posts/intro-to-firestore');

// Enter new data into the document.
document.set({
  title: 'Welcome to Firestore',
  body: 'Hello World',
}).then(() => {
  // Document created successfully.
});

// Update an existing document.
document.update({
  body: 'My first Firestore app',
}).then(() => {
  // Document updated successfully.
});

// Read the document.
document.get().then(doc => {
  // Document read successfully.
});

// Delete the document.
document.delete().then(() => {
  // Document deleted successfully.
});
