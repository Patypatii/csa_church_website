import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../api/axiosInstace';

interface SemesterActivity {
  id: number;
  title: string;
  datetime: string;
  venue: string;
  description: string;
}

const SemesterAdmin: React.FC = () => {
  const { user, getAuthToken } = useAuth();
  const [activities, setActivities] = useState<SemesterActivity[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    datetime: '',
    venue: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = getAuthToken();
      const response = await axiosInstance.get('/api/semester', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (err) {
      setError('Failed to fetch activities');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      await axiosInstance.post('/api/semester', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', datetime: '', venue: '', description: '' });
      fetchActivities();
      setError('');
    } catch (err) {
      setError('Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this activity?')) return;
    try {
      const token = getAuthToken();
      await axiosInstance.delete(`/api/semester/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchActivities();
    } catch (err) {
      setError('Failed to delete activity');
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Please log in to manage activities.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Semester Activities Admin</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Add Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Add New Activity</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => setFormData({...formData, datetime: e.target.value})}
              className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-blue-600 text-white py-4 px-8 rounded-xl hover:bg-blue-700 font-bold text-lg disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Adding...' : 'Add Activity'}
            </button>
          </form>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-2">Current Activities ({activities.length})</h2>
            <button
              onClick={fetchActivities}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-6 text-left font-bold text-gray-900">Title</th>
                  <th className="p-6 text-left font-bold text-gray-900">Date & Time</th>
                  <th className="p-6 text-left font-bold text-gray-900">Venue</th>
                  <th className="p-6 text-left font-bold text-gray-900">Description</th>
                  <th className="p-6 text-left font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => {
                  const date = new Date(activity.datetime);
                  return (
                    <tr key={activity.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-6 font-medium">{activity.title}</td>
                      <td className="p-6">{date.toLocaleString()}</td>
                      <td className="p-6">{activity.venue}</td>
                      <td className="p-6 max-w-md truncate">{activity.description}</td>
                      <td className="p-6">
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                      No activities yet. Add one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterAdmin;

