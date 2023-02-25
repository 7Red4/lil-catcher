import isExecutable from '../utils/isExecutable';
const { spawn } = require('child_process');

const ffmpeg = isExecutable('ffmpeg');

const call = (args) => {
  const ffmpegProcess = spawn(ffmpeg, args);

  ffmpegProcess.stdout.on('data', () => {
    // Do something with data
  });
};

export { call };
