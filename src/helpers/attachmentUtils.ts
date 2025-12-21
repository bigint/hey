import { toast } from "sonner";
import generateUUID from "@/helpers//generateUUID";
import type { NewAttachment } from "@/types/misc";
import compressImage from "./compressImage";

const BYTES_IN_MB = 1_000_000;
const MAX_UPLOAD_LIMIT = 8 * BYTES_IN_MB;

export const validateFileSize = (file: File): boolean => {
  const isImage = file.type.includes("image");
  const isVideo = file.type.includes("video");
  const isAudio = file.type.includes("audio");

  if (isImage && file.size > MAX_UPLOAD_LIMIT) {
    toast.error(
      `Image size should be less than ${MAX_UPLOAD_LIMIT / BYTES_IN_MB}MB`
    );
    return false;
  }

  if (isVideo && file.size > MAX_UPLOAD_LIMIT) {
    toast.error(
      `Video size should be less than ${MAX_UPLOAD_LIMIT / BYTES_IN_MB}MB`
    );
    return false;
  }

  if (isAudio && file.size > MAX_UPLOAD_LIMIT) {
    toast.error(
      `Audio size should be less than ${MAX_UPLOAD_LIMIT / BYTES_IN_MB}MB`
    );
    return false;
  }

  return true;
};

export const compressFiles = async (files: File[]): Promise<File[]> => {
  return Promise.all(
    files.map(async (file) => {
      if (file.type.includes("image") && !file.type.includes("gif")) {
        return await compressImage(file, {
          maxSizeMB: 8,
          maxWidthOrHeight: 6000
        });
      }
      return file;
    })
  );
};

export const createPreviewAttachments = (files: File[]): NewAttachment[] => {
  return files.map((file) => ({
    file,
    id: generateUUID(),
    mimeType: file.type,
    previewUri: URL.createObjectURL(file),
    type: file.type.includes("image")
      ? "Image"
      : file.type.includes("video")
        ? "Video"
        : "Audio"
  }));
};
