import { useState, useEffect } from 'react';
import api from '../../api';
import TicketDetails from '../../components/TicketDetails';
import DashboardSidebar from '../../components/DashboardSidebar';
import { Search, Activity, MapPin } from 'lucide-react';
import { socket } from '../../socket';

const VendorUpdateStatus = () => {
    // Update Status State
    const [searchId, setSearchId] = useState('');
    const [ticketData, setTicketData] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({ status: '', description: '', location: '' });
    const [updateMsg, setUpdateMsg] = useState('');

    useEffect(() => {
        const handleStatusUpdate = (data) => {
            if (ticketData && data.ticketId === ticketData.ticket.ticketId) {
                console.log('[SOCKET] Ticket status updated:', data.status);
                // Update local state if the current ticket matches
                setTicketData(prev => {
                    if (!prev) return prev;
                    // Check if event already exists to prevent duplicates
                    const eventExists = prev.events?.some(e => e._id === data.event._id);
                    if (eventExists) return prev;

                    return {
                        ...prev,
                        ticket: { ...prev.ticket, status: data.status },
                        events: [data.event, ...(prev.events || [])]
                    };
                });
            }
        };

        socket.on('ticketStatusUpdated', handleStatusUpdate);
        return () => socket.off('ticketStatusUpdated', handleStatusUpdate);
    }, [ticketData]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.get(`/tickets/${searchId}`);
            setTicketData(data);
            setStatusUpdate({ ...statusUpdate, status: data.ticket.status });
            setUpdateMsg('');
        } catch (error) {
            setUpdateMsg('Ticket not found or unauthorized');
            setTicketData(null);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!ticketData) return;
        try {
            const { data } = await api.patch(`/tickets/${ticketData.ticket.ticketId}/status`, statusUpdate);
            setTicketData({ ...ticketData, ticket: data.ticket, events: [data.event, ...(ticketData.events || [])] });
            setUpdateMsg('Status Updated!');
        } catch (error) {
            const message = error.response?.data?.message || 'Updates failed';
            setUpdateMsg(message);
        }
    };

    const statusOptions = [
        'Picked Up', 'Delivered'
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role="Vendor" />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Update Status</h1>
                            <p className="text-slate-500 mt-1">Search and update ticket status.</p>
                        </div>
                    </div>

                    {updateMsg && <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 animate-fadeIn">{updateMsg}</div>}

                    {/* UPDATE STATUS VIEW */}
                    <div className="space-y-8 animate-fadeIn">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Search className="text-indigo-600" /> Find Ticket by ID
                            </h3>
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <input
                                    placeholder="Enter Ticket ID (e.g. TRK-123456)"
                                    className="grow bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={searchId}
                                    onChange={e => setSearchId(e.target.value)}
                                />
                                <button type="submit" className="bg-indigo-600 text-white px-8 py-3 font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-all">
                                    Search
                                </button>
                            </form>
                        </div>

                        {ticketData && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {ticketData.ticket.assignedServiceCenter && (
                                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-start gap-4 animate-fadeIn">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <Activity className="text-indigo-600" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Assigned Service Center</h4>
                                                <div className="text-lg font-bold text-indigo-900">{ticketData.ticket.assignedServiceCenter.centerName}</div>
                                                <p className="text-sm text-indigo-600 flex items-center gap-1.5 mt-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {ticketData.ticket.assignedServiceCenter.city}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                        <TicketDetails
                                            ticket={ticketData.ticket}
                                            events={ticketData.events || []}
                                            allowDelete={true}
                                            onDeleteEvent={async (eventId) => {
                                                if (!window.confirm('Delete this timeline update?')) return;
                                                try {
                                                    await api.delete(`/tickets/${ticketData.ticket.ticketId}/updates/${eventId}`);
                                                    // Refresh data
                                                    const { data } = await api.get(`/tickets/${ticketData.ticket.ticketId}`);
                                                    setTicketData(data);
                                                    setUpdateMsg('Update removed');
                                                } catch (err) {
                                                    alert('Failed to delete update');
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Activity className="text-indigo-600" /> Update Status
                                    </h3>
                                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">New Status</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={statusUpdate.status}
                                                onChange={e => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                            >
                                                <option value="">Select Status</option>
                                                {statusOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Current Location</label>
                                            <input
                                                placeholder="Location (e.g. Vendor Store)"
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={statusUpdate.location}
                                                onChange={e => setStatusUpdate({ ...statusUpdate, location: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Notes</label>
                                            <textarea
                                                placeholder="Additional notes..."
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                                value={statusUpdate.description}
                                                onChange={e => setStatusUpdate({ ...statusUpdate, description: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs uppercase tracking-wider mb-1 block text-indigo-600 font-bold">Attachment (Image)</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setStatusUpdate({ ...statusUpdate, image: reader.result });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                />
                                                {statusUpdate.image && (
                                                    <img src={statusUpdate.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                                                )}
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 shadow-md transition-all">
                                            Update Status
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorUpdateStatus;
