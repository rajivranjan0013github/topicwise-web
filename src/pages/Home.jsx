import React from 'react'
import appIcon from '../assets/app-icon.png'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* App Icon/Logo */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-3xl blur-xl animate-pulse"></div>
            <img 
              src={appIcon} 
              alt="App Icon" 
              className="w-24 h-24 object-cover rounded-2xl relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* App Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">TopicWise</h1>
          <p className="text-gray-300 text-lg">Please click to download the app</p>
        </div>

        {/* Download Button */}
        <div className="pt-4">
          <button 
            className="bg-green-600 hover:bg-green-500 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-105 border border-green-500/20 flex items-center gap-3 mx-auto"
            onClick={() => window.location.href = `https://play.google.com/store/apps/details?id=com.topicwise.apps&pcampaignid=web_share`}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            Download from Play Store
          </button>
        </div>

        {/* Additional Info */}
        <div className="pt-8 text-sm text-gray-400">
          <p>Available for Android devices</p>
          <p className="mt-1">Free download • No ads • Secure</p>
        </div>
      </div>
    </div>
  )
}

export default Home