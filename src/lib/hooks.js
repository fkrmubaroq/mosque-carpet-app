import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { getSetting } from "./api/setting";
import { getUserLogin } from "./api/users";
import { getInformationIp, visitorClick, visitorPage } from "./api/visitor";
import { adminUsersQuery, landingPageQuery, settingQuery } from "./queryKeys";
import { debounce, getCookie, setCookie } from "./utils";

export function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) return;
        handler();
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
}

export function useMobile() {
  const [mobileMd, setMobileMdWidth] = useState(false);
  const [mobileSm, setMobileSm] = useState(false);
  const mobile = {
    mobileMd,
    mobileSm,
  };

  useEffect(() => {
    const checkScreenWidth = () => {
      const width = window.innerWidth;
      const mobileMdWidth = width <= 968;
      const mobileSmWidth = width <= 640;
      if (mobileSmWidth) {
        setMobileSm(true);
        setMobileMdWidth(false);
        return;
      }
      setMobileSm(false);
      setMobileMdWidth(mobileMdWidth);
    };
    const debounceCheckScreenWidth = debounce(checkScreenWidth);
    debounceCheckScreenWidth();
    window.addEventListener("resize", debounceCheckScreenWidth);
    return () => window.removeEventListener("resize", debounceCheckScreenWidth);
  }, [mobile]);

  return { mobileMd, mobileSm };
}
export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(state => !state), []);
  return [state, toggle];
}


export function useCookie(key) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const cookie = getCookie(key);
    setData(JSON.parse(cookie) || null);
  }, [key]);

  const setCookieValue = (value) => {
    setData(value);
    setCookie(key, JSON.stringify(value));
  }
  return [data, setCookieValue];
}

export function useKeypress(keyCodes) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    document.onkeydown = (e) => {
      const code = e.key || e.keyCode || e.which;
      if (Array.isArray(keyCodes) && keyCodes.includes(code)) {
        setActive(true);
        return;
      }
      setActive(keyCodes === code);
    }

    document.onkeyup = (e) => {
      const code = e.key || e.keyCode || e.which;
      if (Array.isArray(keyCodes) && keyCodes.includes(code)) {
        setActive(false);
        return;
      }
    }
    return () => {
      document.onkeydown = null;
      document.onkeyup = null;
    }
  }, []);
  return active;
}

export function useSetting() {
  const { data } = useQuery({
    staleTime: Infinity,
    queryKey: settingQuery.admin,
    queryFn: async () => {
      const response = await getSetting();
      return response.data?.data || {};
    }
  });
  return { data };
}

export function useUserData() {
  const { data } = useQuery({
    staleTime: Infinity,
    queryKey: adminUsersQuery.userData,
    queryFn: async () => {
      const response = await getUserLogin();
      return response.data?.data || {};
    }
  });
  return { data };
}

export function useTrackPage(type) {
  const { data: ipAddress } = useQuery({
    queryKey: landingPageQuery.informationIp,
    queryFn: async () => {
      const response = await getInformationIp();
      const json = await response.json();
      return json?.ip || null;
    }
  });

  const { mutate: trackPage } = useMutation({
    mutationKey: landingPageQuery.visitorPage,
    mutationFn: async () => {
      const slug = window.location.pathname.replace("/", "");

      const response = await visitorPage({ type, slug }, ipAddress);
      return response;
    }
  });

  useEffect(() => {
    if (!ipAddress) return;
    trackPage();
  }, [ipAddress]);
}

export function useApi() {
  const { data: ipAddress } = useQuery({
    queryKey: landingPageQuery.informationIp,
    queryFn: async () => {
      const response = await getInformationIp();
      const json = await response.json();
      return json?.ip || null;
    }
  });

  return ipAddress;
}

export function useButtonlick() {

  const { mutate: trackButtonClick } = useMutation({
    mutationKey: landingPageQuery.buttonclick,
    mutationFn: async (ipAddress) => {
      const response = await visitorClick(ipAddress);
      return response;
    }
  });

  return { trackButtonClick };
}