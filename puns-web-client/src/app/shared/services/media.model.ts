
export class MediaUploadResponse {
  resourceId: string;
  name: string;
  creationTime: string;
}

export class MediaDownloadResponse {
  blob: Blob;
  name: string;

  constructor(blob: Blob, name: string) {
    this.blob = blob;
    this.name = name;
  }
}
