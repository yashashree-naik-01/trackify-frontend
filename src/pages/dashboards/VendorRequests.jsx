import { useState, useEffect } from 'react';
import { socket } from '../../socket';
import api from '../../api';
import DashboardSidebar from '../../components/DashboardSidebar';
import { FileText, CheckCircle, XCircle, Clock, Store, Package } from 'lucide-react';

const VendorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/job-requests/vendor');
            setRequests(data);
        } catch (err) {
            console.error('Failed to fetch vendor requests', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();

        // Real-time listener for job request updates
        socket.on('jobRequestUpdated', (data) => {
            console.log('[SOCKET] Job request updated:', data.requestId);
            fetchRequests(); // Re-fetch to get updated status
        });

        return () => {
            socket.off('jobRequestUpdated');
        };
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-800',
                    icon: Clock
                };
            case 'accepted':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    icon: CheckCircle
                };
            case 'rejected':
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-800',
                    icon: XCircle
                };
            default:
                return {
                    bg: 'bg-slate-100',
                    text: 'text-slate-800',
                    icon: Clock
                };
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role="Vendor" />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Requests</h1>
                        <p className="text-slate-500 mt-1">Track the status of your job requests sent to service centers.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-slate-100">
                            <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No Requests Yet</h3>
                            <p className="text-slate-500">You haven't sent any job requests to service centers yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {requests.map((req) => {
                                const statusInfo = getStatusBadge(req.status);
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <div key={req._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.text}`}>
                                                        <StatusIcon size={14} />
                                                        {req.status}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {req.ticketId?.deviceModel || 'Unknown Device'}
                                                    </h3>
                                                    <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                        {req.ticketId?.ticketId}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                                                    <Store size={16} className="text-slate-400" />
                                                    <span className="font-medium">{req.serviceCenterId?.centerName}</span>
                                                    <span className="text-slate-400">•</span>
                                                    <span>{req.serviceCenterId?.city}</span>
                                                </div>

                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                                                    <span className="font-semibold text-slate-700 block mb-1">Request note:</span>
                                                    <p className="text-slate-600">{req.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VendorRequests;
