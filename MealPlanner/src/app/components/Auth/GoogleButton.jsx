import React, { useState } from "react";
import provider from "../../../firebase/googleAuthProvider";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { syncUser } from "../../../api/userApi";
import { saveUserData } from "../../../utils/userStorage";
import { Loader2 } from "lucide-react";

const GoogleButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  //wiil cahge this erro messages later
  const getFriendlyErrorMessage = (code, message) => {
    switch (code) {
      case "auth/operation-not-allowed":
        return "Google Sign-In is disabled in Firebase Console. Please enable Google under Authentication > Sign-in method.";
      case "auth/unauthorized-domain":
        return "This domain is not authorized for Google Sign-In in Firebase Console Settings.";
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed before completing.";
      case "auth/popup-blocked":
        return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      case "auth/cancelled-popup-request":
        return "Multiple sign-in popups opened. Please try again.";
      default:
        return message || "Failed to sign in with Google. Please try again.";
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Google Popup Sign In
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. Single Backend Sync Endpoint (Upsert User & Pantry)
      const response = await syncUser({
        user_id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isEmailVerified: user.emailVerified
      });

      const syncedUserData = response?.data?.user_data;
      const pantryId = syncedUserData?.pantry_id || null;

      // 3. Save User Session Locally
      saveUserData({
        user_id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        pantry_id: pantryId
      });

      // 4. Redirect to Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setErrorMsg(getFriendlyErrorMessage(error.code, error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {errorMsg && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
          {errorMsg}
        </div>
      )}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-200 rounded-2xl text-gray-700 font-semibold bg-white hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GoogleButton;


