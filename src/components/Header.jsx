import React from 'react'
import { Wind, User, LogOut, Plus, Home } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Header({ session, onNavigate }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    onNavigate('home')
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Wind className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Whinds</h1>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>
            
            {session && (
              <button
                onClick={() => onNavigate('editor')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Plus className="h-5 w-5" />
                <span>New Article</span>
              </button>
            )}
            
            {session ? (
              <>
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
