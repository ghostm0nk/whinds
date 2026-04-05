import React, { useState, useEffect } from 'react'
import { Save, Wind, MapPin, Type, Settings } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ArticleEditor({ article, session, onNavigate }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    location: '',
    technology: '',
    capacity: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        summary: article.summary || '',
        location: article.location,
        technology: article.technology || '',
        capacity: article.capacity || ''
      })
    }
  }, [article])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const articleData = {
        ...formData,
        user_id: session.user.id,
        author_name: session.user.user_metadata.full_name || session.user.email,
        updated_at: new Date().toISOString()
      }

      if (article) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('articles')
          .insert(articleData)
        
        if (error) throw error
      }

      onNavigate('home')
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Error saving article')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        {article ? 'Edit Article' : 'Create New Article'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Type className="inline h-4 w-4 mr-1" />
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter article title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Brief summary of the article"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="12"
            placeholder="Write your article content (HTML supported)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., North Sea, Texas, California"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Settings className="inline h-4 w-4 mr-1" />
              Technology
            </label>
            <input
              type="text"
              name="technology"
              value={formData.technology}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Offshore Wind, Onshore Wind"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Wind className="inline h-4 w-4 mr-1" />
            Capacity
          </label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 400 MW, 1.5 GW"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Article'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
