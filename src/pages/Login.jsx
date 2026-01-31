import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, QrCode } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            if (res.role === 'Vendor') navigate('/dashboard/vendor');
            else if (res.role === 'Service') navigate('/dashboard/service-center');
            else if (res.role === 'Admin') navigate('/dashboard/admin');
            else navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0B1C38] text-white flex-col justify-center items-center p-12 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-40 -mb-40"></div>

                <div className="relative z-10 max-w-lg text-center">
                    <div className="bg-blue-600/20 p-4 rounded-2xl inline-flex mb-8 backdrop-blur-sm border border-blue-500/30">
                        <QrCode size={48} className="text-blue-400" />
                    </div>

                    <h1 className="text-5xl font-bold mb-6 ">Trackify</h1>
                    <p className="text-xl text-blue-100/80 mb-12 font-light leading-relaxed">
                        QR-based device repair tracking for complete transparency
                    </p>

                    <ul className="text-left space-y-5 text-blue-50/90 mx-auto w-fit">
                        {[
                            'Generate unique QR codes for every repair ticket',
                            'Real-time status updates for customers',
                            'No login required for customer tracking',
                            'Complete repair history timeline'
                        ].map((item, index) => (
                            <li key={index} className="flex items-center gap-4">
                                <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 shadow-[0_0_8px_rgba(45,212,191,0.5)]"></span>
                                <span className="text-lg">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 lg:p-24">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-3 text-slate-500">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <span className="font-semibold">Error:</span> {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                    Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Sign In <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        By signing in, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;