import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    window.location.replace("https://app.stratasurveyor.com/");
  }, []);

  return null;
}
