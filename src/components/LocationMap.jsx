import { MapPin } from 'lucide-react';

const LocationMap = ({ locationName }) => {
    // If no location, default to something generic or empty state
    const query = locationName ? encodeURIComponent(locationName) : 'India';

    // Using widely available Google Maps Embed output
    const mapSrc = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="h-64 w-full rounded-xl overflow-hidden shadow-md border border-gray-200 relative bg-slate-100 group">
            <iframe
                title="Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={mapSrc}
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>

            {/* Overlay Label */}
            <div className="absolute top-2 left-2 bg-white/90 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm z-10 backdrop-blur-sm flex items-center gap-1.5 text-slate-700">
                <MapPin size={14} className="text-red-500" />
                {locationName || 'Location Preview'}
            </div>
        </div>
    );
};

export default LocationMap;
