import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Scan, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FieldWorker() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Other',
    location: '',
    severity: 3,
    peopleAffected: 0,
    timeDelay: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          title: '',
          description: '',
          type: 'Other',
          location: '',
          severity: 3,
          peopleAffected: 0,
          timeDelay: 0,
        });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMockScan = () => {
    setFormData({
      title: 'Structural damage to community hall',
      description: 'The roof has partially collapsed after the heavy rains. Need immediate assessment.',
      type: 'Other',
      location: 'South Sector A',
      severity: 5,
      peopleAffected: 15,
      timeDelay: 12,
    });
  };

  // Helper to handle numeric inputs and avoid NaN issues
  const handleNumericChange = (field, value) => {
    const num = parseInt(value, 10);
    setFormData(prev => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Submit Field Report</h1>
        <p className="mt-2 text-neutral-600">Gather data from the community to trigger intervention.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleMockScan}
            className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            <Scan size={18} />
            Scan Paper (Mock)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Issue Title</label>
              <input
                required
                type="text"
                placeholder="Brief summary of the issue"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Detailed explanation of the situation"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Issue Type</label>
              <select
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Food">Food Assistance</option>
                <option value="Medical">Medical Support</option>
                <option value="Education">Education Resources</option>
                <option value="Rescue">Rescue/Emergency</option>
                <option value="Other">Other Community Issue</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Location</label>
              <input
                required
                type="text"
                placeholder="Village/Sector Name"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Severity (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-indigo-600"
                value={formData.severity || 1}
                onChange={e => handleNumericChange('severity', e.target.value)}
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Low</span>
                <span className="font-bold text-indigo-600">{formData.severity}</span>
                <span>Critical</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">People Affected</label>
              <input
                required
                type="number"
                min="0"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.peopleAffected}
                onChange={e => handleNumericChange('peopleAffected', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Time Delay (Hours)</label>
              <input
                required
                type="number"
                min="0"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.timeDelay}
                onChange={e => handleNumericChange('timeDelay', e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40 active:scale-95 disabled:bg-neutral-400",
              submitted && "bg-emerald-600 shadow-emerald-500/30"
            )}
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : submitted ? (
              <>
                <CheckCircle size={20} />
                Report Submitted!
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Report
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
