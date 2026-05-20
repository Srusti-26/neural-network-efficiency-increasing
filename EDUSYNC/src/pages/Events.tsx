import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Search,
  ChevronRight,
  Ticket,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const events = [
  { id: 1, title: 'Neural Vision Workshop', desc: 'Dive deep into CNN pruning techniques and edge AI deployment strategies.', date: 'Oct 24, 2026', time: '10:00 AM', loc: 'Innovation Lab 2', tags: ['Research', 'AI'], registrations: 45 },
  { id: 2, title: 'Annual Tech Symposium', desc: 'The biggest gathering of tech enthusiasts in the campus focusing on smart ecosystems.', date: 'Nov 12, 2026', time: '09:00 AM', loc: 'Main Auditorium', tags: ['Conference', 'Global'], registrations: 120 },
  { id: 3, title: 'Cloud-Native Meetup', desc: 'Discussing Kubernetes and persistent storage in campus management systems.', date: 'Dec 05, 2026', time: '11:00 AM', loc: 'Hall B', tags: ['Cloud', 'DevOps'], registrations: 30 },
];

const Events = () => {
  const { isFaculty, isAdmin } = useAuth();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-2">Campus Events</h1>
          <p className="text-slate-500 italic">Explore, register, and manage campus activities.</p>
        </div>
        {(isFaculty || isAdmin) && (
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200">
            <Plus size={20} />
            Create Event
          </button>
        )}
      </header>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-2 rounded-[2.5rem] flex flex-col md:flex-row gap-6 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="w-full md:w-56 aspect-square bg-slate-900 rounded-[2rem] shrink-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Calendar className="text-white/20" size={60} />
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg">Event</span>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-500" />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex gap-2 mb-4">
                {event.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">{event.title}</h3>
              <p className="text-slate-500 text-sm italic mb-6 line-clamp-2">{event.desc}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                   <Clock size={14} className="text-slate-300" />
                   <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                   <MapPin size={14} className="text-slate-300" />
                   <span className="truncate">{event.loc}</span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                <div className="flex items-center gap-2 text-indigo-600 font-bold">
                  <Users size={16} />
                  <span className="text-sm">{event.registrations} Joined</span>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2">
                  <Ticket size={14} />
                  Register
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-6 tracking-tight">Your Event Analytics</h2>
            <p className="text-slate-400 text-lg mb-8 italic">Track your participation and optimize your campus journey using our integrated AI tools.</p>
            <div className="flex gap-4">
               <div className="bg-white/10 p-6 rounded-3xl border border-white/5">
                  <p className="text-3xl font-bold mb-1">12</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Attended</p>
               </div>
               <div className="bg-white/10 p-6 rounded-3xl border border-white/5">
                  <p className="text-3xl font-bold mb-1">4</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Certificates</p>
               </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
             <div className="flex justify-between items-center mb-6">
               <h4 className="text-sm font-bold uppercase tracking-widest">Active QR Ticket</h4>
               <div className="w-8 h-8 rounded-lg bg-indigo-500" />
             </div>
             <div className="aspect-square bg-white rounded-2xl mb-6 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-slate-900 bg-white grid grid-cols-4 gap-2 p-2">
                   {Array.from({length: 16}).map((_, i) => (
                     <div key={i} className={cn("rounded-sm", (i + (i%3)) % 2 === 0 ? "bg-slate-900" : "bg-white")} />
                   ))}
                </div>
             </div>
             <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">Neural Vision Workshop Entry</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
};

export default Events;
