import * as functions from 'firebase-functions';

const mkdirp = require('mkdirp-promise');
import * as fs from 'fs';
import * as shortid from 'shortid';

const gcs = require('@google-cloud/storage')({keyFilename: __dirname + '/service-account-credentials.json'});

import * as os from 'os';
import * as path from 'path';
import {listDirectory, promisifyCommand} from './utils';


const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const ffprobe = require('@ffprobe-installer/ffprobe');

const promisify = require('util.promisify');




const ffprobeAsync = promisify(ffmpeg.ffprobe);

const THUMB_PREFIX = 'thumb_';




export const videoUpload = functions.storage.object().onChange(async event => {

  if (!event.data.contentType.startsWith('video/')) {
    return null;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    return null;
  }

  const uniqueFileSuffix = shortid.generate();

  const videoBucketFullPath = event.data.name,
    videoBucketDirectory = path.dirname(videoBucketFullPath),
    videoFileName = path.basename(videoBucketFullPath),
    localVideoFilePath = path.join(os.tmpdir(), videoBucketFullPath),
    localTempDir = path.dirname(localVideoFilePath);

  const bucket = gcs.bucket(event.data.bucket);
  const file = bucket.file(videoBucketFullPath);

  // Create the temp directory where the video file will be downloaded.
  await mkdirp(localTempDir);

  // Download file from bucket
  await file.download({destination: localVideoFilePath});

  const  localThumbnailFileName = `${THUMB_PREFIX}${uniqueFileSuffix}.png`;

  await extractVideoThumbnail(localVideoFilePath, localTempDir, localThumbnailFileName);

  const videoDuration = await getVideoDuration(localVideoFilePath);

  console.log('video duration:', videoDuration);

  listDirectory(localTempDir);

  const localThumbnailFilePath = path.join(localTempDir, localThumbnailFileName),
        thumbnailBucketPath = path.join(videoBucketDirectory, localThumbnailFileName);

  const metadata = {
    contentType: 'img/png',
    cacheControl: 'public,max-age=2592000, s-maxage=2592000'
  };

  // Uploading the Video Thumbnail
  await bucket.upload(localThumbnailFilePath, {destination: thumbnailBucketPath, metadata: metadata});

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(localVideoFilePath);
  fs.unlinkSync(localThumbnailFilePath);

  console.log("video thumbnail generated ...");



  /*

  const frags = thumbFilePath.split('/');

  const tenantId = frags[0],
    courseId = frags[1];


  const coursesDbPath = 'schools/' + tenantId + '/courses';

  const db = admin.firestore();

  const results = await db.doc(`${coursesDbPath}/${courseId}`).get();

  const course = results.data();

  // delete previous thumbnail to save space
  if (course && course.thumbnail) {

    const previousFilePath = `${tenantId}/${courseId}/thumbnail/${course.thumbnail}`;

    console.log('deleting previous file: ', previousFilePath);
    const previousFile = bucket.file(previousFilePath);

    await previousFile.delete();

  }

  console.log('saving file name:', newFileName);

  await db.doc(coursesDbPath + '/' + courseId).update({thumbnail: newFileName});

*/

});



async function extractVideoThumbnail(videoPath:string, thumbnailPath:string, thumbnailName:string) {

  const command = ffmpeg(videoPath)
    .setFfmpegPath(ffmpeg_static.path)
    .setFfprobePath(ffprobe.path)
    .noAudio()
    .screenshots({
      count: 1,
      folder: thumbnailPath,
      filename: thumbnailName,
      size: '124x70'
    });

  return promisifyCommand(command);
}

async function getVideoDuration(videoPath:string) {

  const metadata = await ffprobeAsync(videoPath);

  return metadata.format.duration;

}

