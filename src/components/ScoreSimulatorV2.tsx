import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
  BarChart3,
  Shield,
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';

interface SignalDef {
  id: string;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
  weight: number;
  description: string;
}

const bullSignals: SignalDef[] = [
  { id: 'rvol', label: 'RVOL Active', labelAr: 'حجم مؤسسي', icon: <TrendingUp className="w-4 h-4" />, weight: 1.5, description: 'RVOL ≥ 1.3x — مؤسسات نشطة' },
  { id: 'zscore', label: 'Z-Delta Bull', labelAr: 'عدوانية شراء', icon: <Zap className="w-4 h-4" />, weight: 1.0, description: 'Z-Score ≥ 1.2σ — ضغط غير طبيعي' },
  { id: 'cvd', label: 'CVD Rising', labelAr: 'تراكم شراء', icon: <Activity className="w-4 h-4" />, weight: 1.0, description: 'CVD يتجاوز القيمة السابقة' },
  { id: 'divergence', label: 'CVD Divergence', labelAr: 'تباعد تنبؤي ⭐', icon: <BarChart3 className="w-4 h-4" />, weight: 2.0, description: 'سعر ثابت + CVD يرتفع — الأقوى' },
  { id: 'absorption', label: 'Absorption', labelAr: 'استيعاب مؤسسي', icon: <Shield className="w-4 h-4" />, weight: 1.5, description: 'حجم ضخم + جسم صغير/ذيل قوي' },
];

const bearSignals: SignalDef[] = [
  { id: 'rvol', label: 'RVOL Active', labelAr: 'حجم مؤسسي', icon: <TrendingDown className="w-4 h-4" />, weight: 1.5, description: 'RVOL ≥ 1.3x — مؤسسات نشطة' },
  { id: 'zscore', label: 'Z-Delta Bear', labelAr: 'عدوانية بيع', icon: <Zap className="w-4 h-4" />, weight: 1.0, description: 'Z-Score ≤ -1.2σ — ضغط بيع غير طبيعي' },
  { id: 'cvd', label: 'CVD Falling', labelAr: 'تراكم بيع', icon: <Activity className="w-4 h-4" />, weight: 1.0, description: 'CVD تحت القيمة السابقة' },
  { id: 'divergence', label: 'CVD Divergence', labelAr: 'تباعد تنبؤي ⭐', icon: <BarChart3 className="w-4 h-4" />, weight: 2.0, description: 'سعر ثابت + CVD ينخفض — الأقوى' },
  { id: 'absorption', label: 'Absorption', labelAr: 'استيعاب بيعي', icon: <Shield className="w-4 h-4" />, weight: 1.5, description: 'حجم ضخم + ذيل علوي قوي' },
];

interface Props {
  direction: 'long' | 'short';
  signals: Record<string, boolean>;
  onToggle: (id: string) => void;
  score: number;
  htfFilter: boolean;
  vwapGate: boolean;
  onToggleHtf: () => void;
  onToggleVwap: () => void;
  cooldown: number;
}

