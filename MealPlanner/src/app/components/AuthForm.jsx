import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
      {/* Toggle Buttons */}
      <div className="bg-gray-100 rounded-xl p-1 mb-6">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setIsSignUp(false)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              !isSignUp
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isSignUp
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="transition-all duration-300 ease-in-out">
        {isSignUp ? <SignUpForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default AuthForm;
