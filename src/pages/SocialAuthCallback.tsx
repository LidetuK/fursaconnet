import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SocialAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Processing Google login...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const email = params.get("email");

    if (access_token && email) {
      // Save tokens/user info as needed (localStorage, context, or call your backend)
      setStatus("success");
      setMessage("Google login successful!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } else {
      setStatus("error");
      setMessage("Google login failed: Missing data.");
    }
  }, [navigate]);

  return (
    <div>
      <h2>{message}</h2>
      {status === "processing" && <p>Loading...</p>}
      {status === "success" && <p>Redirecting to dashboard...</p>}
      {status === "error" && <p>Please try again.</p>}
    </div>
  );
}