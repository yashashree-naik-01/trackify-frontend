import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, Activity } from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import api from '../../api';
import { socket } from '../../socket';

const ServiceCenterDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isVerified = user.isVerified || false;
    const [stats, setStats] = useState({ totalRepairs: 0, activeJobs: 0 });

    useEffect(() => {
        if (isVerified) {
            fetchStats();

            // Real-time listeners
            socket.on('statsUpdate', (data) => {
                console.log('[SOCKET] Stats update received');
                fetchStats();
            });

            socket.on('newJobRequest', (data) => {
                console.log('[SOCKET] New job request received');
                fetchStats();
            });

            socket.on('ticketStatusUpdated', (data) => {
                console.log('[SOCKET] Ticket status updated, refreshing stats');
                fetchStats();
            });

            return () => {
                socket.off('statsUpdate');
                socket.off('newJobRequest');
                socket.off('ticketStatusUpdated');
            };
        }
    }, [isVerified]);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/service-centers/stats');
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role="Service" />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Service Center Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back, {user.name}</p>
                    </div>

                    {!isVerified ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-lg shadow-sm">
                            <div className="flex items-start">
                                <div className="shrink-0">
                                    <ShieldAlert className="h-8 w-8 text-yellow-400" aria-hidden="true" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-medium text-yellow-800">Account Pending Verification</h3>
                                    <div className="mt-2 text-yellow-700">
                                        <p>
                                            Thank you for registering your Service Center. Your account is currently under review by our administration team.
                                        </p>
                                        <p className="mt-2">
                                            Once verified, you will be able to access job requests and manage repairs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                                        <Home className="h-6 w-6" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-500 truncate">Total Repairs</dt>
                                            <dd>
                                                <div className="text-2xl font-bold text-slate-900">{stats.totalRepairs}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-500 truncate">Active Jobs</dt>
                                            <dd>
                                                <div className="text-2xl font-bold text-slate-900">{stats.activeJobs}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ServiceCenterDashboard;
