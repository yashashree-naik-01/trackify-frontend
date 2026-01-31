import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import DashboardSidebar from '../../components/DashboardSidebar';
import { Store, MapPin, Mail, Phone, CheckCircle, Briefcase } from 'lucide-react';
import { socket } from '../../socket';

const VendorServiceCenters = () => {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCenters = async () => {
        try {
            // Fetch only verified centers
            const { data } = await api.get('/service-centers?verified=true');
            setCenters(data);
        } catch (err) {
            setError('Failed to load service centers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCenters();
    }, []);

    useEffect(() => {
        const handleVerificationChange = (data) => {
            console.log('[SOCKET] Service Center verification changed:', data.centerName);
            fetchCenters(); // Re-fetch to get updated list
        };

        socket.on('serviceCenterVerified', handleVerificationChange);
        return () => socket.off('serviceCenterVerified', handleVerificationChange);
    }, []);



    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardSidebar role="Vendor" />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
                        <p className="text-slate-500 mt-1">Find verified service partners for your repair jobs.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : centers.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-white rounded-lg shadow-sm border border-slate-100">
                            <Store className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-medium">No Verified Service Centers Found</h3>
                            <p>Check back later for new partners.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {centers.map(center => (
                                <div key={center._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{center.centerName}</h3>
                                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                    <MapPin size={14} /> {center.city}
                                                </p>
                                            </div>
                                            {center.verified && (
                                                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                    <CheckCircle size={12} /> Verified
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Briefcase size={16} className="text-slate-400" />
                                                <span className="truncate" title={center.servicesOffered.join(', ')}>
                                                    {center.servicesOffered.length > 0
                                                        ? center.servicesOffered.slice(0, 3).join(', ') + (center.servicesOffered.length > 3 ? '...' : '')
                                                        : 'General Repairs'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone size={16} className="text-slate-400" />
                                                <span>{center.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail size={16} className="text-slate-400" />
                                                <span className="truncate">{center.email}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/dashboard/vendor/request-job/${center._id}`)}
                                            className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Briefcase size={18} /> Send Job Request
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VendorServiceCenters;
