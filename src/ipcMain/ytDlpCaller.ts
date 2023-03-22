import isExecutable from '../utils/isExecutable';
import { call as ffmpegCall } from './ffmpegCaller';
const { spawn } = require('child_process');

const ytDlp = isExecutable('yt-dlp');

const getInfo = (url) => {
  if (!ytDlp?.isExecutable) return;
  return new Promise((resolve) => {
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

const doDownloadYT = (payload: {
  url: string;
  title: string;
  vQuallity: number | 'best';
  aQuality: number | 'best';
  fileExtension: string;
  path: string;
}) => {
  if (!ytDlp?.isExecutable) return;

  return new Promise((resolve) => {
    const getVideoM3u8 = new Promise((resolve, reject) => {
      try {
        const getm3u8 = spawn(ytDlp?.path, ['-f', payload.vQuallity, '-g', payload.url]);
        let m3u8Url = '';
        getm3u8.stdout.on('data', (data) => {
          data = data.toString();
          m3u8Url += data;
        });

        getm3u8.on('close', () => {
          resolve(m3u8Url.replace(/\s\s+/g, ''));
        });
      } catch (err) {
        console.error('getVideoM3u8 ERROR');
        console.error(err);
        reject(err);
      }
    });

    const getAudioM3u8 = new Promise((resolve, reject) => {
      try {
        const getm3u8 = spawn(ytDlp?.path, ['-f', payload.aQuality, '-g', payload.url]);
        let m3u8Url = '';
        getm3u8.stdout.on('data', (data) => {
          data = data.toString();
          m3u8Url += data;
        });

        getm3u8.on('close', () => {
          resolve(m3u8Url.replace(/\s\s+/g, ''));
        });
      } catch (err) {
        console.error('getAudioM3u8 ERROR');
        console.error(err);
        reject(err);
      }
    });

    Promise.all([getVideoM3u8, getAudioM3u8]).then((values) => {
      ffmpegCall([
        '-i',
        values[0],
        '-i',
        values[1],
        '-c',
        'copy',
        '-map',
        '0:v:0',
        '-map',
        '1:a:0',
        `${payload.path}/${payload.title}.${payload.fileExtension}`
      ]);
    });
  });
};

const doDownloadDirect = (payload: { url: string; title: string; path: string }) => {
  if (!ytDlp?.isExecutable) return;

  return new Promise((resolve) => {
    try {
      const ytDlpProcess = spawn(ytDlp?.path, [
        payload.url,
        '-o',
        `${payload.path}/${payload.title}.%(ext)s`
      ]);

      let scriptOutput = '';

      ytDlpProcess.stdout.on('data', (data) => {
        data = data.toString();
        scriptOutput += data;
        console.log(data);
      });

      ytDlpProcess.on('close', () => {
        try {
          const jsonData = JSON.parse(scriptOutput);
          console.log('END: ytDlpProcess');
          console.log(scriptOutput);
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

export { getInfo, doDownloadYT, doDownloadDirect };
