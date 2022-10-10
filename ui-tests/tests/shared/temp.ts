import fse from 'fs-extra';

export async function readTempFile(type: TempFileType, projectPath: string) {
  const filepath = getTempFilePaths(projectPath)[type];
  if (!fse.existsSync(filepath)) return undefined;

  const buffer = await fse.readFile(filepath);
  return buffer.toString();
}

export async function writeTempFile(data: string, type: TempFileType, projectPath: string) {
  const filepath = getTempFilePaths(projectPath)[type];
  await fse.ensureFile(filepath);
  await fse.writeFile(filepath, data);
}

export function getTempFilePaths(projectPath: string) {
  const root = `.temp/${timestamp}/${projectPath}`;

  return {
    cookies: `${root}/cookies.json`,
    localStorage: `${root}/local-storage.json`,
    sessionStorage: `${root}/session-storage.json`,
  };
}

type TempFileType = keyof ReturnType<typeof getTempFilePaths>;
