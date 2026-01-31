import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import TicketDetails from '../components/TicketDetails';
import { ShieldCheck } from 'lucide-react';

const Track = () => {
    const { ticketId } = useParams();
    const [otp, setOtp] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/tickets/track', { ticketId, otp });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Check OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Track Repair Status</h1>
                <p className="mt-2 text-gray-600">Ticket ID: <span className="font-mono font-bold text-indigo-600">{ticketId}</span></p>
            </div>

            {!result ? (
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <ShieldCheck className="text-indigo-600" /> Security Check
                    </h2>
                    <p className="mb-6 text-sm text-gray-500">
                        Please enter the 6-digit OTP provided by the vendor to view the live status of your device.
                    </p>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">One-Time Password (OTP)</label>
                            <input
                                type="password"
                                maxLength="6"
                                className="block w-full text-center text-3xl tracking-[1em] font-mono border-b-2 border-gray-300 focus:border-indigo-600 focus:outline-none py-2 transition-colors"
                                placeholder="••••••"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
                            >
                                {loading ? 'Verifying...' : 'View Status'}
                            </button>

                            <button
                                type="button"
                                onClick={async () => {
                                    if (!ticketId) {
                                        setError('Ticket ID is invalid');
                                        return;
                                    }
                                    setLoading(true);
                                    setError('');
                                    try {
                                        const { data } = await api.post('/tickets/resend-otp', { ticketId });
                                        alert(data.message);
                                    } catch (err) {
                                        setError(err.response?.data?.message || 'Failed to resend OTP');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="w-full bg-white text-indigo-600 border border-indigo-200 py-3 rounded-lg hover:bg-indigo-50 transition disabled:opacity-50 text-sm font-medium"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <TicketDetails ticket={result.ticket} events={result.events} />
            )}
        </div>
    );
};

export default Track;
