import { Image } from "@/components/Shared/UI";
import { STATIC_IMAGES_URL } from "@/data/constants";

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <Image
        alt="Logo"
        className="size-28"
        height={112}
        src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
        width={112}
      />
    </div>
  );
};

export default FullPageLoader;
