import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Package,
    Truck,
    Wrench,
    CheckCircle,
    Clock,
    MapPin,
    Calendar,
    Trash2
} from 'lucide-react';
import LocationMap from './LocationMap';

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'Created': return <Clock className="text-gray-500" />;
        case 'Picked Up': return <Truck className="text-blue-500" />;
        case 'Received': return <Package className="text-indigo-500" />;
        case 'In Repair': return <Wrench className="text-orange-500" />;
        case 'Repaired': return <CheckCircle className="text-green-500" />;
        case 'Dispatched': return <Truck className="text-purple-500" />;
        case 'Delivered': return <CheckCircle className="text-green-700" />;
        default: return <Clock className="text-gray-400" />;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "Time not available";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Time not available" : date.toLocaleString();
};

const TicketDetails = ({
    ticket,
    events = [],
    allowDelete = false,
    onDeleteEvent
}) => {
    const [previewImage, setPreviewImage] = useState(null);
    if (!ticket) return null;

    // ✅ ALWAYS SORT EVENTS (latest first)
    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const latestEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;
    const currentLocation = latestEvent?.location || 'Vendor Location';

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

            {/* HEADER */}
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">
                        Ticket #{ticket.ticketId}
                    </h2>
                    <p className="opacity-90">
                        Device: {ticket.deviceModel}
                    </p>
                </div>

                <div className="bg-white p-2 rounded-lg">
                    {ticket.qrCode ? (
                        <img src={ticket.qrCode} className="w-16 h-16" />
                    ) : (
                        <QRCodeSVG
                            value={`http://localhost:5173/track/${ticket.ticketId}`}
                            size={64}
                        />
                    )}
                </div>
            </div>

            {/* INFO */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Repair Information
                    </h3>

                    <div className="space-y-3 text-gray-600">
                        <p><b>Customer:</b> {ticket.customerName}</p>
                        <p><b>Issue:</b> {ticket.issueDescription}</p>

                        <p>
                            <b>Status:</b>
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800">
                                {ticket.status}
                            </span>
                        </p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">
                            Current Location
                        </h3>
                        <LocationMap locationName={currentLocation} />
                    </div>
                </div>

                {/* OTP */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Secure OTP
                    </h3>
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-xs text-gray-500">CUSTOMER OTP</p>
                        <p className="text-3xl font-mono font-bold text-indigo-600">
                            {ticket.otp}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Share only with service partner
                        </p>
                    </div>
                </div>
            </div>

            {/* TIMELINE */}
            <div className="px-6 pb-6">
                <h3 className="text-lg font-semibold mb-6 border-b pb-2">
                    Tracking Timeline
                </h3>

                <div className="space-y-6 pl-2">
                    {sortedEvents.map((event, index) => {
                        const isLatest = index === 0;

                        return (
                            <div key={event._id} className="relative flex gap-4">

                                {index !== sortedEvents.length - 1 && (
                                    <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-gray-200" />
                                )}

                                <div className={`z-10 ${isLatest ? 'bg-indigo-50 p-1 rounded-full' : ''}`}>
                                    <StatusIcon status={event.status} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-semibold ${isLatest ? 'text-indigo-700' : ''}`}>
                                                {event.status}
                                            </p>

                                            {isLatest && (
                                                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 rounded-full">
                                                    Latest
                                                </span>
                                            )}
                                        </div>

                                        {allowDelete && (
                                            <button
                                                onClick={() => onDeleteEvent(event._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {event.description}
                                    </p>

                                    {event.image && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => setPreviewImage(event.image)}
                                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 transition-colors"
                                            >
                                                <Package size={12} /> View Attachment
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                        <span>{formatDate(event.timestamp)}</span>
                                        <MapPin className="w-3 h-3" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* IMAGE PREVIEW MODAL */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl w-full">
                        <img
                            src={previewImage}
                            alt="Attachment"
                            className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                        <button
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
                            onClick={() => setPreviewImage(null)}
                        >
                            <Trash2 size={24} className="rotate-45" /> {/* Close icon using Trash rotated */}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetails;
