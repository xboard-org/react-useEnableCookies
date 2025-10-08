import { useCallback, useEffect, useRef, useState } from "react";

/*
Reference: https://webkit.org/blog/11545/updates-to-the-storage-access-api/

Tested on:
- Environments:
  - Desktop Chrome Normal
  - Desktop Chrome Private
  - Android Chrome Normal
  - Android Chrome Private
  - Android xPortal
  - iOS Chrome Normal
  - iOS Chrome Private
  - iOS Safari Normal
  - iOS Chrome Private
  - iOS xPortal
- Initial states:
  - No access
  - Access
*/

export const useEnableCookies = ({
  onEnabled,
}: {
  onEnabled: () => unknown;
}) => {
  const [enablementStep, setEnablementStep] = useState<1 | 2 | 3 | 4>();
  const onEnabledRef = useRef(onEnabled);
  onEnabledRef.current = onEnabled;

  const enablementFailed = hasEnablementFailed();

  const onClickOpen = useCallback(() => {
    setInteracted();
    setEnablementStep(3);
    open(location.href);
  }, []);

  const onClickWhitelist = useCallback(() => {
    history.back();
    close();
  }, []);

  const onClickEnable = useCallback(() => {
    requestCookiesAccess().then((hasAccess) => {
      if (hasAccess) {
        onEnabledRef.current();
      } else {
        unsetInteracted();
        setEnablementFailed();
        location.reload();
      }
    });
  }, []);

  useEffect(() => {
    if (self !== top) {
      requestCookiesAccess().then((hasAccess) => {
        if (hasAccess) {
          onEnabledRef.current();
          setEnablementStep(4);
        } else if (hasInteracted()) {
          setEnablementStep(3);
        } else {
          setEnablementStep(1);
        }
      });
    } else {
      setCookie(); // cf 4 of How-To #1
      setEnablementStep(2);
    }
  }, []);

  return {
    enablementStep,
    enablementFailed,
    onClickOpen,
    onClickWhitelist,
    onClickEnable,
  };
};

const hasEnablementFailed = () =>
  new URLSearchParams(location.search).get(failedKey) === failedValue;

const setEnablementFailed = () => {
  const url = new URL(location.href);
  url.searchParams.set(failedKey, failedValue);
  history.replaceState(null, "", url);
};

const requestCookiesAccess = async () => {
  try {
    await document.requestStorageAccess();
  } catch {
    //
  }
  return hasCookiesAccess();
};

const hasCookiesAccess = () => {
  setCookie();
  return document.cookie.includes(`${storageKey}=${storageValue}`);
};

const setCookie = () => {
  document.cookie = `${storageKey}=${storageValue}; SameSite=None; Secure`;
};

const hasInteracted = () => {
  return localStorage.getItem(storageKey) === storageValue;
};

const setInteracted = () => {
  localStorage.setItem(storageKey, storageValue);
};

const unsetInteracted = () => {
  localStorage.removeItem(storageKey);
};

const failedKey = "failed";
const failedValue = "true";

const storageKey = "__useEnableCookies";
const storageValue = "1";
