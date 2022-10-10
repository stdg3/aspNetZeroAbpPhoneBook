export class FileExtension {
  private extension!: string;

  private extensionRegex!: RegExp;

  constructor(extension: string) {
    this.setExtension(extension);
  }

  add(filepath: string) {
    return this.remove(filepath) + this.extension;
  }

  remove(filepath: string) {
    return filepath.replace(this.extensionRegex, '');
  }

  setExtension(extension: string) {
    this.extension = `.${extension}`.toLowerCase().replace('..', '.');
    this.extensionRegex = new RegExp(`${this.extension}$`);
  }
}
