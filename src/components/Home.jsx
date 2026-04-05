import React, { useState, useEffect } from 'react'
import { Search, Wind, MapPin, Calendar, User } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Home({ session, onNavigate }) {
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading articles...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Wind Farm Knowledge Base
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore comprehensive information about wind farm technologies, locations, and innovations
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by title, content, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(article => (
          <div
            key={article.id}
            onClick={() => onNavigate('article', article)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <Wind className="h-8 w-8 text-blue-600" />
              <span className="text-sm text-gray-500">
                {new Date(article.updated_at).toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {article.title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {article.summary || article.content.substring(0, 150) + '...'}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{article.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No articles found matching your search.' : 'No articles available yet.'}
          </p>
          {session && (
            <button
              onClick={() => onNavigate('editor')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create the First Article
            </button>
          )}
        </div>
      )}
    </div>
  )
}
