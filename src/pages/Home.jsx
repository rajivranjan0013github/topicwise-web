import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Logo from '@/components/Logo'

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/5">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <Link to="/" className="flex items-center gap-4 w-fit group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-2xl blur-xl group-hover:animate-pulse"></div>
              <img 
                src="/app-icon.png" 
                alt="TopicWise Logo" 
                className="w-8 h-8 object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
            <Logo className="h-8 w-auto text-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="rounded-2xl max-w-md w-full">
            <CardHeader className="text-center space-y-6">
              {/* App Icon/Logo */}
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-3xl blur-xl animate-pulse"></div>
                  <img 
                    src="/src/assets/app-icon.png" 
                    alt="App Icon" 
                    className="w-24 h-24 object-cover rounded-2xl relative z-10 drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* App Info */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-foreground">TopicWise</h1>
                <p className="text-muted-foreground text-lg">Please click to download the app</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Download Button */}
              <div className="pt-4">
                <button 
                  className="w-full bg-green-600 hover:bg-green-500 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-105 border border-green-500/20 flex items-center justify-center gap-3"
                  onClick={() => window.location.href = `https://play.google.com/store/apps/details?id=com.topicwise.apps&pcampaignid=web_share`}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Download from Play Store
                </button>
              </div>

              {/* Additional Info */}
              <div className="pt-4 text-sm text-muted-foreground text-center">
                <p>Available for Android devices</p>
                <p className="mt-1">Free download • No ads • Secure</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Home