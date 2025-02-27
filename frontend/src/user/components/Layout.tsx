import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User,
  Home,
  Compass,
  Calendar,
  Package,
  Hotel,
  Map,
  PieChart,
  Menu,
  X,
  Users as UsersIcon,
  Trophy,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/user/', icon: Home, label: 'Dashboard' },
    { path: '/user/explore', icon: Compass, label: 'Explore' },
    { path: '/user/calendar', icon: Calendar, label: 'Trip Planner' },
    { path: '/user/packages', icon: Package, label: 'Packages' },
    {path: '/user/hotels', icon: Hotel, label: 'Hotel'},
    { path: '/user/analytics', icon: PieChart, label: 'Analytics' },
    { path: '/user/community', icon: Trophy, label: 'Community' },
    { path: '/user/users', icon: MessageSquare, label: 'Messages' },
    { path: '/user/people', icon: UsersIcon, label: 'People' }
  ];

  const notifications = [
    { id: 1, title: 'New trip suggestion', message: 'Check out this amazing deal to Paris!', time: '5m ago' },
    { id: 2, title: 'Friend request', message: 'Sarah wants to connect with you', time: '1h ago' },
    { id: 3, title: 'Trip reminder', message: 'Your flight to Tokyo is in 3 days', time: '2h ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link 
                to="/" 
                className="text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2"
              >
                <Compass className="w-6 h-6" />
                <span className="bg-gradient-to-r from-emerald-600 to-blue-500 text-transparent bg-clip-text">
                  GeoGuide
                </span>
              </Link>
              <div className="hidden lg:flex items-center gap-1">
                {navigationItems.map(item => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path) 
                        ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-64 px-4 py-2 pl-10 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="relative">
                <button 
                  className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200 relative"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border"
                    >
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-800">{notification.title}</h3>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2 px-4">
                        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <button 
                  className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border"
                    >
                      <div className="px-4 py-2 border-b">
                        <div className="font-medium text-gray-800">Alex Johnson</div>
                        <div className="text-sm text-gray-500">alex@example.com</div>
                      </div>
                      <div className="py-1">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button 
                className="lg:hidden p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-40"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-1">
                {navigationItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path) 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    className="w-full px-4 py-2 pl-10 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}