import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  Plus, 
  Hash,
  ChevronDown,
  BookOpen,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const resources = [
  { id: 1, title: 'Data Structures - Graphs', type: 'notes', semester: 4, subject: 'CSE401', author: 'Prof. Miller', date: 'Oct 12' },
  { id: 2, title: 'Operating Systems - Final PYQ', type: 'pyq', semester: 5, subject: 'CSE502', author: 'EduSync Bot', date: 'Oct 10' },
  { id: 3, title: 'Web Frameworks - Assignment 1', type: 'assignment', semester: 6, subject: 'CSE601', author: 'Dr. Zhang', date: 'Oct 8' },
  { id: 4, title: 'Machine Learning - Unit 2', type: 'notes', semester: 7, subject: 'AI701', author: 'Prof. Wilson', date: 'Oct 5' },
];

const Resources = () => {
  const { isFaculty } = useAuth();
  const [activeType, setActiveType] = useState('all');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-2">Academic Hub</h1>
          <p className="text-slate-500 italic">Centralized sharing for all your study materials.</p>
        </div>
        {isFaculty && (
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200">
            <Plus size={20} />
            Upload Resource
          </button>
        )}
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 block ml-1">Type</label>
                <div className="flex flex-col gap-2">
                  {['all', 'notes', 'pyq', 'assignment'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setActiveType(t)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all capitalize",
                        activeType === t ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-50 text-slate-500"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 block ml-1">Semester</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <button key={s} className="aspect-square flex items-center justify-center bg-slate-50 rounded-lg text-xs font-bold text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search resources by subject code or title..." 
              className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-3xl shadow-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-4">
            {resources.filter(r => activeType === 'all' || r.type === activeType).map((res) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-100 hover:border-indigo-100 transition-all group"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                    res.type === 'notes' ? "bg-indigo-50 text-indigo-600" : res.type === 'pyq' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                  )}>
                    <FileText size={28} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xl font-bold text-slate-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">{res.title}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 uppercase tracking-wider font-bold text-[10px] text-indigo-500">
                        <Hash size={12} /> {res.subject}
                      </span>
                      <span>By {res.author}</span>
                      <span>Semester {res.semester}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <Download size={14} />
                    Download
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
