import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import Home from './components/Home'
import Article from './components/Article'
import ArticleEditor from './components/ArticleEditor'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'

function App() {
  const [session, setSession] = useState(null)
  const [currentView, setCurrentView] = useState('home')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleNavigation = (view, article = null) => {
    setCurrentView(view)
    setSelectedArticle(article)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} onNavigate={handleNavigation} />
      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <Home session={session} onNavigate={handleNavigation} />
        )}
        {currentView === 'article' && (
          <Article 
            article={selectedArticle} 
            session={session} 
            onNavigate={handleNavigation} 
          />
        )}
        {currentView === 'editor' && (
          <ArticleEditor 
            article={selectedArticle} 
            session={session} 
            onNavigate={handleNavigation} 
          />
        )}
        {currentView === 'login' && (
          <Login onNavigate={handleNavigation} />
        )}
        {currentView === 'signup' && (
          <Signup onNavigate={handleNavigation} />
        )}
        {currentView === 'profile' && (
          <Profile session={session} onNavigate={handleNavigation} />
        )}
      </main>
    </div>
  )
}

export default App
