import isExecutable from '../utils/isExecutable';
const { spawn } = require('child_process');

const ytDlp = isExecutable('yt-dlp');

const getInfo = (url) => {
  if (!ytDlp?.isExecutable) return;
  return new Promise((resolve, reject) => {
    try {
      const ytDlpProcess = spawn(ytDlp?.path, [url, '-j']);

      let scriptOutput = '';

      ytDlpProcess.stdout.on('data', (data) => {
        data = data.toString();
        scriptOutput += data;
      });

      ytDlpProcess.on('close', () => {
        try {
          const jsonData = JSON.parse(scriptOutput);
          resolve(jsonData);
        } catch {
          resolve(null);
        }
      });
    } catch (err) {
      resolve(null);
      console.error(err);
    }
  });
};

export { getInfo };
