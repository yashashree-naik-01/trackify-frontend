import { useState } from 'react';
import api from '../api';

const SendEmail = () => {
    const [formData, setFormData] = useState({
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!formData.email || !formData.message) {
            setStatus({ type: 'error', message: 'Please fill in all fields' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({ type: 'error', message: 'Please enter a valid email address' });
            return;
        }

        if (formData.message.trim().length === 0) {
            setStatus({ type: 'error', message: 'Message cannot be empty' });
            return;
        }

        if (formData.message.length > 1000) {
            setStatus({ type: 'error', message: 'Message is too long (max 1000 characters)' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/send-email', formData);
            setStatus({ type: 'success', message: 'Email sent successfully!' });
            setFormData({ email: '', message: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to send email. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Email</h1>
                    <p className="text-gray-600 mb-8">Send a custom message to any email address</p>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-lg ${status.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Recipient Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                placeholder="example@email.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows="8"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                placeholder="Type your message here..."
                                disabled={loading}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.message.length}/1000 characters
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium text-lg shadow-lg hover:shadow-xl"
                        >
                            {loading ? 'Sending...' : 'Send Email'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SendEmail;
