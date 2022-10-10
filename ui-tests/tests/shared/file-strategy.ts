import fse from 'fs-extra';
import path from 'path';
import { PNG, PNGWithMetadata } from 'pngjs';
import { FileExtension } from './file-extension';

export abstract class FileStrategy {
  protected fileExtension!: FileExtension;

  protected folderPath!: string;

  constructor(extension: string, folderPath: string) {
    this.setFileExtension(extension);
    this.setFolderPath(folderPath);
  }

  generatePath(folder: string, filename: string) {
    const filenameWithExtension = this.fileExtension.add(`${filename}.${deviceName}`);
    return path.join(this.folderPath, folder, filenameWithExtension);
  }

  abstract readImage(filepath: string): FileMetadata;

  setFileExtension(extension: string) {
    this.fileExtension = new FileExtension(extension);
  }

  setFolderPath(folderPath: string) {
    this.folderPath = folderPath;
  }
}

export class PngStrategy extends FileStrategy {
  constructor(folderPath: string) {
    super('png', folderPath);
  }

  // eslint-disable-next-line class-methods-use-this
  readImage(filepath: string) {
    return PNG.sync.read(fse.readFileSync(filepath));
  }
}

export type FileMetadata = PNGWithMetadata;
