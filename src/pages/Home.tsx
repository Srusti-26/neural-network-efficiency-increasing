import React from 'react';
import { motion } from 'motion/react';
import { 
  FlaskConical, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Github,
  Award,
  Globe,
  LineChart,
  Library,
  UserCheck,
  BookOpen,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8"
          >
            <FlaskConical size={16} />
            <span>Research-Backed Academic Ecosystem</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-slate-900 mb-8"
          >
            Edu<span className="text-indigo-600">Sync</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            A modern intelligent academic platform integrating <span className="font-semibold text-slate-900 underline decoration-indigo-400">Neuron Pruning</span> techniques for optimized smart campus management.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/auth" 
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 group"
            >
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/research" 
              className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Learn Research
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Research Contribution */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">The Research</h2>
              <h3 className="text-4xl font-display font-bold text-slate-900 mb-6 tracking-tight">
                Improving Neural Network Efficiency Using Neuron Pruning
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                EduSync isn't just a management tool; it's a testbed for state-of-the-art model compression. By implementing magnitude-based neuron pruning, we reduce AI inference costs by up to 75% without sacrificing accuracy.
              </p>
              <ul className="space-y-4 mb-8 text-slate-700">
                <li className="flex items-center gap-3">
                  <Zap className="text-orange-500" size={20} />
                  <span>Iterative Magnitude Pruning for sub-campus Edge-AI</span>
                </li>
                <li className="flex items-center gap-3">
                  <Cpu className="text-blue-500" size={20} />
                  <span>Real-time Face Recognition with pruned CNNs</span>
                </li>
                <li className="flex items-center gap-3">
                  <LineChart className="text-green-500" size={20} />
                  <span>Optimized analytics with causal inference modeling</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-slate-500 text-sm italic">Standard Architecture</span>
                  <div className="flex gap-1 h-32 items-end">
                    {[40, 70, 90, 85, 60, 45].map((h, i) => (
                      <div key={i} className="w-8 bg-slate-200 rounded-t-lg" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-slate-100 pt-6">
                  <span className="text-indigo-600 font-bold uppercase text-sm">EduSync Optimized</span>
                  <div className="flex gap-1 h-32 items-end">
                    {[40, 70, 90, 85, 60, 45].map((h, i) => (
                      <div key={i} className="w-8 bg-indigo-500 rounded-t-lg" style={{ height: `${h * 0.4}%` }} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 text-center">
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <div className="text-2xl font-bold text-indigo-700">75%</div>
                    <div className="text-xs text-indigo-600 uppercase font-bold tracking-widest">Reduction</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <div className="text-2xl font-bold text-green-700">3.8x</div>
                    <div className="text-xs text-green-600 uppercase font-bold tracking-widest">Inference SPD</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight">Ecosystem Features</h2>
          <p className="text-slate-600 max-w-2xl mx-auto italic">Industry-level platform for modern university needs.</p>
        </div>
        
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Digital E-Library", 
              desc: "Complete smart library with categorization, PDF reader, and history tracking.",
              icon: Library,
              color: "bg-blue-50 text-blue-600"
            },
            { 
              title: "Face Attendance", 
              desc: "Automated attendance via neural network-powered face recognition.",
              icon: UserCheck,
              color: "bg-green-50 text-green-600"
            },
            { 
              title: "Resource Sharing", 
              desc: "Centralized hub for notes, PYQs, and assignments with smart filters.",
              icon: BookOpen,
              color: "bg-purple-50 text-purple-600"
            },
            { 
              title: "Event Hub", 
              desc: "End-to-end event management, registration, and QR ticketing.",
              icon: Calendar,
              color: "bg-orange-50 text-orange-600"
            },
            { 
              title: "Smart Search", 
              desc: "Global AI-powered search for resources, students, and events.",
              icon: Globe,
              color: "bg-cyan-50 text-cyan-600"
            },
            { 
              title: "Deep Analytics", 
              desc: "Performance tracking and attendance trends for all campus roles.",
              icon: LineChart,
              color: "bg-indigo-50 text-indigo-600"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-slate-100 transition-all group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.color)}>
                <feature.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer / Team */}
      <footer className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-8">Ready to modernize your campus?</h2>
            <Link 
              to="/auth" 
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all inline-block shadow-lg shadow-indigo-500/20"
            >
              Launch EduSync
            </Link>
          </div>
          
          <div className="pt-20 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left">
              <div className="text-xl font-bold mb-2">EduSync</div>
              <p className="text-slate-400 text-sm uppercase tracking-widest">Neural Network Optimization Project</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-indigo-400 transition-colors"><Github /></a>
              <a href="#" className="hover:text-indigo-400 transition-colors"><Award /></a>
              <a href="#" className="hover:text-indigo-400 transition-colors"><Globe /></a>
            </div>
          </div>
          <div className="mt-8 text-slate-500 text-sm">
            © 2026 EduSync Research Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
