import { useState, useEffect } from 'react';
import api from '../../api';
import TicketDetails from '../../components/TicketDetails';
import DashboardSidebar from '../../components/DashboardSidebar';
import { Activity, CheckCircle, MapPin, FileText, ArrowLeft, Wrench } from 'lucide-react';
import { socket } from '../../socket';

const ServiceCenterUpdateStatus = () => {
    // View State: 'list' | 'update'
    const [view, setView] = useState('list');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Update State
    const [selectedTicketFull, setSelectedTicketFull] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({
        status: '',
        description: '',
        location: ''
    });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const handleStatusUpdate = (data) => {
            if (selectedTicketFull && data.ticketId === selectedTicketFull.ticket.ticketId) {
                console.log('[SOCKET] Service Center Ticket updated:', data.status);
                setSelectedTicketFull(prev => {
                    if (!prev) return prev;
                    // Prevent duplicates
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
    }, [selectedTicketFull]);

    // Allowed Statuses
    const statusOptions = ['In Repair', 'Repaired', 'Dispatched'];

    // Fetch Accepted Jobs
    useEffect(() => {
        fetchAcceptedJobs();
    }, []);

    const fetchAcceptedJobs = async () => {
        try {
            const { data } = await api.get('/job-requests/service-center');
            // Filter only accepted jobs
            const accepted = data.filter(job => job.status === 'accepted');
            setJobs(accepted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle clicking "Update Status" on a job card
    const handleSelectJob = async (ticketId) => {
        try {
            setLoading(true);
            // Fetch full ticket details including history
            const { data } = await api.get(`/tickets/${ticketId}`);
            setSelectedTicketFull(data);

            // Pre-fill valid status
            const currentStatus = data.ticket.status;
            setStatusUpdate({
                status: statusOptions.includes(currentStatus) ? currentStatus : '',
                description: '',
                location: ''
            });

            setMsg('');
            setView('update');
        } catch (error) {
            alert('Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!selectedTicketFull) return;

        try {
            const { data } = await api.patch(`/tickets/${selectedTicketFull.ticket.ticketId}/status`, statusUpdate);

            // Update local view
            setSelectedTicketFull({
                ...selectedTicketFull,
                ticket: data.ticket,
                events: [data.event, ...(selectedTicketFull.events || [])]
            });

            setMsg('Status Updated Successfully!');
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Update failed';
            setMsg(`Error: ${message}`);
        }
    };

    const handleBack = () => {
        setView('list');
        setSelectedTicketFull(null);
        setMsg('');
        fetchAcceptedJobs(); // Refresh list in case status changed (though unlikely to remove from list)
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role="Service" />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Active Repairs</h1>
                        <p className="text-slate-500 mt-1">Manage and update status for accepted repair jobs.</p>
                    </div>

                    {msg && (
                        <div className={`p-4 rounded-lg border ${msg.includes('failed') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'} animate-fadeIn`}>
                            {msg}
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    )}

                    {/* VIEW: JOB LIST */}
                    {view === 'list' && !loading && (
                        jobs.length === 0 ? (
                            <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-slate-100">
                                <Wrench className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900">No Active Repairs</h3>
                                <p className="text-slate-500">Accept job requests from the "Job Requests" tab to start repairs.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobs.map(job => (
                                    <div key={job._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">{job.ticketId?.deviceModel}</h3>
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono mt-1 inline-block">
                                                    {job.ticketId?.ticketId}
                                                </span>
                                            </div>
                                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                                Accepted
                                            </span>
                                        </div>

                                        <div className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg">
                                            <span className="font-semibold block mb-1">Issue:</span>
                                            {job.ticketId?.issueDescription || job.notes}
                                        </div>

                                        <button
                                            onClick={() => handleSelectJob(job.ticketId?.ticketId)} // Use public ticketId (TRK-...)
                                            className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Activity size={18} /> Update Status
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* VIEW: UPDATE STATUS FORM */}
                    {view === 'update' && selectedTicketFull && (
                        <div className="animate-fadeIn">
                            <button
                                onClick={handleBack}
                                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors"
                            >
                                <ArrowLeft size={18} className="mr-2" /> Back to List
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Col: Ticket Info & Timeline */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                        <TicketDetails
                                            ticket={selectedTicketFull.ticket}
                                            events={selectedTicketFull.events || []}
                                            allowDelete={true}
                                            onDeleteEvent={async (eventId) => {
                                                if (!window.confirm('Delete this timeline update?')) return;
                                                try {
                                                    await api.delete(`/tickets/${selectedTicketFull.ticket.ticketId}/updates/${eventId}`);
                                                    // Refresh data
                                                    const { data } = await api.get(`/tickets/${selectedTicketFull.ticket.ticketId}`);
                                                    setSelectedTicketFull(data);
                                                    setMsg('Update removed');
                                                } catch (err) {
                                                    alert('Failed to delete update');
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Right Col: Update Form */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Activity className="text-indigo-600" /> Update Progress
                                    </h3>
                                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">New Status</label>
                                            <div className="relative">
                                                <CheckCircle className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                                <select
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                                    value={statusUpdate.status}
                                                    onChange={e => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select Status</option>
                                                    {statusOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                                <input
                                                    placeholder="e.g. Workshop"
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    value={statusUpdate.location}
                                                    onChange={e => setStatusUpdate({ ...statusUpdate, location: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Notes</label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                                <textarea
                                                    placeholder="Brief description..."
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                                    value={statusUpdate.description}
                                                    onChange={e => setStatusUpdate({ ...statusUpdate, description: e.target.value })}
                                                />
                                            </div>
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
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ServiceCenterUpdateStatus;
