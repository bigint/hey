import { Link } from "react-router";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import type { AccountFragment } from "@/indexer/generated";
import { NotificationAccountName } from "./Account";

interface AggregatedNotificationTitleProps {
  firstAccount: AccountFragment;
  linkToType: string;
  text: string;
  type?: string;
}

const AggregatedNotificationTitle = ({
  firstAccount,
  linkToType,
  text,
  type
}: AggregatedNotificationTitleProps) => {
  return (
    <div>
      <NotificationAccountName account={firstAccount} />
      <span> {text} </span>
      {type && (
        <Link
          className="outline-hidden hover:underline focus:underline"
          onClick={stopEventPropagation}
          to={linkToType}
        >
          {type.toLowerCase()}
        </Link>
      )}
    </div>
  );
};

export default AggregatedNotificationTitle;
