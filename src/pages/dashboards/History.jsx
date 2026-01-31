import { useState, useEffect } from 'react';
import api from '../../api';
import DashboardSidebar from '../../components/DashboardSidebar'; // Import Sidebar
import { Package, Calendar, MapPin, Activity } from 'lucide-react';
import { socket } from '../../socket';

const History = ({ role }) => { // Accept role prop
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const { data } = await api.get('/tickets');
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        const handleStatusUpdate = (data) => {
            console.log('[SOCKET] History ticket status update:', data.ticketId);
            setTickets(prev => prev.map(t =>
                t.ticketId === data.ticketId ? { ...t, status: data.status } : t
            ));
        };

        socket.on('ticketStatusUpdated', handleStatusUpdate);
        return () => socket.off('ticketStatusUpdated', handleStatusUpdate);
    }, []);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role={role} />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 lg:p-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">History</h1>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading history...</div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {tickets.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="p-4 font-semibold text-slate-600">Ticket ID</th>
                                                <th className="p-4 font-semibold text-slate-600">Customer</th>
                                                <th className="p-4 font-semibold text-slate-600">Device</th>
                                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                                <th className="p-4 font-semibold text-slate-600">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map(ticket => (
                                                <tr key={ticket.ticketId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4 font-medium text-slate-900">{ticket.ticketId}</td>
                                                    <td className="p-4 text-slate-600">{ticket.customerName}</td>
                                                    <td className="p-4 text-slate-600">{ticket.deviceModel}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                                            ${ticket.status === 'Created' ? 'bg-blue-100 text-blue-700' :
                                                                ticket.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                                    'bg-slate-100 text-slate-700'}`}>
                                                            {ticket.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-500 text-sm">
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-slate-400">
                                    <Package size={48} className="mx-auto mb-3 opacity-50" />
                                    <p>No tickets found in history.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default History;
