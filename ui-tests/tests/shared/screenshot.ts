import fse from 'fs-extra';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { ScreenshotFolderName } from './enums';
import { FileStrategy, PngStrategy } from './file-strategy';
import { Constructor } from './types';

export class Screenshot {
  private fileStrategy!: FileStrategy;

  private generateApprovedPath: (filename: string) => string;

  private generateCurrentPath: (filename: string) => string;

  private generateDiffPath: (filename: string) => string;

  constructor(folderPath: string, FileStrategyConstructor: Constructor<FileStrategy> = PngStrategy) {
    const screenshotPath = `screenshots/${folderPath}`;
    const png = new PngStrategy(screenshotPath);
    this.generateDiffPath = png.generatePath.bind(png, ScreenshotFolderName.Diff);
    this.setFileStrategy(new FileStrategyConstructor(screenshotPath));
    this.generateApprovedPath = this.fileStrategy.generatePath.bind(this.fileStrategy, ScreenshotFolderName.Approved);
    this.generateCurrentPath = this.fileStrategy.generatePath.bind(this.fileStrategy, ScreenshotFolderName.Current);
  }

  async generateDiff(name: string) {
    const paths = this.generatePaths(name);
    const approved = this.fileStrategy.readImage(paths.approved);
    const current = this.fileStrategy.readImage(paths.current);
    const { width, height } = current;
    const diffImage = new PNG({ width, height });
    const diff = pixelmatch(current.data, approved.data, diffImage.data, width, height, {
      alpha: 0.9,
      threshold: 0.9,
      includeAA : true
    });

    if (!diff) {
      await fse.remove(paths.current);
      return { diff: 0, name };
    }

    await fse.move(paths.current, paths.approved, { overwrite: true });
    await fse.ensureFile(paths.diff);
    await fse.writeFile(paths.diff, PNG.sync.write(diffImage));

    return { diff, name, paths };
  }

  async test(name: string, fullPage = true) {
    const approvedPath = this.generateApprovedPath(name);
    const hasApprovedImage = await fse.pathExists(approvedPath);

    if (hasApprovedImage) {
      const currentPath = this.generateCurrentPath(name);
      await page.screenshot({ path: currentPath, fullPage });
      return this.generateDiff(name);
    }

    await page.screenshot({ path: approvedPath, fullPage, animations: "disabled" });
    return {
      diff: Infinity,
      name,
      paths: {
        approved: approvedPath,
        current: approvedPath,
        diff: approvedPath,
      },
    };
  }

  setFileStrategy(strategy: FileStrategy) {
    this.fileStrategy = strategy;
  }

  private generatePaths(name: string) {
    return {
      approved: this.generateApprovedPath(name),
      current: this.generateCurrentPath(name),
      diff: this.generateDiffPath(name),
    };
  }
}
