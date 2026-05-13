import { CheckCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";
import type { ChangeEvent } from "react";
import { memo, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import ThumbnailsShimmer from "@/components/Shared/Shimmer/ThumbnailsShimmer";
import { Spinner } from "@/components/Shared/UI";
import generateVideoThumbnails from "@/helpers/generateVideoThumbnails";
import getFileFromDataURL from "@/helpers/getFileFromDataURL";
import { uploadFileToIPFS } from "@/helpers/uploadToIPFS";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import {
  DEFAULT_VIDEO_THUMBNAIL,
  usePostVideoStore
} from "@/store/non-persisted/post/usePostVideoStore";

const DEFAULT_THUMBNAIL_INDEX = 0;
export const THUMBNAIL_GENERATE_COUNT = 4;

interface Thumbnail {
  blobUrl: string;
  decentralizedUrl: string;
}

const revokeThumbnailBlobUrls = (
  thumbnails: Thumbnail[],
  retainedBlobUrls = new Set<string>()
) => {
  for (const { blobUrl } of thumbnails) {
    if (blobUrl.startsWith("blob:") && !retainedBlobUrls.has(blobUrl)) {
      URL.revokeObjectURL(blobUrl);
    }
  }
};

const ChooseThumbnail = () => {
  const inputId = useId();
  const thumbnailsRef = useRef<Thumbnail[]>([]);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1);
  const { attachments } = usePostAttachmentStore();
  const { setVideoThumbnail, videoThumbnail } = usePostVideoStore();
  const { file } = attachments[0];

  const setThumbnailList = (thumbnailList: Thumbnail[]) => {
    const retainedBlobUrls = new Set(
      thumbnailList
        .map(({ blobUrl }) => blobUrl)
        .filter((blobUrl) => blobUrl.startsWith("blob:"))
    );
    revokeThumbnailBlobUrls(thumbnailsRef.current, retainedBlobUrls);
    thumbnailsRef.current = thumbnailList;
    setThumbnails(thumbnailList);
  };

  const uploadThumbnailToStorageNode = async (fileToUpload: File) => {
    setVideoThumbnail({ ...videoThumbnail, uploading: true });
    try {
      const result = await uploadFileToIPFS(fileToUpload);
      setVideoThumbnail({
        mimeType: fileToUpload.type || "image/jpeg",
        uploading: false,
        url: result.uri
      });

      return result;
    } catch (error) {
      setVideoThumbnail(DEFAULT_VIDEO_THUMBNAIL);
      toast.error("Failed to upload thumbnail");
      throw error;
    }
  };

  const handleSelectThumbnail = (index: number, thumbnailList = thumbnails) => {
    const thumbnail = thumbnailList[index];
    if (!thumbnail) {
      setSelectedThumbnailIndex(-1);
      return;
    }

    setSelectedThumbnailIndex(index);
    if (thumbnail.decentralizedUrl === "") {
      setVideoThumbnail({ ...videoThumbnail, uploading: true });
      getFileFromDataURL(
        thumbnail.blobUrl,
        "thumbnail.jpeg",
        async (file: File) => {
          try {
            const result = await uploadThumbnailToStorageNode(file);
            setThumbnails((current) =>
              current.map((thumbnail, i) =>
                i === index
                  ? { ...thumbnail, decentralizedUrl: result.uri }
                  : thumbnail
              )
            );
            thumbnailsRef.current = thumbnailsRef.current.map((thumbnail, i) =>
              i === index
                ? { ...thumbnail, decentralizedUrl: result.uri }
                : thumbnail
            );
          } catch {
            setSelectedThumbnailIndex(-1);
          }
        }
      );
    } else {
      setVideoThumbnail({
        ...videoThumbnail,
        uploading: false,
        url: thumbnail.decentralizedUrl
      });
    }
  };

  const generateThumbnails = async (fileToGenerate: File) => {
    try {
      setIsGenerating(true);
      const thumbnailArray = await generateVideoThumbnails(
        fileToGenerate,
        THUMBNAIL_GENERATE_COUNT
      );
      if (!thumbnailArray.length) {
        throw new Error("Could not generate thumbnails");
      }

      const thumbnailList: Thumbnail[] = [];
      for (const thumbnailBlob of thumbnailArray) {
        thumbnailList.push({ blobUrl: thumbnailBlob, decentralizedUrl: "" });
      }
      setThumbnailList(thumbnailList);
      handleSelectThumbnail(DEFAULT_THUMBNAIL_INDEX, thumbnailList);
    } catch {
      setThumbnailList([]);
      setVideoThumbnail(DEFAULT_VIDEO_THUMBNAIL);
      toast.error("Failed to generate video thumbnails");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (file) {
      generateThumbnails(file);
    }
    return () => {
      setSelectedThumbnailIndex(-1);
      revokeThumbnailBlobUrls(thumbnailsRef.current);
      thumbnailsRef.current = [];
      setThumbnails([]);
    };
  }, [file]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      try {
        setImageUploading(true);
        setSelectedThumbnailIndex(-1);
        const file = event.target.files[0];
        const result = await uploadThumbnailToStorageNode(file);
        const preview = URL.createObjectURL(file);
        const thumbnailList = [
          { blobUrl: preview, decentralizedUrl: result.uri },
          ...thumbnails
        ];
        setThumbnailList(thumbnailList);
        handleSelectThumbnail(0, thumbnailList);
      } catch {
        toast.error("Failed to upload thumbnail");
      } finally {
        setImageUploading(false);
      }
    }
  };

  const isUploading = videoThumbnail.uploading;

  return (
    <div className="mt-5">
      <b>Choose Thumbnail</b>
      <div className="mt-1 grid grid-cols-3 gap-3 py-0.5 md:grid-cols-5">
        <label
          className="flex h-24 w-full max-w-32 flex-none cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700"
          htmlFor={inputId}
        >
          <input
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            id={inputId}
            onChange={handleUpload}
            type="file"
          />
          {imageUploading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <PhotoIcon className="mb-1 size-5" />
              <span className="text-sm">Upload</span>
            </>
          )}
        </label>
        {!thumbnails.length && isGenerating ? <ThumbnailsShimmer /> : null}
        {!thumbnails.length && !isGenerating ? (
          <div className="flex h-24 items-center px-2 text-gray-500 text-sm">
            Upload a thumbnail to continue.
          </div>
        ) : null}
        {thumbnails.map(({ blobUrl, decentralizedUrl }, index) => {
          const isSelected = selectedThumbnailIndex === index;
          const isUploaded = decentralizedUrl === videoThumbnail.url;

          return (
            <button
              className="relative"
              disabled={isUploading}
              key={`${blobUrl}_${index}`}
              onClick={() => handleSelectThumbnail(index)}
              type="button"
            >
              <img
                alt="thumbnail"
                className="h-24 w-full rounded-xl border border-gray-200 object-cover dark:border-gray-700"
                draggable={false}
                src={blobUrl}
              />
              {decentralizedUrl && isSelected && isUploaded ? (
                <div className="absolute inset-0 grid place-items-center rounded-xl bg-gray-100/10">
                  <CheckCircleIcon className="size-6" />
                </div>
              ) : null}
              {isUploading && isSelected && (
                <div className="absolute inset-0 grid place-items-center rounded-xl bg-gray-100/10 backdrop-blur-md">
                  <Spinner size="sm" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ChooseThumbnail);
