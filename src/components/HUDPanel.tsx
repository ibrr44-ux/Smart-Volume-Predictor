import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HUDProps {
  score: number;
  signals: {
    rvol_active: boolean;
    rvol_value: number;
    z_bullish: boolean;
    z_delta: number;
    cvd_rising: boolean;
    cvd_divergence: boolean;
    absorption: boolean;
    price_above_vwap: boolean;
    vwap_slope_up: boolean;
    vwap_val: number;
  };
  predict: boolean;
}

export default function HUDPanel({ score, signals, predict }: HUDProps) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scoreBar = score >= 4 ? '████' : score === 3 ? '███░' : score === 2 ? '██░░' : score === 1 ? '█░░░' : '░░░░';
  const scoreColor = score >= 4 ? 'bg-teal-600/40' : score === 3 ? 'bg-orange-600/30' : 'bg-gray-700/30';

  const statusText = (cond: boolean, passText = '● PASS', failText = '○ ----') =>
    cond ? passText : failText;

  const vwapBiasTxt = signals.price_above_vwap && signals.vwap_slope_up
    ? 'UP  ↑'
    : signals.price_above_vwap
    ? 'UP  →'
    : 'DOWN ↓';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl overflow-hidden w-full max-w-md mx-auto"
    >
      {/* Scan line effect */}
      <div className="relative overflow-hidden">
        {flicker && (
          <div className="absolute inset-0 bg-teal-500/5 z-10 pointer-events-none" />
        )}
        
        {/* Header */}
        <div className="grid grid-cols-2">
          <div className="bg-[#0d1117]/90 px-4 py-3 border-r border-svp-border">
            <div className="text-teal-400 text-xs font-bold tracking-wider">Smart Volume Predictor</div>
            <div className="text-svp-dim text-[10px] mt-0.5 font-mono">v6 // PineScript</div>
          </div>
          <div
            className={`px-4 py-3 text-center text-xs font-bold tracking-wide transition-colors duration-500 ${
              predict
                ? 'bg-teal-600/30 text-white'
                : signals.absorption
                ? 'bg-orange-600/20 text-orange-200'
                : 'bg-[#1a1f2e]/60 text-svp-muted'
            }`}
          >
            {predict ? '◈ BREAKOUT PREDICTED' : signals.absorption ? '◉ ABSORPTION ACTIVE' : '◌ MONITORING'}
          </div>
        </div>

        {/* Score Bar */}
        <div className="grid grid-cols-2 border-t border-svp-border">
          <div className="bg-[#111827]/80 px-4 py-2.5 border-r border-svp-border">
            <span className="text-svp-muted text-xs">SCORE</span>
          </div>
          <div className={`${scoreColor} px-4 py-2.5 text-center`}>
            <span className="text-white text-xs font-mono">
              {score} / 5 &nbsp; {scoreBar}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="grid grid-cols-2 border-t border-svp-border">
          <div className="bg-[#1a1f2e]/60 px-4 py-2 border-r border-svp-border">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest">METRIC</span>
          </div>
          <div className="bg-[#1a1f2e]/60 px-4 py-2 text-center">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest">STATUS</span>
          </div>
        </div>

        {/* Rows */}
        {[
          { label: `RVOL  ${signals.rvol_value.toFixed(2)}x`, status: statusText(signals.rvol_active), active: signals.rvol_active, color: 'teal' },
          { label: `zΔ  ${signals.z_delta.toFixed(2)}`, status: statusText(signals.z_bullish), active: signals.z_bullish, color: 'teal' },
          { label: `CVD Δ  ${signals.cvd_rising ? '↑' : '↓'}`, status: statusText(signals.cvd_rising), active: signals.cvd_rising, color: 'teal' },
          {
            label: 'CVD DIV',
            status: signals.cvd_divergence ? '● HIGH PROB' : '○ ----',
            active: signals.cvd_divergence,
            color: 'yellow',
          },
          {
            label: 'ABSORPTION',
            status: signals.absorption ? '● DETECTED' : '○ ----',
            active: signals.absorption,
            color: 'orange',
          },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-2 border-t border-svp-border">
            <div className="bg-[#111827]/60 px-4 py-2 border-r border-svp-border">
              <span className="text-svp-muted text-xs font-mono">{row.label}</span>
            </div>
            <div
              className={`px-4 py-2 text-center transition-colors duration-300 ${
                row.active
                  ? row.color === 'yellow'
                    ? 'bg-yellow-600/20'
                    : row.color === 'orange'
                    ? 'bg-orange-600/20'
                    : 'bg-teal-600/20'
                  : 'bg-gray-700/20'
              }`}
            >
              <span className={`text-xs font-mono ${row.active ? 'text-white' : 'text-gray-500'}`}>
                {row.status}
              </span>
            </div>
          </div>
        ))}

        {/* VWAP Bias */}
        <div className="grid grid-cols-2 border-t border-svp-border">
          <div className="bg-[#111827]/60 px-4 py-2 border-r border-svp-border">
            <span className="text-svp-muted text-xs font-mono">VWAP BIAS</span>
          </div>
          <div
            className={`px-4 py-2 text-center ${
              signals.price_above_vwap ? 'bg-teal-600/20' : 'bg-red-600/20'
            }`}
          >
            <span className="text-white text-xs font-mono">{vwapBiasTxt}</span>
          </div>
        </div>

        {/* Gate */}
        <div className="grid grid-cols-2 border-t border-svp-border">
          <div
            className={`px-4 py-3 text-center text-xs font-bold transition-colors duration-500 ${
              predict ? 'bg-teal-600/20 text-teal-100' : 'bg-gray-700/20 text-gray-500'
            }`}
          >
            {predict ? 'GATE: OPEN ▲ LONG' : 'GATE: CLOSED'}
          </div>
          <div
            className={`px-4 py-3 text-center text-xs font-mono transition-colors duration-500 ${
              predict ? 'bg-teal-600/20 text-white' : 'bg-gray-700/20 text-gray-500'
            }`}
          >
            VWAP: {signals.vwap_val.toFixed(2)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
