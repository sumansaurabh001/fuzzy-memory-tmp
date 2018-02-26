import * as functions from 'firebase-functions';







 // Start writing Firebase Functions
 // https://firebase.google.com/docs/functions/typescript

// shell docs - https://firebase.google.com/docs/functions/local-emulator

/*
*
*   Run function via shell:  createCourseTrigger({id: 1, url: 'test-123'})
*
*   with parameters: myFirestoreFunction({foo: ‘new’}, {params: {group: 'a', id: 123}})
*
* */




const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();


/*
*
*  Will not be using it, its just a demo
*
* */



/*
export const createCourseTrigger = functions.firestore
  .document('schools/{tenantId}/courses/{courseId}')
  .onCreate(event => {

    const course = event.data.data();

    const url = course.url,
          tenantId = event.params.tenantId;

    // add entry to uniqueUrlPerCourse
    return db.doc(
      `schools/${tenantId}/constraints/courses/uniqueUrlPerCourse/${url}`).set({});
  });



*/
