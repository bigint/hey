import type { AccountFragment, PayableAmount } from "@hey/indexer";
import { Link } from "react-router";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { NotificationAccountName } from "./Account";

interface AggregatedNotificationTitleProps {
  firstAccount: AccountFragment;
  linkToType: string;
  text: string;
  type?: string;
  amount?: PayableAmount;
}

const AggregatedNotificationTitle = ({
  firstAccount,
  linkToType,
  text,
  type,
  amount
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
      {amount && (
        <span className="font-bold">
          {" "}
          {amount.value} {amount.asset.symbol}
        </span>
      )}
    </div>
  );
};

export default AggregatedNotificationTitle;
