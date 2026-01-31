import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TicketDetails from '../components/TicketDetails';
import { useEffect, useState } from 'react';
import { socket } from '../socket';

const TrackingResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialResult = location.state?.result;

    const [ticket, setTicket] = useState(initialResult?.ticket);
    const [events, setEvents] = useState(initialResult?.events || []);

    useEffect(() => {
        if (!initialResult) {
            navigate('/');
            return;
        }

        const handleStatusUpdate = (data) => {
            // Use ticketId from initial result or current state via ref/functional update
            // ticket.ticketId is available here but let's be safe
            if (data.ticketId === (ticket?.ticketId || initialResult?.ticket?.ticketId)) {
                console.log('[SOCKET] Real-time update received:', data);

                // Update ticket info
                setTicket(prev => ({
                    ...prev,
                    status: data.status,
                    assignedServiceCenter: data.assignedServiceCenter || prev.assignedServiceCenter
                }));

                // Add the new event to the timeline
                if (data.event) {
                    setEvents(prev => {
                        // Avoid duplicates if socket fires twice
                        if (prev.find(e => e._id === data.event._id)) return prev;
                        return [data.event, ...prev];
                    });
                }
            }
        };

        socket.on('ticketStatusUpdated', handleStatusUpdate);

        return () => {
            socket.off('ticketStatusUpdated', handleStatusUpdate);
        };
    }, [initialResult, navigate, ticket?.ticketId]);

    if (!ticket) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-indigo-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white">Tracking Result</h1>
                        <p className="text-indigo-100 mt-1">Real-time status for Ticket #{ticket.ticketId}</p>
                    </div>

                    <div className="p-8">
                        <TicketDetails ticket={ticket} events={events} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingResult;
