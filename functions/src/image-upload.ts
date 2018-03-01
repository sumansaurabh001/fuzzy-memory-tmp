import * as functions from 'firebase-functions';
import {initDB} from './utils';

const spawn = require('child-process-promise').spawn;
const mkdirp = require('mkdirp-promise');

const gcs = require('@google-cloud/storage')();

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

const THUMB_PREFIX = 'thumb_';
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;


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
    console.log('This is not an image.');
    return null;
  }

  if (fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a Thumbnail.');
    return null;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return null;
  }

  const bucket = gcs.bucket(event.data.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {contentType: contentType};

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return file.download({destination: tempLocalFile});
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  }).then(() => {
    console.log('Thumbnail created at', tempLocalThumbFile);
    // Uploading the Thumbnail.
    return bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  }).then(() => {
    console.log('Thumbnail uploaded to Storage at', thumbFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalThumbFile);
    // Get the Signed URLs for the thumbnail and original image.
    const config = {
      action: 'read',
      expires: '03-01-2500',
    };
    return Promise.all([
      thumbFile.getSignedUrl(config),
      file.getSignedUrl(config),
    ]);
  }).then((results) => {
    console.log('Got Signed URLs.');
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];

    const db = initDB();

    // Add the URLs to the Database
    return db.ref('images').push({path: fileUrl, thumbnail: thumbFileUrl});
  }).then(() => console.log('Thumbnail URLs saved to database.'));

});


