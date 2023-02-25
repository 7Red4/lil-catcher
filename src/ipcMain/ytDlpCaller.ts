import isExecutable from '../utils/isExecutable';
const { spawn } = require('child_process');

const ytDlp = isExecutable('yt-dlp');

const call = (args) => {
  const ytDlpProcess = spawn(ytDlp, args);

  ytDlpProcess.stdout.on('data', () => {
    // Do something with data
  });
};

export { call };
