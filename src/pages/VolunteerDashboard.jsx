import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CheckCircle, LogOut, Award, AlertCircle, Briefcase, Trophy, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const API = "http://localhost:3000";

export default function VolunteerDashboard() {
  const [user, setUser] = useState(null);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('volunteer');

    if (!savedUser) {
      navigate('/volunteer-auth');
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (!parsedUser || !parsedUser._id) {
      console.error("Invalid user data");
      navigate('/volunteer-auth');
      return;
    }

    setUser(parsedUser);
    fetchData(parsedUser._id);
  }, [navigate]);

  const fetchData = async (userId) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const [availableRes, myRes] = await Promise.all([
        fetch(`${API}/api/volunteers/${userId}/matching-tasks`),
        fetch(`${API}/api/volunteers/${userId}/my-tasks`)
      ]);

      const availableData = await availableRes.json();
      const myData = await myRes.json();

      setAvailableTasks(availableData);
      setMyTasks(
        myData.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      console.error('Fetch data failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (reportId) => {
    if (!user) return;

    try {
      const response = await fetch(`${API}/api/reports/${reportId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerId: user._id }),
      });

      if (response.ok) {
        const acceptedTask = await response.json();

        setAvailableTasks(prev => prev.filter(t => t._id !== reportId));
        setMyTasks(prev => [acceptedTask, ...prev]);
        setActiveTab('my');
      }
    } catch (err) {
      console.error('Accept task failed', err);
    }
  };

  const handleComplete = async (reportId) => {
    if (!user) return;

    try {
      const response = await fetch(`${API}/api/reports/${reportId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerId: user._id }),
      });

      if (response.ok) {
        const { report, points } = await response.json();

        const updatedUser = { ...user, points };
        setUser(updatedUser);
        localStorage.setItem('volunteer', JSON.stringify(updatedUser));

        setMyTasks(prev =>
          prev.map(t => t._id === reportId ? report : t)
        );
      }
    } catch (err) {
      console.error('Complete task failed', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('volunteer');
    navigate('/volunteer-auth');
  };

  if (!user) return null;

  return (
  <div className="space-y-8">

    {/* HEADER */}
    <div className="flex flex-col gap-6 rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm md:flex-row md:items-center">
      
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
          <Award size={36} />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-900">{user.name}</h1>
          <span className="bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold rounded-full">
            + {user.points || 0} POINTS
          </span>
        </div>

        <div className="flex gap-4 text-sm text-neutral-500 mt-1">
          <span className="flex items-center gap-1">
            <MapPin size={14}/> {user.location}
          </span>
          <span className="text-indigo-600 font-medium">
            {user.skills.join(', ')}
          </span>
        </div>
      </div>

      <button
        onClick={logout}
        className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
      >
        Logout
      </button>
    </div>

    {/* TABS */}
    <div className="flex gap-6 pb-2">
      {['available', 'my'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "pb-2 font-semibold",
            activeTab === tab
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-400"
          )}
        >
          {tab === 'available' ? 'Available Tasks' : 'My Tasks'}
        </button>
      ))}
    </div>

    {/* CONTENT */}
    <AnimatePresence mode="wait">
      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"/>
        </div>
      ) : (
        <motion.div key={activeTab} className="space-y-6">

          {(activeTab === 'available' ? availableTasks : myTasks).length === 0 ? (
            <div className="border-2 border-dashed rounded-2xl py-20 text-center text-gray-400">
              No tasks available
            </div>
          ) : (

            (activeTab === 'available' ? availableTasks : myTasks).map(task => (

              <div
                key={task._id}
                className="flex flex-col gap-6 rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm md:flex-row md:items-center"
              >

                {/* LEFT */}
                <div className="space-y-2 max-w-xl">
                  
                  <div className="flex gap-2 items-center">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded font-bold",
                      task.urgencyLevel === 'Critical'
                        ? "bg-red-100 text-red-600"
                        : task.urgencyLevel === 'Medium'
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    )}>
                      {task.urgencyLevel}
                    </span>

                    <span className="text-xs text-gray-400">
                      {task.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold">
                    {task.title}
                  </h3>

                  <p className="text-gray-600 text-sm">
                    {task.description}
                  </p>

                  <div className="text-sm text-gray-500 flex gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={14}/> {task.location}
                    </span>
                    <span className="text-indigo-600">
                      Impact: {task.peopleAffected}
                    </span>
                  </div>
                </div>

                {/* RIGHT ACTION */}
                <div>
                  {task.status === 'Pending' && (
                    <button
                      onClick={() => handleAccept(task._id)}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700"
                    >
                      Accept Task
                    </button>
                  )}

                  {task.status === 'In Progress' && (
                    <button
                      onClick={() => handleComplete(task._id)}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {task.status === 'Completed' && (
                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}