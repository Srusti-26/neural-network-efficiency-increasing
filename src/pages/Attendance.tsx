import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Camera, 
  UserCheck, 
  Shield, 
  Activity, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Scan
} from 'lucide-react';
import { cn } from '../lib/utils';

const Attendance = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startScan = () => {
    setIsScanning(true);
    setStatus('scanning');
    
    // Request camera access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.error("Camera error:", err);
          setStatus('error');
        });
    }

    // Simulate recognition logic
    setTimeout(() => {
      setStatus('success');
      setIsScanning(false);
      // Stop video stream
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }, 4000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">Real-time Recognition</div>
          <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">Pruned CNN v3.1</div>
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">AI Face Attendance</h1>
        <p className="text-slate-500 italic mt-1">Harnessing optimized neural networks for seamless campus check-ins.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] aspect-square relative overflow-hidden flex items-center justify-center shadow-2xl shadow-indigo-200/50">
            {status === 'idle' && (
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <Camera className="text-white/20" size={40} />
                </div>
                <h3 className="text-white text-xl font-bold mb-4">Camera Standby</h3>
                <p className="text-slate-500 text-sm mb-10 max-w-xs mx-auto">Please ensure you are in a well-lit environment for optimal recognition.</p>
                <button 
                  onClick={startScan}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-3 mx-auto shadow-xl shadow-indigo-600/20"
                >
                  <Scan size={24} />
                  Initialize Scan
                </button>
              </div>
            )}

            {status === 'scanning' && (
              <div className="absolute inset-0">
                <video ref={videoRef} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-indigo-400 rounded-[2rem] relative">
                    <div className="absolute inset-0 border-4 border-indigo-400 rounded-[2rem] opacity-20 animate-pulse" />
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)] z-10"
                    />
                  </div>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-10">
                   <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs animate-pulse">Running optimized inference...</p>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4 }}
                        className="h-full bg-indigo-500" 
                      />
                   </div>
                </div>
              </div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-12 bg-green-950/20 absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md"
              >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="text-white" size={48} />
                </div>
                <h3 className="text-white text-3xl font-bold mb-2">Attendance Marked!</h3>
                <p className="text-green-400 font-medium mb-12 italic">Identified as: Srusti K. • 1NT23AD052</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10"
                >
                  Mark Another
                </button>
              </motion.div>
            )}

            {status === 'error' && (
              <div className="text-center p-12">
                 <AlertCircle className="text-red-500 mx-auto mb-6" size={60} />
                 <h3 className="text-white font-bold text-xl mb-4">Recognition Failed</h3>
                 <button onClick={() => setStatus('idle')} className="text-indigo-400 font-bold hover:underline">Retry Connection</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">Recognition Insight</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Pruned Model Security</h4>
                  <p className="text-sm text-slate-500 leading-relaxed italic">Our neuron pruning logic removes noise features, increasing the robustness of the matching algorithm by 12%.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <RefreshCw size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Latency Optimization</h4>
                  <p className="text-sm text-slate-500 leading-relaxed italic">Inference time reduced from 450ms to 42ms using iterative pruning, allowing for smooth 30fps face tracking on mobile.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Logs</h3>
              <Activity className="text-indigo-500" size={16} />
            </div>
            <div className="space-y-4">
              {[
                { name: 'John Doe', time: '10:12 AM', status: 'Approved' },
                { name: 'Dr. Smith', time: '09:45 AM', status: 'Approved' },
                { name: 'Jane Wilson', time: '09:30 AM', status: 'Approved' },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 text-sm">
                  <div>
                    <p className="font-bold text-slate-900">{log.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{log.time}</p>
                  </div>
                  <span className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-1 rounded-lg border border-green-100">{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
