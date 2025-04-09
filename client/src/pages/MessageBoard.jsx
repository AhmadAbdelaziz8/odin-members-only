import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.get('/api/messages');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post('/api/messages', { title, text });
      setMessages([data, ...messages]);
      setTitle('');
      setText('');
      toast.success('Message posted successfully');
    } catch (error) {
      console.error('Error creating message:', error);
      toast.error('Failed to post message');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-8">
      {user ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Create a New Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Message'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please{' '}
                <a href="/login" className="font-medium text-yellow-700 underline hover:text-yellow-600">
                  log in
                </a>{' '}
                to post messages.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Message Board</h2>
        {messages.map((message) => (
          <div key={message.id} className="bg-white shadow sm:rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{message.title}</h3>
                <p className="mt-1 text-gray-600">{message.text}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <div>
                    {user?.membershipStatus === 'regular' ? (
                      <span>Posted by: [Members Only]</span>
                    ) : (
                      <span>
                        Posted by: {message.author.firstName} {message.author.lastName}
                      </span>
                    )}
                  </div>
                  <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}