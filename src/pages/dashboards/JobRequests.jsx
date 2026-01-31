import { useState, useEffect } from 'react';
import { socket } from '../../socket';
import api from '../../api';
import DashboardSidebar from '../../components/DashboardSidebar';
import { Clock, CheckCircle, XCircle, User, FileText } from 'lucide-react';

const JobRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(''); // Stores ID of request being processed

    useEffect(() => {
        fetchRequests();

        // Real-time listener
        socket.on('newJobRequest', (data) => {
            console.log('[SOCKET] New job request received');
            fetchRequests();
        });

        return () => {
            socket.off('newJobRequest');
        };
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/job-requests/service-center');
            setRequests(data);
        } catch (err) {
            console.error('Failed to fetch requests', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        setActionLoading(id);
        try {
            await api.put(`/job-requests/${id}/status`, { status });
            // Update local state
            setRequests(requests.map(req =>
                req._id === id ? { ...req, status } : req
            ));
        } catch (err) {
            console.error('Failed to update status', err);
            const errMsg = err.response?.data?.message || 'Failed to update status';
            alert(`Error: ${errMsg}`);
        } finally {
            setActionLoading('');
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role="Service" />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Job Requests</h1>
                        <p className="text-slate-500 mt-1">Manage incoming repair requests from vendors.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-slate-100">
                            <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No Job Requests</h3>
                            <p className="text-slate-500">You don't have any pending requests at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {requests.map((req) => (
                                <div key={req._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-md">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {req.status}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(req.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {req.ticketId?.deviceModel || 'Unknown Device'}
                                            </h3>
                                            <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                {req.ticketId?.ticketId}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                                            <span className="font-semibold text-slate-700 block mb-1">Issue reported:</span>
                                            {req.notes}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <User size={14} />
                                            <span>Vendor: <span className="font-medium text-slate-700">{req.vendorId?.name}</span></span>
                                        </div>
                                    </div>

                                    {req.status === 'pending' && (
                                        <div className="flex items-center gap-3 self-center">
                                            <button
                                                onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                disabled={!!actionLoading}
                                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(req._id, 'accepted')}
                                                disabled={!!actionLoading}
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {actionLoading === req._id ? 'Processing...' : 'Accept Job'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default JobRequests;
