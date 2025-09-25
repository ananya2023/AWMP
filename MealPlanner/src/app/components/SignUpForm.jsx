import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import GoogleButton from "./GoogleButton";
import app from "../../firebase/firebase";
import { getAuth, createUserWithEmailAndPassword  } from "firebase/auth";
import { createUser } from "../../api/userApi";
import { saveUserData } from "../../utils/userStorage";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);

  const SignUpWithGoogle = () => {  
    console.log("hey")
  }

   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Sign up attempt:", { email, password });

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Firebase user created:", user);

        const userData = {
          user_id: user.uid,
          email: user.email,
          isEmailVerified: user.emailVerified
        };
        console.log(userData);

        const response = await createUser(userData);
        console.log("Backend Response:", response);

        if (response && response.data) {
          const user_data = response.data;
          const {user_id , pantry_id } = user_data?.user_data;

          saveUserData({
            user_id,
            pantry_id
          });

          console.log("User data saved to localStorage");
        } else {
          console.error("Failed to retrieve pantry_id from backend response");
        }

      } catch (error) {
        console.log(error.code, error.message);
      }
};

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
        Sign Up
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-lg hover:shadow-xl"
        >
          Create Account
        </button>
      </form>

      {/* OR Divider */}
      <div className="mt-6 mb-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>
      </div>

      {/* Google Button */}
      <div className="mt-4">
        <GoogleButton email={email} />
      </div>
    </div>
  );
};

export default SignUpForm;
