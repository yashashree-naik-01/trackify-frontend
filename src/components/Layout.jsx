import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ClipboardList, Home } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center gap-3 text-xl font-bold text-gray-900">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <ClipboardList className="w-6 h-6 text-white" />
                            </div>
                            Trackify
                        </Link>
                        <nav className="flex gap-3 items-center">
                            {user ? (
                                <>
                                    <span className="text-gray-600 text-sm font-medium mr-2">Welcome, {user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium text-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>

                                    <Link
                                        to="/login"
                                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        Staff Login
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header >
            <main className="grow bg-gray-50">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Trackify - Secure Device Repair Tracking
            </footer>
        </div >
    );
};

export default Layout;
