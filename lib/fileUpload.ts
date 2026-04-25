/** Maximum size for user-uploaded images (2 MiB). */
export const MAX_IMAGE_FILE_BYTES = 2 * 1024 * 1024;

export function isImageFileSizeValid(file: File): boolean {
  return file.size <= MAX_IMAGE_FILE_BYTES;
}

export function getImageFileTooLargeMessage(): string {
  return 'This file is too large. Please choose an image under 2 MB.';
}
