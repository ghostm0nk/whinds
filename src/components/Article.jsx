import React, { useState, useEffect } from 'react'
import { Edit, MessageCircle, User, Calendar, MapPin, Wind } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Article({ article, session, onNavigate }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [article.id])

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', article.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim() || !session) return

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          article_id: article.id,
          content: newComment,
          user_id: session.user.id,
          author_name: session.user.user_metadata.full_name || session.user.email
        })

      if (error) throw error
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{article.author_name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.updated_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{article.location}</span>
            </div>
          </div>
          
          {session && session.user.id === article.user_id && (
            <button
              onClick={() => onNavigate('editor', article)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Article</span>
            </button>
          )}
        </div>

        <div className="prose prose-lg max-w-none text-gray-800">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {article.technology && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Technology</h3>
            <p className="text-gray-700">{article.technology}</p>
          </div>
        )}

        {article.capacity && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Capacity</h3>
            <p className="text-gray-700">{article.capacity}</p>
          </div>
        )}
      </article>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2" />
          Comments ({comments.length})
        </h2>

        {session && (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <button
              onClick={handleComment}
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Post Comment
            </button>
          </div>
        )}

        {!session && (
          <p className="text-gray-600 mb-6">
            Please{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-600 hover:underline"
            >
              log in
            </button>{' '}
            to post comments.
          </p>
        )}

        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{comment.author_name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">No comments yet.</p>
        )}
      </div>
    </div>
  )
}