export default function ScoreSimulatorV2({
  direction,
  signals,
  onToggle,
  score,
  htfFilter,
  vwapGate,
  onToggleHtf,
  onToggleVwap,
  cooldown,
}: Props) {
  const sigList = direction === 'long' ? bullSignals : bearSignals;
  const maxScore = 7.0;
  const scorePct = Math.min((score / maxScore) * 100, 100);

  const earlyLevel = score >= 3.0 && vwapGate && htfFilter;
  const confirmedLevel = score >= 5.0 && vwapGate && htfFilter;
  const strongLevel = score >= 6.0 && vwapGate && htfFilter;

  const isActive = earlyLevel || confirmedLevel || strongLevel;
  const isBull = direction === 'long';
  const color = isBull ? '#14b8a6' : '#ef4444';
  const colorName = isBull ? 'teal' : 'red';

  return (
    <div className={`glass-card rounded-xl p-5 ${isBull ? 'glow-teal' : 'glow-red'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          {isBull ? (
            <ArrowUpCircle className="w-5 h-5" style={{ color }} />
          ) : (
            <ArrowDownCircle className="w-5 h-5" style={{ color }} />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {isBull ? 'LONG Score Engine' : 'SHORT Score Engine'}
          </h3>
          <p className="text-svp-muted text-xs">نظام أوزان مُراوَزة — الحد الأقصى: {maxScore.toFixed(1)}</p>
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-5 p-4 rounded-lg bg-svp-bg/60 border border-svp-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-svp-muted text-xs">النقاط المُراوَزة</span>
          <span className="text-2xl font-mono font-bold">
            <span style={{ color: isActive ? color : '#94a3b8' }}>{score.toFixed(1)}</span>
            <span className="text-svp-dim"> / {maxScore.toFixed(1)}</span>
          </span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${color}, ${isBull ? '#06b6d4' : '#f97316'})`,
              opacity: isActive ? 1 : 0.5,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${scorePct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-svp-dim font-mono">
          <span>0</span>
          <span className="text-orange-400/60">EARLY ≥3</span>
          <span className={confirmedLevel ? '' : 'text-svp-dim'} style={{ color: confirmedLevel ? color : undefined }}>CONFIRMED ≥5</span>
          <span style={{ color: strongLevel ? '#eab308' : '#64748b8a' }}>STRONG ≥6</span>
          <span>{maxScore}</span>
        </div>
      </div>

      {/* Signal Toggles */}
      <div className="space-y-2 mb-4">
        {sigList.map((sig, i) => {
          const active = signals[sig.id] ?? false;
          return (
            <motion.button
              key={sig.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onToggle(sig.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                active
                  ? `border-${colorName}-500/40 bg-${colorName}-500/10`
                  : 'border-svp-border bg-svp-bg/30 hover:border-gray-600'
              }`}
              style={active ? { borderColor: `${color}40`, backgroundColor: `${color}10` } : {}}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: active ? `${color}20` : '#1f2937', color: active ? color : '#4b5563' }}
              >
                {sig.icon}
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className={`text-sm font-bold ${active ? 'text-white' : 'text-gray-500'}`}>
                    {sig.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                    style={{ backgroundColor: `${color}15`, color: active ? color : '#64748b' }}>
                    ×{sig.weight}
                  </span>
                </div>
                <p className="text-[10px] text-svp-dim mt-0.5">{sig.description}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                style={{ borderColor: active ? color : '#4b5563', backgroundColor: active ? color : 'transparent' }}
              >
                {active && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-svp-bg" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Gate Filters */}
      <div className="space-y-2 mb-4">
        <div
          onClick={onToggleHtf}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
            htfFilter ? 'border-violet-500/40 bg-violet-500/10' : 'border-svp-border bg-svp-bg/30'
          }`}
        >
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${htfFilter ? 'bg-violet-500/20 text-violet-400' : 'bg-gray-800 text-gray-600'}`}>
            <Target className="w-4 h-4" />
          </div>
          <div className="flex-1 text-right">
            <span className={`text-sm font-bold ${htfFilter ? 'text-white' : 'text-gray-500'}`}>
              HTF Trend Filter — EMA 50/200
            </span>
            <p className="text-[10px] text-svp-dim">
              {htfFilter
                ? (isBull ? 'EMA50 > EMA200 ✓ — اتجاه صاعد' : 'EMA50 < EMA200 ✓ — اتجاه هابط')
                : 'معطّل — لا فلتر اتجاه'}
            </p>
          </div>
          <span className={`text-[10px] font-mono px-2 py-1 rounded ${htfFilter ? 'bg-violet-500/20 text-violet-300' : 'bg-gray-800 text-gray-500'}`}>
            {htfFilter ? 'ON' : 'OFF'}
          </span>
        </div>

        <div
          onClick={onToggleVwap}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
            vwapGate ? (isBull ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-orange-500/40 bg-orange-500/10') : 'border-svp-border bg-svp-bg/30'
          }`}
        >
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${vwapGate ? (isBull ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400') : 'bg-gray-800 text-gray-600'}`}>
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex-1 text-right">
            <span className={`text-sm font-bold ${vwapGate ? 'text-white' : 'text-gray-500'}`}>
              VWAP Gate — البوابة المؤسسية
            </span>
            <p className="text-[10px] text-svp-dim">
              {vwapGate
                ? (isBull ? 'السعر فوق VWAP ✓' : 'السعر تحت VWAP ✓')
                : 'معطّل'}
            </p>
          </div>
          <span className={`text-[10px] font-mono px-2 py-1 rounded ${
            vwapGate ? (isBull ? 'bg-teal-500/20 text-teal-300' : 'bg-red-500/20 text-red-300') : 'bg-gray-800 text-gray-500'
          }`}>
            {vwapGate ? 'OPEN' : 'LOCKED'}
          </span>
        </div>
      </div>

      {/* Cooldown */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-svp-bg/40 border border-svp-border mb-4">
        <span className="text-svp-dim text-xs">Cooldown:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-3 h-3 rounded-sm ${bar <= cooldown ? '' : 'bg-gray-700'}`}
              style={{ backgroundColor: bar <= cooldown ? `${color}40` : undefined, border: bar <= cooldown ? `1px solid ${color}60` : undefined }}
            />
          ))}
        </div>
        <span className="text-svp-dim text-[10px] font-mono ml-auto">{cooldown}/4 شمعات</span>
      </div>

      {/* Signal Level */}
      <div className={`p-4 rounded-lg border-2 text-center transition-all duration-500 ${
        strongLevel ? 'border-yellow-500/50 bg-yellow-500/10' :
        confirmedLevel ? `border-${colorName}-400/50 bg-${colorName}-500/10` :
        earlyLevel ? 'border-orange-400/40 bg-orange-500/10' :
        'border-gray-700/40 bg-gray-800/10'
      }`} style={
        confirmedLevel ? { borderColor: `${color}50`, backgroundColor: `${color}10` } :
        strongLevel ? { borderColor: '#eab30850', backgroundColor: '#eab30810' } : {}
      }>
        {strongLevel ? (
          <>
            <div className="text-yellow-400 text-lg font-bold">⭐ STRONG SIGNAL</div>
            <div className="text-xs text-yellow-200/70 mt-1">نقاط ≥ 6.0 — إشارة عالية الثقة جداً</div>
          </>
        ) : confirmedLevel ? (
          <>
            <div className="text-lg font-bold" style={{ color }}>▲ CONFIRMED SIGNAL</div>
            <div className="text-xs mt-1" style={{ color: `${color}aa` }}>نقاط ≥ 5.0 — دخول مؤكد + SL/TP تلقائي</div>
          </>
        ) : earlyLevel ? (
          <>
            <div className="text-orange-400 text-lg font-bold">⚡ EARLY WARNING</div>
            <div className="text-xs text-orange-300/70 mt-1">نقاط ≥ 3.0 — تحذير أولي، استعد!</div>
          </>
        ) : (
          <>
            <div className="text-gray-600 text-lg font-bold">◌ NO SIGNAL</div>
            <div className="text-xs text-svp-dim mt-1">
              تحتاج {(3.0 - score > 0 ? (3.0 - score).toFixed(1) : '0')} نقاط إضافية + فلاتر
            </div>
          </>
        )}
      </div>
    </div>
  );
}
