import { useState } from 'react';
import api from '../../api';
import TicketDetails from '../../components/TicketDetails';
import DashboardSidebar from '../../components/DashboardSidebar';
import { Plus, Package, ArrowRight, User, Mail, Phone, FileText, Smartphone } from 'lucide-react';

const VendorDashboard = () => {
    // Create Ticket State
    const [newTicket, setNewTicket] = useState({
        customerName: '', customerPhone: '', customerEmail: '', deviceModel: '', issueDescription: ''
    });
    const [createdTicket, setCreatedTicket] = useState(null);
    const [createMsg, setCreateMsg] = useState('');

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/tickets', newTicket);
            setCreatedTicket(data);
            setCreateMsg('Ticket Created Successfully!');
            setNewTicket({ customerName: '', customerPhone: '', customerEmail: '', deviceModel: '', issueDescription: '' });
        } catch (error) {
            console.error('Creation failed:', error.response?.data || error.message);
            setCreateMsg(`Error creating ticket: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role="Vendor" />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Vendor Portal</h1>
                            <p className="text-slate-500 mt-1">Create and manage repair tickets.</p>
                        </div>
                    </div>

                    {createMsg && <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-fadeIn">{createMsg}</div>}

                    {/* CREATE TICKET VIEW */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Package className="text-indigo-600" /> New Repair Job
                            </h2>
                            <form onSubmit={handleCreateTicket} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Customer Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                placeholder="enter your name"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                                value={newTicket.customerName}
                                                onChange={e => setNewTicket({ ...newTicket, customerName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                placeholder="enter your phone number"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                                value={newTicket.customerPhone}
                                                onChange={e => setNewTicket({ ...newTicket, customerPhone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                placeholder="enter email"
                                                type="email"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                                value={newTicket.customerEmail}
                                                onChange={e => setNewTicket({ ...newTicket, customerEmail: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Device Model</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                placeholder="e.g. Hp Victus"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                                value={newTicket.deviceModel}
                                                onChange={e => setNewTicket({ ...newTicket, deviceModel: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Issue Description</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <textarea
                                            placeholder="Describe the issue in detail..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none min-h-[120px]"
                                            value={newTicket.issueDescription}
                                            onChange={e => setNewTicket({ ...newTicket, issueDescription: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                                        Generate Ticket & QR <ArrowRight size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Ticket Preview</h3>
                                {createdTicket ? (
                                    <div className="flex-1 overflow-auto">
                                        <TicketDetails
                                            ticket={{
                                                ...createdTicket.ticket,
                                                otp: createdTicket.otp
                                            }}
                                            events={[]}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8">
                                        <Package size={48} className="mb-3 text-slate-300" />
                                        <p className="font-medium">No ticket generated yet</p>
                                        <p className="text-sm mt-1">Fill out the form to create a new repair ticket.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default VendorDashboard;