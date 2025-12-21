import { immutable } from "@lens-chain/storage-client";
import { CHAIN } from "@/data/constants";
import { storageClient } from "./storageClient";

interface UploadResult {
  mimeType: string;
  uri: string;
}

const FALLBACK_TYPE = "image/jpeg";

const uploadToIPFS = async (
  data: FileList | File[]
): Promise<UploadResult[]> => {
  try {
    const files = Array.from(data) as File[];

    const attachments = await Promise.all(
      files.map(async (file: File) => {
        const storageNodeResponse = await storageClient.uploadFile(file, {
          acl: immutable(CHAIN.id)
        });

        return {
          mimeType: file.type || FALLBACK_TYPE,
          uri: storageNodeResponse.uri
        };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

export const uploadFileToIPFS = async (file: File): Promise<UploadResult> => {
  try {
    const ipfsResponse = await uploadToIPFS([file]);
    const metadata = ipfsResponse[0];

    return { mimeType: file.type || FALLBACK_TYPE, uri: metadata.uri };
  } catch {
    return { mimeType: file.type || FALLBACK_TYPE, uri: "" };
  }
};

export default uploadToIPFS;
