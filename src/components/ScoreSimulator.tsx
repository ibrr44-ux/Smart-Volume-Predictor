import { motion } from 'framer-motion';
import {
  Shield,
  GitBranch,
} from 'lucide-react';

interface SignalToggle {
  id: string;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
  active: boolean;
  weight: number;
  description: string;
  color: string;
}

interface Props {
  signals: SignalToggle[];
  onToggle: (id: string) => void;
  score: number;
  minScore: number;
  predict: boolean;
  priceAboveVwap: boolean;
  onToggleVwap: () => void;
}

export default function ScoreSimulator({
  signals,
  onToggle,
  score,
  minScore,
  predict,
  priceAboveVwap,
  onToggleVwap,
}: Props) {
  const scorePercent = (score / 5) * 100;

  return (
    <div className="glass-card rounded-xl p-6 glow-teal">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
          <GitBranch className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">محرك النقاط التنبؤي</h3>
          <p className="text-svp-muted text-xs">Score Engine — فعّل/أوقف الإشارات وشاهد النتيجة</p>
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-6 p-4 rounded-lg bg-svp-bg/60 border border-svp-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-svp-muted text-sm">مستوى النقاط</span>
          <span className="text-2xl font-mono font-bold">
            <span className={score >= minScore ? 'text-teal-400' : 'text-svp-muted'}>
              {score}
            </span>
            <span className="text-svp-dim"> / 5</span>
          </span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors duration-500 ${
              score >= 4
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400'
                : score === 3
                ? 'bg-gradient-to-r from-orange-500 to-yellow-400'
                : 'bg-gray-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${scorePercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-svp-dim font-mono">0</span>
          <span className="text-[10px] text-svp-dim font-mono">الحد الأدنى: {minScore}</span>
          <span className="text-[10px] text-svp-dim font-mono">5</span>
        </div>
      </div>

      {/* Signal Toggles */}
      <div className="space-y-3 mb-6">
        {signals.map((signal, i) => (
          <motion.button
            key={signal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onToggle(signal.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
              signal.active
                ? `border-teal-500/40 bg-teal-500/10`
                : 'border-svp-border bg-svp-bg/40 hover:border-gray-600'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-300 ${
                signal.active ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-800 text-gray-600'
              }`}
            >
              {signal.icon}
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${signal.active ? 'text-white' : 'text-gray-500'}`}>
                  {signal.label}
                </span>
                <span className="text-svp-dim text-xs">| {signal.labelAr}</span>
              </div>
              <p className="text-[10px] text-svp-dim mt-0.5">{signal.description}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                signal.active
                  ? 'border-teal-400 bg-teal-400'
                  : 'border-gray-600 bg-transparent'
              }`}
            >
              {signal.active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-svp-bg"
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* VWAP Gate */}
      <div
        onClick={onToggleVwap}
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer mb-6 ${
          priceAboveVwap
            ? 'border-cyan-500/40 bg-cyan-500/10'
            : 'border-svp-border bg-svp-bg/40'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            priceAboveVwap ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-600'
          }`}
        >
          <Shield className="w-4 h-4" />
        </div>
        <div className="flex-1 text-right">
          <span className={`text-sm font-bold ${priceAboveVwap ? 'text-white' : 'text-gray-500'}`}>
            VWAP GATE — البوابة المؤسسية
          </span>
          <p className="text-[10px] text-svp-dim">
            {priceAboveVwap ? 'السعر فوق VWAP ✓ — البوابة مفتوحة' : 'السعر تحت VWAP ✗ — البوابة مغلقة'}
          </p>
        </div>
        <div
          className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
            priceAboveVwap ? 'bg-teal-500/20 text-teal-300' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {priceAboveVwap ? 'OPEN' : 'LOCKED'}
        </div>
      </div>

      {/* Final Prediction */}
      <div
        className={`p-4 rounded-lg border-2 transition-all duration-500 text-center ${
          predict
            ? 'border-teal-400/50 bg-teal-500/10 animate-pulse-glow'
            : 'border-gray-700/50 bg-gray-800/20'
        }`}
      >
        <div className={`text-lg font-bold ${predict ? 'text-teal-300' : 'text-gray-600'}`}>
          {predict ? '▲ SVP — BREAKOUT PREDICTED' : '◌ NO SIGNAL'}
        </div>
        <div className="text-xs text-svp-dim mt-1">
          {predict
            ? 'تراكم مؤسسي مكتشف — دخول محتمل!'
            : `تحتاج ${minScore - score > 0 ? minScore - score : 0} نقاط إضافية + VWAP`}
        </div>
      </div>
    </div>
  );
}
