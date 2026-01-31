import { LayoutDashboard, History, Settings, LogOut, Menu, X, Plus, Activity, Store, FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardSidebar = ({ role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    const fullRoleName = role === 'Service' ? 'Service Center' : role;

    const navItems = role === 'Vendor' ? [
        { name: 'Create Ticket', icon: Plus, path: '/dashboard/vendor' },
        { name: 'Marketplace', icon: Store, path: '/dashboard/vendor/marketplace' },
        { name: 'Requests', icon: FileText, path: '/dashboard/vendor/requests' },
        { name: 'Update Status', icon: Activity, path: '/dashboard/vendor/update-status' },
        { name: 'History', icon: History, path: '/dashboard/vendor/history' },
        { name: 'Settings', icon: Settings, path: '/dashboard/vendor/settings' },
    ] : role === 'Service' ? [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/service-center' },
        { name: 'Job Requests', icon: Store, path: '/dashboard/service-center/requests' },
        { name: 'Update Status', icon: Activity, path: '/dashboard/service-center/update-status' },
        { name: 'Settings', icon: Settings, path: '/dashboard/service-center/settings' },
    ] : [ // Admin
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
        { name: 'Vendors', icon: Menu, path: '/dashboard/admin/vendors' },
        { name: 'Service Centers', icon: Activity, path: '/dashboard/admin/service-centers' },
        { name: 'Settings', icon: Settings, path: '/dashboard/admin/settings' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-700"
                onClick={toggleSidebar}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white transition-transform transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:static lg:block shrink-0`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-700 flex items-center justify-between lg:justify-center">
                        <h1 className="text-xl font-bold tracking-wider">TRACKIFY</h1>
                        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-6 text-center border-b border-slate-700 bg-slate-800/50">
                        <div className="w-16 h-16 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold">
                            {role.charAt(0)}
                        </div>
                        <h2 className="font-semibold text-lg">{fullRoleName}</h2>
                        <p className="text-xs text-slate-400">Portal Access</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        if (item.path !== '#') navigate(item.path);
                                        if (window.innerWidth < 1024) setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="p-4 border-t border-slate-700">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default DashboardSidebar;
