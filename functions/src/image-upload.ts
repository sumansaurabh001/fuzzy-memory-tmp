import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const mkdirp = require('mkdirp-promise');
import * as fs from 'fs';

const gcs = require('@google-cloud/storage')({keyFilename: __dirname + '/service-account-credentials.json'});

import * as os from 'os';
import * as path from 'path';


const THUMB_PREFIX = 'thumb_';


const formFactor = 510 / 287;

const THUMB_MAX_HEIGHT = 700;

const THUMB_MAX_WIDTH = THUMB_MAX_HEIGHT / formFactor;


admin.initializeApp(functions.config().firebase);




export const imageUpload = functions.storage.object().onChange(event => {

  const filePath = event.data.name,
    contentType = event.data.contentType,
    fileDir = path.dirname(filePath),
    fileName = path.basename(filePath),
    thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`)),
    tempLocalFile = path.join(os.tmpdir(), filePath),
    tempLocalDir = path.dirname(tempLocalFile),
    tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  if (!contentType.startsWith('image/')) {
    return null;
  }

  if (fileName.startsWith(THUMB_PREFIX)) {
    return null;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    return null;
  }

  const bucket = gcs.bucket(event.data.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: contentType,
    cacheControl: 'public,max-age=2592000'
  };


  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return file.download({destination: tempLocalFile});
  }).then(() => {
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  }).then(() => {
    // Uploading the Thumbnail.
    return bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});

  }).then(() => {
      // delete the original image to save space
      return file.delete();
  }).then(() => {

    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalThumbFile);


    const frags = thumbFilePath.split('/');

    const tenantId = frags[0],
          courseUrl = frags[1],
          url = "https://firebasestorage.googleapis.com/v0/b/onlinecoursehost-local-dev.appspot.com/o/" + tenantId + "%2F" + courseUrl + "%2Fthumbnail%2Fthumb_" + courseUrl + ".png?alt=media",
          coursesPath = 'schools/' + tenantId + '/courses';

    const db = admin.firestore();

    // read course Id from DB, update course thumbnail
    return db.collection('schools')
      .doc(tenantId)
      .collection('courses')
      .where("url", "==", courseUrl)
      .get()
      .then(snap => {

        const ids = snap.docs.map(function (doc) {
          return doc.id;
        });

        console.log("saving image url to course:", courseUrl, url);

        return db.doc(coursesPath + '/' + ids[0] ).update({thumbnailUrl: url});

      });

  });

});


