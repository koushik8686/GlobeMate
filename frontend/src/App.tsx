import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './user/pages/Dashboard.tsx';
import ExplorePage from './user/pages/ExplorePage.tsx';
import CalendarPage from './user/pages/CalendarPage.tsx';
import PackagesPage from './user/pages/PackagesPage.tsx';
import AnalyticsPage from './user/pages/AnalyticsPage.tsx';
import CommunityPage from './user/pages/CommunityPage.tsx';
import UsersPage from './user/pages/UsersPage.tsx';
import PeoplePage from './user/pages/PeoplePage.tsx';
import UserProfilePage from './user/pages/UserProfilePage.tsx';
import Layout from './user/components/Layout.tsx';
import LandingPage from './components/LandingPAge'; // Fixed import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="people/:userId" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
