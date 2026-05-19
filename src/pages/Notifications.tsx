import React from 'react';
import { motion } from 'motion/react';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

const notifications = [
  { id: 1, title: 'Attendance Marked', message: 'Your attendance for AI Research Unit 2 was successfully recorded via face scan.', type: 'success', time: '10 min ago' },
  { id: 2, title: 'New Resource Uploaded', message: 'Prof. Miller uploaded "Data Structures - Graphs" to the CSE401 resource hub.', type: 'info', time: '2 hours ago' },
  { id: 3, title: 'Event Reminder', message: 'The Neural Vision Workshop starts in 2 hours at Innovation Lab 2.', type: 'warning', time: '3 hours ago' },
  { id: 4, title: 'System Maintenance', message: 'The EduSync platform will be down for optimization tonight at 12:00 AM.', type: 'info', time: 'Yesterday' },
];

const Notifications = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-2">Notifications</h1>
          <p className="text-slate-500 italic">Stay updated with system alerts and academic announcements.</p>
        </div>
        <button className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
           <Trash2 size={16} />
           Clear All
        </button>
      </header>

      <div className="space-y-4">
        {notifications.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow"
          >
            <div className={cn(
              "p-3 rounded-2xl shrink-0",
              note.type === 'success' ? "bg-green-50 text-green-600" : 
              note.type === 'warning' ? "bg-amber-50 text-amber-600" : 
              note.type === 'error' ? "bg-red-50 text-red-600" : 
              "bg-blue-50 text-blue-600"
            )}>
              {note.type === 'success' ? <CheckCircle size={20} /> : 
               note.type === 'warning' ? <AlertTriangle size={20} /> : 
               note.type === 'error' ? <XCircle size={20} /> : 
               <Info size={20} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-900">{note.title}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{note.time}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed italic">{note.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {notifications.length === 0 && (
         <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <Bell className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 italic">No new notifications</p>
         </div>
      )}
    </div>
  );
};

export default Notifications;
