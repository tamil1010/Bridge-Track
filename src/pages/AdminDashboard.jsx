import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, RefreshCcw, Users, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:3000/api/reports');
    const data = await response.json();
    setReports(
      data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  } catch (error) {
    console.error('Fetch failed', error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchReports();
    // Simple auto-refresh
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredReports = filter === 'All' 
    ? reports 
    : reports.filter(r => r.urgencyLevel === filter);

  const stats = {
    critical: reports.filter(r => r.urgencyLevel === 'Critical').length,
    medium: reports.filter(r => r.urgencyLevel === 'Medium').length,
    low: reports.filter(r => r.urgencyLevel === 'Low').length,
    assigned: reports.filter(r => r.status !== 'Pending').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Admin Command Center</h1>
          <p className="text-neutral-600">Real-time community issue monitoring and data analysis.</p>
        </div>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
        >
          <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Critical Issues', value: stats.critical, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Medium Urgency', value: stats.medium, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Low Urgency', value: stats.low, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Assigned', value: stats.assigned, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-2xl p-6 shadow-sm border border-neutral-100", stat.bg)}>
            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
            <p className={cn("mt-2 text-3xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={18} className="text-neutral-400" />
        {['All', 'Critical', 'Medium', 'Low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap",
              filter === f 
                ? "bg-neutral-900 text-white shadow-md" 
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 py-20 text-center">
            <p className="text-neutral-500">No reports matching the criteria.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <motion.div
              layout
              key={report._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
                      report.urgencyLevel === 'Critical' ? "bg-rose-100 text-rose-700" :
                      report.urgencyLevel === 'Medium' ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    )}>
                      {report.urgencyLevel}
                    </span>
                    <span className="text-xs font-medium text-neutral-400">#{report._id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">{report.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5"><Users size={14} /> {report.peopleAffected} persons</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {report.timeDelay}h delay</span>
                    <span className="font-medium text-neutral-700">{report.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-neutral-100 pt-4 md:border-none md:pt-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Score</p>
                    <p className="text-xl font-black text-neutral-900">{report.urgencyScore.toFixed(1)}</p>
                  </div>
                  <div className={cn(
                    "flex h-10 items-center rounded-lg px-4 text-sm font-bold",
                    report.status !== 'Pending' ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-neutral-100 text-neutral-600"
                  )}>
                    {report.status}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">{report.description}</p>
              
              {/* Background Accent */}
              <div className={cn(
                "absolute bottom-0 left-0 h-1 w-full opacity-50",
                report.urgencyLevel === 'Critical' ? "bg-rose-500" :
                report.urgencyLevel === 'Medium' ? "bg-amber-500" :
                "bg-emerald-500"
              )} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
