import { useEffect } from "react";
import { Localstorage } from "@/data/storage";

const ReloadTabsWatcher = () => {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === Localstorage.ReloadTabs) {
        location.reload();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return null;
};

export default ReloadTabsWatcher;
