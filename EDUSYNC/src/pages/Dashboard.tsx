import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  ArrowUpRight,
  Plus,
  FlaskConical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', attendance: 85, performance: 70 },
  { name: 'Tue', attendance: 88, performance: 72 },
  { name: 'Wed', attendance: 92, performance: 80 },
  { name: 'Thu', attendance: 90, performance: 75 },
  { name: 'Fri', attendance: 95, performance: 85 },
];

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
        <ArrowUpRight size={16} />
        <span>+12%</span>
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{title}</h3>
    <div className="text-3xl font-display font-bold text-slate-900 mb-1">{value}</div>
    <p className="text-slate-400 text-xs">{sub}</p>
  </div>
);

const Dashboard = () => {
  const { profile, isAdmin, isFaculty, isStudent } = useAuth();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">
            {isStudent ? 'My Academic Hub' : isFaculty ? 'Faculty Control Center' : 'System Administration'}
          </h1>
          <p className="text-slate-500 italic mt-1">Welcome back, {profile?.displayName}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/notifications" className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={20} />
          </Link>
          <button className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2">
            <Plus size={20} />
            {isFaculty ? 'Upload Resource' : isAdmin ? 'Global Announcement' : 'Register for Event'}
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Attendance" 
          value="92.4%" 
          sub="Overall Semester Rate" 
          icon={UserCheck} 
          color="bg-green-50 text-green-600"
        />
        <StatCard 
          title="Resources" 
          value="124" 
          sub="Notes & PYQs Accessible" 
          icon={BookOpen} 
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Active Events" 
          value="8" 
          sub="This Month" 
          icon={Calendar} 
          color="bg-orange-50 text-orange-600"
        />
        <StatCard 
          title="Performance" 
          value="8.4" 
          sub="Current GPA Avg" 
          icon={TrendingUp} 
          color="bg-indigo-50 text-indigo-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Charts */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-bold text-slate-900">Academic Analytics</h4>
              <select className="bg-slate-50 border-none rounded-xl text-xs font-bold uppercase tracking-widest px-4 py-2 outline-none">
                <option>Weekly View</option>
                <option>Monthly View</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                  <Area type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs tracking-widest mb-4">
                <FlaskConical size={14} />
                <span>AI Insights</span>
              </div>
              <h4 className="text-2xl font-bold mb-4 tracking-tight">Your Efficiency is improving</h4>
              <p className="text-slate-400 mb-6 max-w-lg italic">
                Our Pruned Neural Network predicts a 4% increase in your attendance trends based on current event participation.
              </p>
              <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all text-sm">
                View Full Analysis
              </button>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 border border-indigo-500/20 rounded-full blur-2xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-xl font-bold text-slate-900 mb-6">Recent Resources</h4>
            <div className="space-y-4">
              {[
                { title: 'Computer Networks - Unit 3', type: 'Notes', date: '2h ago' },
                { title: 'Discrete Math - PYQ 2025', type: 'PYQ', date: '5h ago' },
                { title: 'AI Ethics Case Study', type: 'Assignment', date: 'Yesterday' },
              ].map((res, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{res.title}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{res.type} • {res.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 border border-slate-100 text-slate-500 rounded-2xl font-bold mt-6 text-sm hover:bg-slate-50 transition-colors">
              View All Resources
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-xl font-bold text-slate-900 mb-6">Upcoming Events</h4>
            <div className="space-y-4">
              {[
                { title: 'Smart Campus Workshop', time: '10:00 AM', loc: 'Hall A' },
                { title: 'Python for AI Bootcamp', time: '02:00 PM', loc: 'Lab 4' },
              ].map((ev, i) => (
                <div key={i} className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-900">{ev.title}</p>
                    <div className="bg-white px-2 py-1 rounded-lg text-[10px] font-bold text-indigo-600 uppercase border border-slate-100 shadow-sm">Today</div>
                  </div>
                  <p className="text-xs text-slate-500 italic">{ev.time} • {ev.loc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
