import NewPublication from "@/components/Composer/NewPublication";
import SuperFollow from "@/components/Shared/Account/SuperFollow";
import SwitchAccounts from "@/components/Shared/Account/SwitchAccounts";
import TopUp from "@/components/Shared/Account/TopUp";
import { useSignupStore } from "@/components/Shared/Auth/Signup";
import SuperJoin from "@/components/Shared/Group/SuperJoin";
import ReportAccount from "@/components/Shared/Modal/ReportAccount";
import ReportPost from "@/components/Shared/Modal/ReportPost";
import { Modal } from "@/components/Shared/UI";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useFundModalStore } from "@/store/non-persisted/modal/useFundModalStore";
import { useNewPostModalStore } from "@/store/non-persisted/modal/useNewPostModalStore";
import { useReportAccountModalStore } from "@/store/non-persisted/modal/useReportAccountModalStore";
import { useReportPostModalStore } from "@/store/non-persisted/modal/useReportPostModalStore";
import { useSuperFollowModalStore } from "@/store/non-persisted/modal/useSuperFollowModalStore";
import { useSuperJoinModalStore } from "@/store/non-persisted/modal/useSuperJoinModalStore";
import { useSwitchAccountModalStore } from "@/store/non-persisted/modal/useSwitchAccountModalStore";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import {
  DEFAULT_AUDIO_POST,
  usePostAudioStore
} from "@/store/non-persisted/post/usePostAudioStore";
import { usePostLicenseStore } from "@/store/non-persisted/post/usePostLicenseStore";
import { usePostRulesStore } from "@/store/non-persisted/post/usePostRulesStore";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import {
  DEFAULT_VIDEO_THUMBNAIL,
  usePostVideoStore
} from "@/store/non-persisted/post/usePostVideoStore";
import Auth from "./Auth";

const GlobalModals = () => {
  const { setShow: setShowSwitchAccountModal, show: showSwitchAccountModal } =
    useSwitchAccountModalStore();
  const { show: showNewPostModal, setShow: setShowNewPostModal } =
    useNewPostModalStore();
  const { editingPost, setEditingPost, setQuotedPost, setPostContent } =
    usePostStore();
  const { setAttachments } = usePostAttachmentStore();
  const { setAudioPost } = usePostAudioStore();
  const { setLicense } = usePostLicenseStore();
  const { setRules } = usePostRulesStore();
  const { setVideoDurationInSeconds, setVideoThumbnail } = usePostVideoStore();
  const { reset: resetCollectSettings } = useCollectActionStore();
  const { authModalType, showAuthModal, setShowAuthModal } =
    useAuthModalStore();
  const {
    reportingAccount,
    showReportAccountModal,
    setShowReportAccountModal
  } = useReportAccountModalStore();
  const { reportingPostId, showReportPostModal, setShowReportPostModal } =
    useReportPostModalStore();
  const { showFundModal, setShowFundModal } = useFundModalStore();
  const { showSuperJoinModal, setShowSuperJoinModal, superJoiningGroup } =
    useSuperJoinModalStore();
  const {
    showSuperFollowModal,
    setShowSuperFollowModal,
    superFollowingAccount
  } = useSuperFollowModalStore();
  const { screen: signupScreen } = useSignupStore();

  const authModalTitle =
    authModalType === "signup"
      ? signupScreen === "choose"
        ? "Signup"
        : null
      : "Login";

  const resetNewPostModalState = () => {
    setShowNewPostModal(false);
    setPostContent("");
    setEditingPost(undefined);
    setQuotedPost(undefined);
    setAttachments([]);
    setRules(undefined);
    setVideoThumbnail(DEFAULT_VIDEO_THUMBNAIL);
    setVideoDurationInSeconds("");
    setAudioPost(DEFAULT_AUDIO_POST);
    setLicense(null);
    resetCollectSettings();
  };

  return (
    <>
      <Modal
        onClose={() => setShowReportPostModal(false, reportingPostId)}
        show={showReportPostModal}
        title="Report Post"
      >
        <ReportPost postId={reportingPostId} />
      </Modal>
      <Modal
        onClose={() => setShowReportAccountModal(false, reportingAccount)}
        show={showReportAccountModal}
        title="Report account"
      >
        <ReportAccount account={reportingAccount} />
      </Modal>
      <Modal
        onClose={() => setShowSwitchAccountModal(false)}
        show={showSwitchAccountModal}
        size="xs"
        title="Switch Account"
      >
        <SwitchAccounts />
      </Modal>
      <Modal
        onClose={() => setShowAuthModal(false, authModalType)}
        show={showAuthModal}
        title={authModalTitle}
      >
        <Auth />
      </Modal>
      <Modal
        onClose={resetNewPostModalState}
        show={showNewPostModal}
        size="md"
        title={editingPost ? "Edit post" : "Create post"}
      >
        <NewPublication className="!rounded-b-xl !rounded-t-none border-none" />
      </Modal>
      <Modal
        onClose={() => setShowFundModal({ showFundModal: false })}
        show={showFundModal}
        title="Top-up your account"
      >
        <TopUp />
      </Modal>
      <Modal
        onClose={() => setShowSuperJoinModal(false, superJoiningGroup)}
        show={showSuperJoinModal}
        title="Super Join"
      >
        <SuperJoin />
      </Modal>
      <Modal
        onClose={() => setShowSuperFollowModal(false, superFollowingAccount)}
        show={showSuperFollowModal}
        title="Super Follow"
      >
        <SuperFollow />
      </Modal>
    </>
  );
};

export default GlobalModals;
