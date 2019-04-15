import {DomSanitizer, SafeUrl} from '@angular/platform-browser';


export class MediaBlobImage {

  private _name: string;
  private _url: string;
  private _safeUrl: SafeUrl;
  private _width: number;
  private _height: number;
  private _loaded: boolean;

  constructor(sanitizer: DomSanitizer, blob: Blob, name: string, maxWidth?: number) {
    this._loaded = false;
    this._url = URL.createObjectURL(blob);
    this._name = name;
    this._safeUrl = sanitizer.bypassSecurityTrustUrl(this._url);
    this.setImageSize(maxWidth);
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get name() {
    return this._name;
  }

  get url() {
    return this._safeUrl;
  }

  get loaded() {
    return this._loaded;
  }

  private setImageSize(maxWidth) {
    const image = new Image();
    image.onload = () => {
      if (maxWidth) {
        if (image.naturalWidth > maxWidth) {
          const factor = maxWidth / image.naturalWidth;
          const w = Math.floor(image.naturalWidth * factor);
          const h = Math.floor(image.naturalHeight * factor);
          this.setSize(w, h);
        } else {
          this.setSize(image.naturalWidth, image.naturalHeight);
        }
      } else {
        this.setSize(image.naturalWidth, image.naturalHeight);
      }
      this._loaded = true;
    }
    image.src = this._url;
  }

  private setSize(width, height) {
    this._width = width;
    this._height = height;
  }

}
