import * as functions from 'firebase-functions';


const spawn = require('child-process-promise').spawn;
const mkdirp = require('mkdirp-promise');
import * as fs from 'fs';
import * as shortid from 'shortid';

// use $ and @ instead of - and _
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const {Storage} = require('@google-cloud/storage');

/*
*
*  Take an uploaded course image, generate a thumbnail and delete the original image.
*  Link the uploaded image to the course in the Firestore database.
*
*/


const gcs = new Storage();

import * as os from 'os';
import * as path from 'path';
import {db} from './init';


const THUMB_PREFIX = 'thumb_';


const formFactor = 510 / 287;

const THUMB_MAX_HEIGHT = 700;

const THUMB_MAX_WIDTH = THUMB_MAX_HEIGHT / formFactor;


export const imageUpload = functions.storage.object().onFinalize(async (object, context) => {

  const uniqueFileSuffix = shortid.generate();

  const filePath = object.name,
    contentType = object.contentType,
    fileDir = path.dirname(filePath),
    fileName = path.basename(filePath),
    fileExtension = fileName.split('.').pop(),
    newFileName = `${THUMB_PREFIX}${uniqueFileSuffix}.${fileExtension}`,
    thumbFilePath = path.normalize(path.join(fileDir, newFileName)),
    tempLocalFile = path.join(os.tmpdir(), filePath),
    tempLocalDir = path.dirname(tempLocalFile),
    tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  if (!contentType.startsWith('image/')) {
    return null;
  }

  if (fileName.startsWith(THUMB_PREFIX)) {
    return null;
  }

  const bucket = gcs.bucket(object.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: contentType,
    cacheControl: 'public,max-age=2592000, s-maxage=2592000'
  };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir);

  // Download file from bucket.
  await file.download({destination: tempLocalFile});

  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});

  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});

  // delete the original image to save space
  await file.delete();

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);

  const frags = thumbFilePath.split('/');

  const tenantId = frags[0],
    courseId = frags[1];


  const coursesDbPath = 'schools/' + tenantId + '/courses';

  const results = await db.doc(`${coursesDbPath}/${courseId}`).get();

  const course = results.data();

  // delete previous thumbnail to save space
  if (course && course.thumbnail) {

    const previousFilePath = `${tenantId}/${courseId}/thumbnail/${course.thumbnail}`;

    const previousFile = bucket.file(previousFilePath);

    await previousFile.delete();

  }

  await db.doc(coursesDbPath + '/' + courseId).update({thumbnail: newFileName});


});


