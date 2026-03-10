import { motion } from "framer-motion";
import { Activity, Battery, PawPrint } from "lucide-react";

interface ResultCardProps {
  result: {
    humanAge: number;
    lifeStage: {
      label: string;
      badgeColor: string;
      message: string;
    };
    primeStage: {
      label: string;
      description: string;
    };
    energyLevel: {
      level: "High" | "Moderate" | "Low";
      description: string;
    };
    activityNeeds: {
      capacity: string;
      description: string;
    };
    ageProgress: number;
  };
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-card rounded-3xl overflow-hidden shadow-xl border-4 border-white/50"
    >
      {/* Header Result */}
      <div className="bg-[#E5CD6C] p-10 text-center relative overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.1)] rounded-t-[2.5rem]">
        {/* Vibrant Background Accents */}
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            x: [-30, 30, -30],
            y: [-30, 30, -30],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-80 h-80 bg-white/30 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ 
            scale: [1.4, 1, 1.4],
            x: [30, -30, 30],
            y: [30, -30, 30],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#AE6427]/30 rounded-full blur-[100px] pointer-events-none"
        />
        
        {/* Modern Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[radial-gradient(#2F1313_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative z-10"
        >
          <div className="text-xl font-black text-[#2F1313]/80 uppercase tracking-[0.3em] mb-8 flex items-center justify-center gap-5">
            <div className="h-1 w-12 bg-[#2F1313]/30 rounded-full" />
            <motion.div
              animate={{ rotate: [0, 25, -25, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <PawPrint className="w-7 h-7 text-[#AE6427]" />
            </motion.div>
            Human Years
            <motion.div
              animate={{ rotate: [0, -25, 25, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <PawPrint className="w-7 h-7 text-[#AE6427]" />
            </motion.div>
            <div className="h-1 w-12 bg-[#2F1313]/30 rounded-full" />
          </div>
          
          <div className="relative inline-flex items-center justify-center">
            {/* Main Age Number with High Contrast */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[11rem] font-black text-[#2F1313] font-display leading-none drop-shadow-[0_15px_15px_rgba(47,19,19,0.3)] relative z-10"
            >
              {Math.floor(result.humanAge)}
            </motion.div>
            
            {/* Pulsating Halo Aura */}
            <motion.div
              animate={{ 
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.3, 1]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute w-[120%] h-[120%] bg-white/60 rounded-full blur-[90px] -z-10"
            />
          </div>
        </motion.div>
      </div>

      <div className="p-6 space-y-5 bg-white/50">
        {/* Life Stage Section - High Impact */}
        <div className="bg-[#E5CD6C]/10 p-5 rounded-2xl border-2 border-[#E5CD6C]/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <PawPrint className="w-12 h-12 text-[#AE6427]" />
          </div>
          <div className="text-[#AE6427] text-xs font-black uppercase tracking-widest mb-1">Your Dog's Life Stage</div>
          <div className="flex items-center gap-3 mb-2">
             <div className="text-3xl font-black text-[#2F1313] drop-shadow-sm">
               {result.lifeStage.label}
             </div>
             <span
              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm text-white"
              style={{ backgroundColor: result.lifeStage.badgeColor }}
            >
              Current Stage
            </span>
          </div>
          <div className="h-1 w-20 bg-[#AE6427] rounded-full mb-3" />
          <p className="text-lg font-bold italic text-[#2F1313]/90 leading-tight">
            "{result.lifeStage.message}"
          </p>
        </div>

        {/* Prime Stage Section */}
        <div className="bg-[#AE6427]/10 p-4 rounded-2xl border border-[#AE6427]/20">
          <div className="text-[#AE6427]/60 text-xs font-bold uppercase mb-1">Prime Status</div>
          <div className="text-xl font-bold text-[#2F1313] mb-1">
            {result.primeStage.label}
          </div>
          <p className="text-sm text-[#2F1313]/80 leading-snug">
            {result.primeStage.description}
          </p>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-3 bg-[#F9F3B9]/30 p-5 rounded-2xl border border-[#E5CD6C]/20">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="text-[#2F1313] font-bold text-sm">Life Journey Progress</div>
              <div className="text-[10px] text-[#2F1313]/60 font-medium uppercase tracking-wider">How much of their path they've traveled</div>
            </div>
            <div className="text-2xl font-black text-[#AE6427]">{Math.round(result.ageProgress)}%</div>
          </div>
          
          <div className="h-4 w-full bg-[#E5CD6C]/20 rounded-full overflow-hidden border border-[#E5CD6C]/30 relative shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.ageProgress}%` }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#AE6427] via-[#E5CD6C] to-[#AE6427] rounded-full relative"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress_1s_linear_infinite]" />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="text-[10px] leading-tight text-[#2F1313]/70 font-medium">
              Every dog's journey is unique. This tracker shows their current position in their estimated natural life span.
            </div>
            <div className="text-[10px] leading-tight text-[#2F1313]/70 font-medium text-right italic">
              A dog age calculator in human years helps you understand where they are on this beautiful path.
            </div>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/80 p-4 rounded-2xl border border-[#E5CD6C]/20 hover-elevate">
            <div className="flex items-center gap-2 mb-2 text-[#AE6427] font-bold">
              <Battery className="w-5 h-5" />
              <div>Energy Level</div>
            </div>
            <p className="text-2xl font-bold text-[#2F1313] font-display">
              {result.energyLevel.level}
            </p>
            <p className="text-sm text-[#2F1313]/70 mt-1 leading-snug">
              {result.energyLevel.description}
            </p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-[#E5CD6C]/20 hover-elevate">
            <div className="flex items-center gap-2 mb-2 text-[#AE6427] font-bold">
              <Activity className="w-5 h-5" />
              <div>Activity Needs</div>
            </div>
            <p className="text-lg font-bold text-[#2F1313] font-display">
              {result.activityNeeds.capacity}
            </p>
            <p className="text-sm text-[#2F1313]/70 mt-1 leading-snug">
              {result.activityNeeds.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
