import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
// import TicketDetails from '../components/TicketDetails'; // Moved to TrackingResult
import { Search, ShieldCheck, ArrowRight, Smartphone, Clock, Laptop, QrCode } from 'lucide-react';

const Home = () => {
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [otp, setOtp] = useState('');
    // result state moved to separate page
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMsg, setResendMsg] = useState('');
    const navigate = useNavigate();

    const handleResendOtp = async () => {
        if (!ticketId) {
            setError('Please enter Ticket ID first');
            return;
        }

        setResendLoading(true);
        setError('');
        setResendMsg('');

        try {
            await api.post('/tickets/resend-otp', { ticketId });
            setResendMsg(`New OTP sent to registered contact for ${ticketId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP. Check Ticket ID.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // result state is no longer needed locally

        try {
            const { data } = await api.post('/tickets/track', { ticketId, otp });
            // Navigate to result page with data
            navigate('/tracking-result', { state: { result: data } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to track ticket. Check ID and OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <div
                className="min-h-[85vh] flex items-center justify-center relative bg-cover bg-center bg-fixed"
                style={{ backgroundImage: 'url(/trackify.jpg.jpeg)' }}
            >
                {/* Semi-transparent overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-900/70 via-indigo-900/60 to-purple-900/70"></div>
                <div className="max-w-5xl mx-auto px-4 py-16 text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full text-sm font-medium mb-8">
                        <Smartphone className="w-4 h-4" />
                        Built for Indian Service Centers
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Device Repair Tracking<br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-indigo-300">
                            Made Transparent
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                        QR-based tracking system for laptop and device repairs. Customers track status without login.
                        No dependency on brand APIs.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">


                        <button
                            onClick={() => setShowTrackingModal(true)}
                            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
                        >
                            Track your device
                        </button>

                        <button
                            onClick={() => navigate('/register/service-center')}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                        >
                            Partner with Us
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Features */}
                    {/* Features */}
                    <div className="mt-24 mb-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why RepairTrack?</h2>
                            <p className="text-gray-200 max-w-2xl mx-auto">
                                Simple, transparent, and efficient repair tracking for service centers of all sizes
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {/* Card 1: QR-Based Tracking */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900">QR-Based Tracking</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Each device gets a unique QR code. Customers scan to track status instantly.
                                </p>
                            </div>

                            {/* Card 2: Real-Time Updates */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900">Real-Time Updates</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Status updates visible immediately. Complete timeline of repair progress.
                                </p>
                            </div>

                            {/* Card 3: Secure & Private */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900">Secure & Private</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    No customer login required. Only ticket holders can view their repair status.
                                </p>
                            </div>

                            {/* Card 4: Multi-Device Support */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                                    <Laptop className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900">Multi-Device Support</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Works with all brands - HP, Dell, Lenovo, Apple, and more. No API dependency.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className="mt-24 mb-24">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works?</h2>
                            <p className="text-gray-200 mt-4">Follow these simple steps to track your device</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto relative">
                            {/* Connecting Line (Desktop Only) */}
                            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

                            {/* Step 1 */}
                            <div className="text-center relative bg-white md:bg-transparent">
                                <div className="w-16 h-16 bg-blue-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">
                                    01
                                </div>
                                <h3 className="font-bold text-white mb-2">Create Ticket</h3>
                                <p className="text-sm text-gray-200 max-w-[200px] mx-auto">
                                    Vendor enters customer and device details
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="text-center relative bg-white md:bg-transparent">
                                <div className="w-16 h-16 bg-blue-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">
                                    02
                                </div>
                                <h3 className="font-bold text-white mb-2">Generate QR</h3>
                                <p className="text-sm text-gray-200 max-w-[200px] mx-auto">
                                    Unique QR code generated for tracking
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="text-center relative bg-white md:bg-transparent">
                                <div className="w-16 h-16 bg-blue-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">
                                    03
                                </div>
                                <h3 className="font-bold text-white mb-2">Share with Customer</h3>
                                <p className="text-sm text-gray-200 max-w-[200px] mx-auto">
                                    Print or share QR code with customer
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="text-center relative bg-white md:bg-transparent">
                                <div className="w-16 h-16 bg-blue-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">
                                    04
                                </div>
                                <h3 className="font-bold text-white mb-2">Track Anytime</h3>
                                <p className="text-sm text-gray-200 max-w-[200px] mx-auto">
                                    Customer scans QR to see live status
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Banner Section */}
            <div className="bg-slate-900 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to streamline your repair tracking?
                    </h2>
                    <p className="text-blue-200 mb-8 text-lg">
                        Start providing transparent repair updates to your customers today
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-gray-200 hover:bg-white text-slate-900 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto"
                    >
                        Get Started Now
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>


            {/* Tracking Modal */}
            {showTrackingModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={() => setShowTrackingModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Repair</h2>
                        <p className="text-gray-600 mb-6">Enter your ticket ID and OTP to track status</p>

                        <form onSubmit={handleTrack} className="space-y-4">
                            <div>
                                <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Ticket ID
                                </label>
                                <input
                                    type="text"
                                    id="ticketId"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="TRK-123456"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                        Security OTP
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendLoading || !ticketId}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {resendLoading ? 'Sending...' : 'Resend OTP?'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="otp"
                                        maxLength="6"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
                                        placeholder="••••••"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ShieldCheck className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Track Device'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {resendMsg && (
                            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded animate-in fade-in slide-in-from-top-1">
                                <p className="text-sm text-green-700 font-medium">{resendMsg}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Results Section Removed - handled by separate page */}
        </>
    );
};

export default Home;
