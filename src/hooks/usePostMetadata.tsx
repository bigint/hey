import {
  article,
  audio,
  image,
  textOnly,
  video
} from "@lens-protocol/metadata";
import { useCallback } from "react";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import { usePostLicenseStore } from "@/store/non-persisted/post/usePostLicenseStore";
import { usePostVideoStore } from "@/store/non-persisted/post/usePostVideoStore";
import { usePostAudioStore } from "../store/non-persisted/post/usePostAudioStore";

interface UsePostMetadataProps {
  baseMetadata: any;
}

const usePostMetadata = () => {
  const { videoDurationInSeconds, videoThumbnail } = usePostVideoStore();
  const { audioPost } = usePostAudioStore();
  const { license } = usePostLicenseStore();
  const { attachments } = usePostAttachmentStore();

  const assertUploadedAttachment = (
    attachment: (typeof attachments)[number] | undefined
  ) => {
    if (!attachment?.uri || !attachment.mimeType) {
      throw new Error("Please wait for attachments to finish uploading.");
    }

    return { ...attachment, uri: attachment.uri };
  };

  const formatAttachments = () =>
    attachments.slice(1).map((attachment) => ({
      item: assertUploadedAttachment(attachment).uri,
      type: attachment.mimeType
    }));

  const getVideoDuration = () => {
    const duration = Number.parseFloat(videoDurationInSeconds);
    if (!videoThumbnail.url || !Number.isFinite(duration) || duration <= 0) {
      throw new Error("Add a valid video thumbnail before posting.");
    }

    return duration;
  };

  const getMetadata = useCallback(
    ({ baseMetadata }: UsePostMetadataProps) => {
      const primaryAttachment = attachments[0];
      const hasAttachments = Boolean(primaryAttachment);
      const isImage = primaryAttachment?.type === "Image";
      const isAudio = primaryAttachment?.type === "Audio";
      const isVideo = primaryAttachment?.type === "Video";

      if (!hasAttachments) {
        return baseMetadata.content?.length > 2000
          ? article(baseMetadata)
          : textOnly(baseMetadata);
      }

      const attachmentsToBeUploaded = formatAttachments();
      const uploadedPrimaryAttachment =
        assertUploadedAttachment(primaryAttachment);

      if (isImage) {
        return image({
          ...baseMetadata,
          ...(attachmentsToBeUploaded.length > 0 && {
            attachments: attachmentsToBeUploaded
          }),
          image: {
            ...(license && { license }),
            item: uploadedPrimaryAttachment.uri,
            type: uploadedPrimaryAttachment.mimeType
          }
        });
      }

      if (isAudio) {
        return audio({
          ...baseMetadata,
          ...(attachmentsToBeUploaded.length > 0 && {
            attachments: attachmentsToBeUploaded
          }),
          audio: {
            ...(audioPost.artist && {
              artist: audioPost.artist
            }),
            cover: audioPost.cover,
            item: uploadedPrimaryAttachment.uri,
            type: uploadedPrimaryAttachment.mimeType,
            ...(license && { license })
          }
        });
      }

      if (isVideo) {
        return video({
          ...baseMetadata,
          ...(attachmentsToBeUploaded.length > 0 && {
            attachments: attachmentsToBeUploaded
          }),
          video: {
            cover: videoThumbnail.url,
            duration: getVideoDuration(),
            item: uploadedPrimaryAttachment.uri,
            type: uploadedPrimaryAttachment.mimeType,
            ...(license && { license })
          }
        });
      }

      return null;
    },
    [attachments, videoDurationInSeconds, audioPost, videoThumbnail, license]
  );

  return getMetadata;
};

export default usePostMetadata;
