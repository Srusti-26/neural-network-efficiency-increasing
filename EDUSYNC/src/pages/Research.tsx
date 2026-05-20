import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  FlaskConical, 
  Cpu, 
  Zap, 
  Activity, 
  Maximize2, 
  ChevronRight,
  TrendingDown,
  Timer
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { cn } from '../lib/utils';

const radarData = [
  { subject: 'Memory', A: 120, B: 110, fullMark: 150 },
  { subject: 'CPU', A: 98, B: 130, fullMark: 150 },
  { subject: 'Accuracy', A: 86, B: 130, fullMark: 150 },
  { subject: 'Latency', A: 99, B: 100, fullMark: 150 },
  { subject: 'Size', A: 85, B: 90, fullMark: 150 },
];

const Research = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/research/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center px-4">
          <FlaskConical className="text-indigo-400" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">AI Optimization Module</h1>
          <p className="text-slate-500 italic">“Improving Neural Network Efficiency Using Neuron Pruning Techniques”</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6">Theoretical Foundation</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Neuron Pruning (IMP)</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 italic border-l-4 border-indigo-100 pl-4">
                    Iterative Magnitude Pruning removes weights with the smallest absolute values, effectively reducing model size while maintaining critical activation patterns.
                  </p>
                  <div className="flex gap-3">
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">vGG16 PRUNED</div>
                    <div className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest">PYTORCH CORE</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-center">
                  <div className="space-y-4 w-full">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Pruning Factor</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full h-12 bg-white rounded-xl border border-slate-100 relative overflow-hidden flex gap-1 px-4 items-center">
                      {[20, 40, 15, 60, 30, 80, 10, 40].map((h, i) => (
                        <div key={i} className={cn("flex-1 rounded-sm", i > 4 ? "bg-slate-100" : "bg-indigo-500")} style={{ height: `${h}%` }} />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-indigo-600 font-bold">OPTIMIZING...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="text-green-500" size={18} />
                  Performance Metrics
                </h4>
                <div className="space-y-6">
                  {metrics ? (
                    <>
                      <MetricItem label="Accuracy" val={metrics.optimizedModel.accuracy} original={metrics.originalModel.accuracy} type="up" />
                      <MetricItem label="Model Size" val={metrics.optimizedModel.size} original={metrics.originalModel.size} type="down" />
                      <MetricItem label="Inference" val={metrics.optimizedModel.inferenceTime} original={metrics.originalModel.inferenceTime} type="down" />
                    </>
                  ) : <p className="text-slate-400 italic text-sm">Loading neural metrics...</p>}
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-[350px]">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Compression Radar</h4>
              <ResponsiveContainer width="100%" height="80%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                  <Radar name="Efficient" dataKey="B" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
            <h3 className="text-xl font-bold mb-8 tracking-tight">Optimization Results</h3>
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Maximize2 size={24} />
                </div>
                <div>
                  <p className="text-3xl font-bold">4.4<span className="text-indigo-400">x</span></p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Compression</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Timer size={24} />
                </div>
                <div>
                  <p className="text-3xl font-bold">73<span className="text-indigo-400">%</span></p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Latency Reduction</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 p-8">
               <Zap className="text-white/5" size={120} strokeWidth={1} />
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-900 mb-6 tracking-tight">Pruning Summary</h3>
            <div className="space-y-4">
              {metrics?.layers.map((layer: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-indigo-800">{layer.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 italic">-{layer.pruned} nodes</span>
                    <span className="text-slate-600 font-bold">{Math.round((layer.pruned/layer.nodes)*100)}%</span>
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

const MetricItem = ({ label, val, original, type }: any) => (
  <div>
    <div className="flex justify-between items-end mb-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn("text-xs font-bold", type === 'up' ? "text-green-500" : "text-blue-500")}>
          {val}
        </span>
        <span className="text-[10px] text-slate-300 line-through italic">{original}</span>
      </div>
    </div>
    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all duration-1000", type === 'up' ? "bg-green-500" : "bg-blue-500")} style={{ width: '85%' }} />
    </div>
  </div>
);

export default Research;
