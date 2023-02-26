const { exec } = require('child_process');
const isWindows = process.platform === 'win32';

type TResult = {
  path: string;
  isExecutable: boolean;
};

export default function (_command: string): TResult {
  const result: TResult = {
    path: '',
    isExecutable: false
  };

  exec(`${isWindows ? 'where.exe' : 'where'} ${_command}`, (error, stdout) => {
    if (error) {
      console.error(`Error checking ${_command} executable: ${error}`);
      return result;
    }

    result.path = stdout.trim();

    if (result.path) {
      result.isExecutable = true;
    } else {
      console.log(`${_command} is not executable.`);
    }

    return result;
  });

  return result;
}
