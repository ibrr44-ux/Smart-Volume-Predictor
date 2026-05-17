import { motion } from 'framer-motion';

interface HUDProps {
  direction: 'long' | 'short';
  score: number;
  signals: Record<string, boolean>;
  htfFilter: boolean;
  vwapGate: boolean;
  cooldown: number;
}

export default function HUDPanelV2({ direction, score, signals, htfFilter, vwapGate, cooldown }: HUDProps) {
  const isBull = direction === 'long';
  const color = isBull ? '#14b8a6' : '#ef4444';

  const earlyLevel = score >= 3.0 && vwapGate && htfFilter;
  const confirmedLevel = score >= 5.0 && vwapGate && htfFilter;
  const strongLevel = score >= 6.0 && vwapGate && htfFilter;

  const activeSignal = strongLevel ? 'strong' : confirmedLevel ? 'confirmed' : earlyLevel ? 'early' : 'none';

  const hdrBg = activeSignal === 'strong'
    ? 'bg-yellow-600/30'
    : activeSignal === 'confirmed'
    ? (isBull ? 'bg-teal-600/30' : 'bg-red-600/30')
    : activeSignal === 'early'
    ? 'bg-orange-600/20'
    : 'bg-[#1a1f2e]/60';

  const hdrTxt = activeSignal === 'strong'
    ? '⭐ STRONG SIGNAL'
    : activeSignal === 'confirmed'
    ? (isBull ? '▲ LONG CONFIRMED' : '▼ SHORT CONFIRMED')
    : activeSignal === 'early'
    ? '⚡ EARLY WARNING'
    : '◌ MONITORING';

  const scoreBar = score >= 6 ? '█████' : score >= 5 ? '████░' : score >= 3 ? '███░░' : score >= 1.5 ? '██░░░' : '█░░░░';
  const scoreBg = score >= 5
    ? (isBull ? 'bg-teal-600/40' : 'bg-red-600/40')
    : score >= 3 ? 'bg-orange-600/30' : 'bg-gray-700/30';

  const statusText = (cond: boolean, pass = '● PASS', fail = '○ ----') => cond ? pass : fail;

  const rows = [
    { label: `RVOL  1.47x`, status: statusText(!!signals.rvol), active: !!signals.rvol, color: 'teal' },
    { label: `zΔ  ${isBull ? '+1.65' : '-1.58'}`, status: statusText(!!signals.zscore), active: !!signals.zscore, color: 'teal' },
    { label: `CVD  ${isBull ? '↑' : '↓'}`, status: statusText(!!signals.cvd), active: !!signals.cvd, color: 'teal' },
    {
      label: 'CVD DIV ⭐',
      status: signals.divergence ? '● HIGH PROB' : '○ ----',
      active: !!signals.divergence,
      color: 'yellow',
    },
    {
      label: 'ABSORPTION',
      status: signals.absorption ? '● DETECTED' : '○ ----',
      active: !!signals.absorption,
      color: 'orange',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-xl overflow-hidden w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="grid grid-cols-2">
        <div className="bg-[#0d1117]/90 px-4 py-3 border-r border-svp-border">
          <div className="text-xs font-bold tracking-wider" style={{ color }}>SVP v2</div>
          <div className="text-[#0d9488] text-[10px] mt-0.5 font-mono">{isBull ? 'LONG ENGINE' : 'SHORT ENGINE'}</div>
        </div>
        <div className={`px-4 py-3 text-center text-xs font-bold tracking-wide transition-colors duration-500 ${hdrBg}`}
          style={activeSignal === 'confirmed' || activeSignal === 'strong' ? { backgroundColor: `${color}30` } : {}}>
          {hdrTxt}
        </div>
      </div>

      {/* Score */}
      <div className="grid grid-cols-2 border-t border-svp-border">
        <div className="bg-[#111827]/80 px-4 py-2.5 border-r border-svp-border">
          <span className="text-svp-muted text-xs">WEIGHTED SCORE</span>
        </div>
        <div className={`${scoreBg} px-4 py-2.5 text-center`}>
          <span className="text-white text-xs font-mono">{score.toFixed(1)} / 7.0 &nbsp;{scoreBar}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="grid grid-cols-2 border-t border-svp-border">
        <div className="bg-[#1a1f2e]/60 px-4 py-1.5 border-r border-svp-border">
          <span className="text-gray-500 text-[10px] uppercase tracking-widest">METRIC</span>
        </div>
        <div className="bg-[#1a1f2e]/60 px-4 py-1.5 text-center">
          <span className="text-gray-500 text-[10px] uppercase tracking-widest">STATUS</span>
        </div>
      </div>

      {/* Signal Rows */}
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 border-t border-svp-border">
          <div className="bg-[#111827]/60 px-4 py-2 border-r border-svp-border">
            <span className="text-svp-muted text-xs font-mono">{row.label}</span>
          </div>
          <div className={`px-4 py-2 text-center transition-colors duration-300 ${
            row.active
              ? row.color === 'yellow' ? 'bg-yellow-600/20'
              : row.color === 'orange' ? 'bg-orange-600/20'
              : isBull ? 'bg-teal-600/20' : 'bg-red-600/20'
              : 'bg-gray-700/20'
          }`}>
            <span className={`text-xs font-mono ${row.active ? 'text-white' : 'text-gray-500'}`}>{row.status}</span>
          </div>
        </div>
      ))}

      {/* HTF Trend */}
      <div className="grid grid-cols-2 border-t border-svp-border">
        <div className="bg-[#111827]/60 px-4 py-2 border-r border-svp-border">
          <span className="text-svp-muted text-xs font-mono">HTF TREND</span>
        </div>
        <div className={`px-4 py-2 text-center ${htfFilter ? 'bg-violet-600/20' : 'bg-gray-700/20'}`}>
          <span className={`text-xs font-mono ${htfFilter ? 'text-white' : 'text-gray-500'}`}>
            {htfFilter ? (isBull ? '● BULLISH ↑' : '● BEARISH ↓') : '○ OFF'}
          </span>
        </div>
      </div>

      {/* VWAP Bias */}
      <div className="grid grid-cols-2 border-t border-svp-border">
        <div className="bg-[#111827]/60 px-4 py-2 border-r border-svp-border">
          <span className="text-svp-muted text-xs font-mono">VWAP GATE</span>
        </div>
        <div className={`px-4 py-2 text-center ${vwapGate ? (isBull ? 'bg-teal-600/20' : 'bg-red-600/20') : 'bg-gray-700/20'}`}>
          <span className={`text-xs font-mono ${vwapGate ? 'text-white' : 'text-gray-500'}`}>
            {vwapGate ? (isBull ? 'ABOVE ✓' : 'BELOW ✓') : '✗ LOCKED'}
          </span>
        </div>
      </div>

      {/* Cooldown */}
      <div className="grid grid-cols-2 border-t border-svp-border">
        <div className="bg-[#111827]/60 px-4 py-2 border-r border-svp-border">
          <span className="text-svp-muted text-xs font-mono">COOLDOWN</span>
        </div>
        <div className="bg-[#111827]/60 px-4 py-2 text-center">
          <span className="text-xs font-mono text-svp-muted">
            {cooldown >= 4 ? '● READY' : `○ ${cooldown}/4 bars`}
          </span>
        </div>
      </div>

      {/* Gate */}
      <div className="grid grid-cols-2 border-t border-svp-border">
        <div className={`px-4 py-3 text-center text-xs font-bold transition-colors duration-500 ${
          activeSignal !== 'none' ? '' : 'bg-gray-700/20 text-gray-500'
        }`}
        style={activeSignal !== 'none' ? { backgroundColor: `${color}20`, color } : {}}>
          {activeSignal === 'strong' ? '⭐ STRONG' :
           activeSignal === 'confirmed' ? (isBull ? 'GATE: LONG ▲' : 'GATE: SHORT ▼') :
           activeSignal === 'early' ? '⚡ EARLY' :
           'GATE: CLOSED'}
        </div>
        <div className={`px-4 py-3 text-center text-xs font-mono transition-colors duration-500 ${
          activeSignal !== 'none' ? '' : 'bg-gray-700/20 text-gray-500'
        }`}
        style={activeSignal !== 'none' ? { backgroundColor: `${color}20`, color: '#fff' } : {}}>
          SL: ATR×1.5 | TP: ATR×2.5
        </div>
      </div>
    </motion.div>
  );
}
