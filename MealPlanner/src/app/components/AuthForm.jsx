import React, { useState } from 'react';
import { ChefHat, Mail, Lock, Eye, EyeOff, Sparkles, TrendingUp, Users, ArrowRight, CheckCircle, Star, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { saveUserData } from '../../utils/userStorage';
import { doc, setDoc } from 'firebase/firestore';
import { createUser } from '../../api/userApi';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user in backend
        const userData = {
          user_id: userCredential.user.uid,
          email: userCredential.user.email,
          isEmailVerified: userCredential.user.emailVerified
        };
        
        const response = await createUser(userData);
        
        if (response && response.data) {
          const { user_id, pantry_id } = response.data.user_data;
          
          // Save to Firestore
          await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            createdAt: new Date(),
            isEmailVerified: userCredential.user.emailVerified,
            pantry_id: pantry_id
          });
          
          saveUserData({ user_id, pantry_id });
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        saveUserData({
          user_id: userCredential.user.uid,
          email: userCredential.user.email
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: TrendingUp, value: '70%', label: 'Waste Reduced' },
    { icon: Star, value: '4.9', label: 'App Rating' }
  ];

  const features = [
    'Smart pantry management', 
    'Recipe recommendations',
    'Save Money'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-300/10 to-green-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <div className="max-w-lg">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Cooksy
                </h1>
                <p className="text-sm text-gray-600">Smart Kitchen Meal Planner</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="space-y-6">
              <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Kitchen Experience
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands who've revolutionized their cooking with Personalised meal planning, 
                smart pantry management, and zero-waste solutions.
              </p>

              {/* Features List */}
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Hero Image */}
              <div className="relative mb-8">
                <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Smart Kitchen" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">Smart Kitchen Technology</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex space-x-8 pt-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl mb-2">
                      <stat.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AWMP
              </h1>
            </div>

            {/* Form Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isSignUp ? 'Join AWMP' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600">
                  {isSignUp 
                    ? 'Start your smart cooking journey today' 
                    : 'Continue your culinary adventure'
                  }
                </p>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {/* Toggle Sign Up/In */}
                <div className="text-center pt-6 border-t border-gray-100">
                  <span className="text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="ml-2 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>Trusted by 50,000+ home cooks worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
