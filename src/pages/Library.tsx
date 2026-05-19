import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Bookmark, 
  Download, 
  ExternalLink,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const books = [
  { id: 1, title: 'Introduction to Neural Networks', author: 'Dr. Sarah J.', category: 'AI/ML', cover: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=500&q=80', status: 'available' },
  { id: 2, title: 'Deep Learning on Edge', author: 'Markus Chen', category: 'Computing', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80', status: 'available' },
  { id: 3, title: 'Smart Campus Systems', author: 'A. Roberts', category: 'Architecture', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=80', status: 'borrowed' },
  { id: 4, title: 'Optimization Techniques', author: 'R. Simmons', category: 'Mathematics', cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80', status: 'available' },
];

const Library = () => {
  const [activeCat, setActiveCat] = useState('All');
  const cats = ['All', 'AI/ML', 'Computing', 'Mathematics', 'Architecture', 'Journals'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-4">Smart Digital Library</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, author or ISBN..." 
              className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-3xl shadow-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            />
          </div>
          <button className="px-8 py-5 bg-white border border-slate-200 rounded-3xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={20} />
            Advanced
          </button>
        </div>
      </header>

      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide">
        {cats.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={cn(
              "px-8 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all",
              activeCat === cat 
                ? "bg-slate-900 text-white shadow-lg" 
                : "bg-white text-slate-500 hover:bg-slate-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-bold text-slate-900">Recommended for you</h2>
            <Link to="#" className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {books.filter(b => activeCat === 'All' || b.category === activeCat).map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group cursor-pointer flex flex-col h-full"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={book.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase text-indigo-600 tracking-widest">{book.category}</span>
                  </div>
                  <button className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-md rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                    <Bookmark size={18} />
                  </button>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 font-medium italic underline decoration-slate-200">by {book.author}</p>
                  
                  <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-6">
                    <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                      <BookOpen size={14} />
                      Read Now
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-xl font-bold mb-6 tracking-tight">Your Reading Journey</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <span>Current Progress</span>
                  <span>68%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[68%] h-full bg-indigo-500 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                <Clock className="text-indigo-400" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Intro to CNNs</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Modified at 3:12 PM</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
              Continue Reading
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Recently Added</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 group cursor-pointer items-center">
                  <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=100&q=80`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Advanced Physics V{i}</p>
                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                      <Star size={10} fill="currentColor" />
                      <span>4.{8+i}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
