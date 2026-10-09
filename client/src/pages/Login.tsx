import { NETWORK_LOGIN_URL } from "@shared/network/country";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    window.location.replace(NETWORK_LOGIN_URL);
  }, []);

  return null;
}
