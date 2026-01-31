import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardSidebar from '../components/DashboardSidebar';
import { ArrowLeft, Send } from 'lucide-react';

const SendJobRequest = () => {
    const { serviceCenterId } = useParams();
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [ticketId, setTicketId] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Fetch tickets created by this vendor
        const fetchTickets = async () => {
            try {
                const { data } = await api.get('/tickets');
                setTickets(data);
                if (data.length > 0) {
                    setTicketId(data[0]._id); // Default to first ticket
                }
            } catch (err) {
                console.error("Failed to fetch tickets", err);
                setError('Failed to load tickets. Please ensure you have created tickets first.');
            }
        };

        fetchTickets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/job-requests', {
                ticketId,
                serviceCenterId,
                notes
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/vendor/marketplace');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request');
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role="Vendor" />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-3xl mx-auto">

                    <button
                        onClick={() => navigate('/dashboard/vendor/marketplace')}
                        className="flex items-center text-slate-500 hover:text-slate-700 mb-6 transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Back to Marketplace
                    </button>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">Send Job Request</h1>
                            <p className="text-slate-500 mt-1">Select a ticket and describe the issue for the service center.</p>
                        </div>

                        {success ? (
                            <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                                <div className="text-xl font-bold mb-2">Request Sent Successfully!</div>
                                <p>Redirecting back to marketplace...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="ticketId" className="block text-sm font-medium text-slate-700 mb-2">
                                        Select Ticket
                                    </label>
                                    <select
                                        id="ticketId"
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        required
                                        disabled={tickets.length === 0}
                                    >
                                        {tickets.length === 0 && <option value="">No available tickets</option>}
                                        {tickets.map(ticket => (
                                            <option key={ticket._id} value={ticket._id}>
                                                {ticket.deviceModel} ({ticket.customerName}) - {new Date(ticket.createdAt).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                    {tickets.length === 0 && (
                                        <p className="text-xs text-amber-600 mt-2">
                                            You need to create a ticket first before sending a request.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                                        Notes / Issue Summary
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows="4"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="E.g., Screen flickering intermittantly. Needs replacement quote."
                                        required
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || tickets.length === 0}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Sending...' : (
                                            <>
                                                <Send size={18} /> Send Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SendJobRequest;
