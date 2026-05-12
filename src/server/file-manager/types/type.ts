export interface CreateFileRecord {
  name: string;
  url: string;
  originalName: string;
  fileType: string;
  userId: string;
}

export interface UploadFileParams {
  buffer: Buffer;
  originalFilename: string;
  mimetype: string;
  userId: string;
}
