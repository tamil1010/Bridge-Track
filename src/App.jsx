/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import FieldWorker from './pages/FieldWorker';
import AdminDashboard from './pages/AdminDashboard';
import VolunteerAuth from './pages/VolunteerAuth';
import VolunteerDashboard from './pages/VolunteerDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <ClipboardList size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight text-neutral-900">BridgeTrack</span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900">Field Worker</Link>
                  <Link to="/admin" className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900">Admin Panel</Link>
                  <Link to="/volunteer-auth" className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900">Volunteer Join</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<FieldWorker />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/volunteer-auth" element={<VolunteerAuth />} />
            <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="mt-auto border-t border-neutral-200 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-neutral-500">
              © 2026 BridgeTrack Hackathon Prototype. Data to Action.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
