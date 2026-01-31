/**
 * Landing page - Evolution of Todo App
 * Always shows home page with Sign In & Sign Up options
 */

import Link from "next/link";

export default function Home() {

  return (
    <div className="min-h-screen bg-cosmic relative overflow-hidden">
      {/* Animated orbs */}
      <div className="orb orb-1 top-20 left-10 opacity-60"></div>
      <div className="orb orb-2 bottom-20 right-10 opacity-50"></div>
      <div className="orb orb-3 top-1/2 left-1/3 opacity-40"></div>

      {/* Glowing rings */}
      <div className="ring-glow top-1/4 -left-64 opacity-30"></div>
      <div className="ring-glow bottom-1/4 -right-64 opacity-20" style={{ animationDelay: '2s' }}></div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12" style={{ perspective: '1000px' }}>
        <div className="max-w-xl w-full">
          {/* 3D Card */}
          <div className="card-3d card-float p-8 md:p-12 opacity-0 animate-fade-in-up-3d" style={{ animationFillMode: 'forwards' }}>
            {/* Holographic overlay */}
            <div className="absolute inset-0 rounded-3xl holographic pointer-events-none"></div>

            {/* Logo */}
            <div className="flex justify-center mb-8 relative">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>

                {/* Logo container */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 0 40px rgba(139, 92, 246, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.1)'
                  }}>
                  <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-rainbow">
                Evolution of Todo
              </h1>
              <p className="text-xl text-white/70">
                Phase 2 - Web Application
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Link href="/signup" className="block">
                <button className="w-full btn-3d text-lg">
                  Sign Up
                </button>
              </Link>

              <Link href="/signin" className="block">
                <button className="w-full btn-neon text-lg">
                  <span>Sign In</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/40 text-sm mt-8">
            Hackathon Project - Quarter 4
          </p>
        </div>
      </div>
    </div>
  );
}
