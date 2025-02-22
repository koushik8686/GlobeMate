import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './user/components/Layout';
import Dashboard from './user/pages/Dashboard';
import ExplorePage from './user/pages/ExplorePage';
import CalendarPage from './user/pages/CalendarPage';
import PackagesPage from './user/pages/PackagesPage';
import AnalyticsPage from './user/pages/AnalyticsPage';
import CommunityPage from './user/pages/CommunityPage';
import UsersPage from './user/pages/UsersPage';
import PeoplePage from './user/pages/PeoplePage';
import UserProfilePage from './user/pages/UserProfilePage';
import LandingPage from './LandingPAge.jsx';
import ManagerDashboard from './manager/pages/Dashboard.js';
import PackageDetail from './manager/pages/PackageDetail';
import Profile from './manager/pages/Profile';
import Chat from './manager/pages/Chat';
import Sidebar from './manager/components/Sidebar.js';
import Hotels from './manager/pages/Hotels';
function ManagerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<Layout><Dashboard /></Layout>} />
        <Route path="/user/explore" element={<Layout><ExplorePage /></Layout>} />
        <Route path="/user/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/user/packages" element={<Layout><PackagesPage /></Layout>} />
        <Route path="/user/analytics" element={<Layout><AnalyticsPage /></Layout>} />
        <Route path="/user/community" element={<Layout><CommunityPage /></Layout>} />
        <Route path="/user/users" element={<Layout><UsersPage /></Layout>} />
        <Route path="/user/people" element={<Layout><PeoplePage /></Layout>} />
        <Route path="/user/people/:userId" element={<Layout><UserProfilePage /></Layout>} />
        <Route path="/manager" element={<ManagerLayout><ManagerDashboard /></ManagerLayout>} />
        <Route path="/manager/packages" element={<ManagerLayout><PackagesPage /></ManagerLayout>} />
        <Route path="/manager/packages/:id" element={<ManagerLayout><PackageDetail /></ManagerLayout>} />
        <Route path="/manager/profile" element={<ManagerLayout><Profile /></ManagerLayout>} />
        <Route path="/manager/hotels" element={<ManagerLayout><Hotels /></ManagerLayout>} />
        <Route path="/manager/chat" element={<ManagerLayout><Chat /></ManagerLayout>} />
      </Routes>
    </Router>
  );
}

export default App;