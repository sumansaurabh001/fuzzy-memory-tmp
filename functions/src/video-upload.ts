import * as functions from 'firebase-functions';

const mkdirp = require('mkdirp-promise');
import * as fs from 'fs';
import * as shortid from 'shortid';
const admin = require('firebase-admin');

// use $ and @ instead of - and _
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const {Storage} = require('@google-cloud/storage');

const gcs = new Storage();

import * as os from 'os';
import * as path from 'path';
import {getDocData, listDirectory, promisifyCommand} from './utils';
import {db} from './init';

/*
*
* After each video upload, extract an image thumbnail, the video duration and update the database.
*
*
* */

const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const ffprobe = require('@ffprobe-installer/ffprobe');

const promisify = require('util.promisify');


const ffprobeAsync = promisify(ffmpeg.ffprobe);

const THUMB_PREFIX = 'thumb_';


export const videoUpload = functions.storage.object().onFinalize(async (object, context) => {

  if (!object.contentType.startsWith('video/')) {
    return null;
  }

  const videoBucketFullPath = object.name;

  const frags = videoBucketFullPath.split('/');

  const tenantId = frags[0],
    courseId = frags[1],
    lessonId = frags[3];

  const lessonDbPath = 'schools/' + tenantId + '/courses/' + courseId + '/lessons/' + lessonId;

  const results = await db.doc(lessonDbPath).get();

  const lesson = results.data();

  try {

    const uniqueFileSuffix = shortid.generate();

    const  videoBucketDirectory = path.dirname(videoBucketFullPath),
      videoFileName = path.basename(videoBucketFullPath),
      localVideoFilePath = path.join(os.tmpdir(), videoBucketFullPath),
      localTempDir = path.dirname(localVideoFilePath);


    const bucket = gcs.bucket(object.bucket);

    console.log("Downloading video from bucket ", videoBucketFullPath);

    const file = bucket.file(videoBucketFullPath);

    // Create the temp directory where the video file will be downloaded.
    await mkdirp(localTempDir);

    console.log("Downloading video to ", localVideoFilePath);

    // Download file from bucket
    await file.download({destination: localVideoFilePath});

    const thumbnailFileName = `${THUMB_PREFIX}${uniqueFileSuffix}.png`;

    await extractVideoThumbnail(localVideoFilePath, localTempDir, thumbnailFileName);

    const videoDuration = Math.round(await getVideoDuration(localVideoFilePath));

    console.log("Extracted video duration: ", videoDuration);

    const localThumbnailFilePath = path.join(localTempDir, thumbnailFileName),
      thumbnailBucketPath = path.join(videoBucketDirectory, thumbnailFileName);

    const metadata = {
      contentType: 'img/png',
      cacheControl: 'public,max-age=2592000, s-maxage=2592000'
    };

    console.log("Uploading thumbnail");

    // Uploading the Video Thumbnail
    await bucket.upload(localThumbnailFilePath, {destination: thumbnailBucketPath, metadata: metadata});

    console.log("Cleaning up files");

    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(localVideoFilePath);
    fs.unlinkSync(localThumbnailFilePath);

    // load the previous video details if they exist, before replacing them
    const videosDbPath = 'schools/' + tenantId + '/courses/' + courseId + '/videos/' + lessonId;

    const video = await getDocData(videosDbPath);

    // save the actual video file name in another non-public collection, in order to support premium videos.
    const batch = db.batch();

    const lessonRef = db.doc(lessonDbPath);

    // save the original file name
    batch.update(lessonRef, {
      thumbnail: thumbnailFileName,
      originalFileName: extractOriginalFileName(videoFileName),
      videoDuration,
      uploadStatus:"done"
    });

    const videoRef = db.doc(videosDbPath);

    const videoSecretUrl = await file.getSignedUrl({action:'read',expires: new Date(3000,0,1)});

    batch.set(videoRef, {
      videoSecretUrl
    });

    const courseRef = db.doc(`schools/${tenantId}/courses/${courseId}`);

    // update course total duration
    batch.update(courseRef, {
      totalDuration: admin.firestore.FieldValue.increment(videoDuration - (lesson.videoDuration || 0))
    });

    await batch.commit();

    // if there was already a previous video for the lesson, delete it and its lesson thumbnail to save space
    if (lesson && lesson.originalFileName) {

      const previousVideoFilePath = `${tenantId}/${courseId}/videos/${lessonId}/${video.secretVideoFileName}`;

      const previousVideoFile = bucket.file(previousVideoFilePath);

      console.log("Deleting previous video from bucket ", previousVideoFilePath);

      await previousVideoFile.delete();

      const previousVideoThumbnailPath = `${tenantId}/${courseId}/videos/${lessonId}/${lesson.thumbnail}`;

      console.log("Deleting previous thumbnail ", previousVideoThumbnailPath);

      const previousVideoThumbnailFile = bucket.file(previousVideoThumbnailPath);

      await previousVideoThumbnailFile.delete();

    }

  }
  catch (err) {

    console.error("Video processing failed:", err);
    await db.doc(lessonDbPath).update({
      uploadStatus:"error"
    });

  }


});

function extractOriginalFileName(name: string) {

  if (!name) {
    return '';
  }

  const index = name.indexOf('-');

  return name.slice(index + 1);
}


async function extractVideoThumbnail(videoPath: string, thumbnailPath: string, thumbnailName: string) {

  const command = ffmpeg(videoPath)
    .setFfmpegPath(ffmpeg_static.path)
    .setFfprobePath(ffprobe.path)
    .noAudio()
    .screenshots({
      count: 1,
      folder: thumbnailPath,
      filename: thumbnailName,
      size: '177x100'
    });

  return promisifyCommand(command);
}

async function getVideoDuration(videoPath: string) {

  const metadata = await ffprobeAsync(videoPath);

  return metadata.format.duration;

}

