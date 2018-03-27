import {listDirectory} from './utils';


const spawn = require('child-process-promise').spawn;

const ffmpeg = require('fluent-ffmpeg');

const ffmpeg_static = require('ffmpeg-static');


const {promisify} = require('util');


const ffprobeAsync = promisify(ffmpeg.ffprobe);


async function promisifyCommand(command) {
  return new Promise((resolve, reject) => {
    command
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}


async function videoThumbnail() {

  const command = ffmpeg( __dirname + '/test-small.mp4')
    .setFfmpegPath(ffmpeg_static.path)
    .noAudio()
    .on('filenames', function(filenames) {
      console.log('Will generate ' + filenames.join(', '))
    })
    .screenshots({
      count: 1,
      folder: '.',
      filename: 'thumb.png',
      size: '124x70'
    });

  await promisifyCommand(command);


}

async function videoLength() {

  const metadata = await ffprobeAsync( __dirname + '/test-small.mp4');

  console.log(metadata.format.duration);

}


async function runImageMagick() {

  const result = await spawn('convert',['./test-small.mp4[1]', 'thumbnail-test.png'],  { capture: [ 'stdout', 'stderr' ]});

  var stdout = result.stdout;
  var stderr = result.stderr;

  console.log('stdout: ', stdout);
  console.log('stderr: ', stderr);

}

console.log("FFMPEG binaries", ffmpeg_static.path);


//listDirectory(ffmpeg_static.path);


videoThumbnail();

// videoLength();

