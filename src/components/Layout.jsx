/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Home, Users, Building } from 'lucide-react';

const Layout = () => {
  const { logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Properties', href: '/properties', icon: Building },
  ];

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-25"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex-1 flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl"
            >
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto px-4">
                <div className="flex items-center mb-8">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Elite Properties Admin
                  </h1>
                </div>
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-white/50 hover:shadow-sm hover:scale-[1.02] group"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-5 w-5 mr-3 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 p-4 border-t border-gray-200/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-red-50/50 hover:shadow-sm hover:scale-[1.02]"
                >
                  <LogOut className="h-5 w-5 mr-3 text-gray-600" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-10">
        <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto px-4">
            <div className="flex items-center mb-8">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Elite Properties Admin
              </h1>
            </div>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-white/50 hover:shadow-sm hover:scale-[1.02] group"
                  >
                    <Icon className="h-5 w-5 mr-3 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 p-4 border-t border-gray-200/50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-red-50/50 hover:shadow-sm hover:scale-[1.02]"
            >
              <LogOut className="h-5 w-5 mr-3 text-gray-600" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <button
            type="button"
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <main className="flex-1 bg-gray-50/30 min-h-screen">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;