import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Target,
  Shield,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface Module {
  id: string;
  number: number;
  title: string;
  titleAr: string;
  icon: React.ReactNode;
  method: string;
  strength: string[];
  weakness: string[];
  rating: number; // 1-5
  color: string;
  colorClass: string;
  code: string;
}

const modules: Module[] = [
  {
    id: 'cvd',
    number: 1,
    title: 'Volume Delta (CVD)',
    titleAr: 'تقدير ضغط الشراء/البيع',
    icon: <BarChart3 className="w-5 h-5" />,
    method: 'CLV = (close-low) - (high-close) / range × volume → EMA smoothing',
    strength: [
      'تقدير ذكي بدون بيانات tick حقيقية',
      'EMA smoothing يقلل الضوضاء',
      'تراكمي عبر الزمن يعطي صورة واضحة',
    ],
    weakness: [
      'ليس Order Flow حقيقي (لا يفرق بين bid/ask)',
      'على فريمات صغيرة قد يكون متأخراً',
    ],
    rating: 4,
    color: '#14b8a6',
    colorClass: 'teal',
    code: 'clv = (close-low)-(high-close) / range\ndelta = clv × volume\ncvd = ema(cum(delta), 14)',
  },
  {
    id: 'rvol',
    number: 2,
    title: 'RVOL (Relative Volume)',
    titleAr: 'الحجم النسبي لكشف المؤسسات',
    icon: <TrendingUp className="w-5 h-5" />,
    method: 'RVOL = current volume / SMA(volume, 20) — threshold: 1.3x',
    strength: [
      'بسيط وفعال في كشف النشاط غير الطبيعي',
      '1.3x عتبة ممتازة تقلل الإشارات الكاذبة',
      'يعمل على جميع الفريمات والأصول',
    ],
    weakness: [
      'لا يفرق بين حجم الشراء والبيع',
      'أخبار اقتصادية قد ترفع الحجم بدون تراكم',
    ],
    rating: 4.5,
    color: '#06b6d4',
    colorClass: 'cyan',
    code: 'vol_avg = sma(volume, 20)\nrvol = volume / vol_avg\nactive = rvol >= 1.3',
  },
  {
    id: 'zscore',
    number: 3,
    title: 'Delta Z-Score',
    titleAr: 'كشف العدوانية غير الطبيعية',
    icon: <Zap className="w-5 h-5" />,
    method: 'Z = (delta - SMA(delta)) / STDEV(delta) — threshold: 1.2σ',
    strength: [
      'يقيس الانحراف الإحصائي بدقة عالية',
      'يتكيف تلقائياً مع تغير ظروف السوق',
      'يكتشف ضغط الشراء قبل أن يظهر على السعر',
    ],
    weakness: [
      'يحتاج فترة بيانات كافية (20+ شمعة)',
      'قد يعطي إشارات على تذبذبات عالية',
    ],
    rating: 4.5,
    color: '#eab308',
    colorClass: 'yellow',
    code: 'z = (delta - mean) / stdev\nbullish = z >= 1.2',
  },
  {
    id: 'vwap',
    number: 4,
    title: 'VWAP Bias',
    titleAr: 'الاتجاه المؤسسي',
    icon: <Target className="w-5 h-5" />,
    method: 'close > VWAP → bullish bias, VWAP slope > 3 bars → trend confirmation',
    strength: [
      'مرجع مؤسسي حقيقي (صناديق التحوط تستخدمه)',
      'يعمل كدعم/مقاومة ديناميكي',
      'الشرط المركب (فوق + ميل) يقلل الإشارات الكاذبة',
    ],
    weakness: [
      'VWAP اليومي يُعاد حسابه كل يوم — قد يكون مضللاً بعد الظهر',
      'لا يأخذ في الاعتبار VWAP لأطر زمنية أعلى',
    ],
    rating: 4,
    color: '#8b5cf6',
    colorClass: 'violet',
    code: 'vwap = ta.vwap(hlc3)\nabove = close > vwap\nslope = vwap > vwap[3]',
  },
  {
    id: 'absorption',
    number: 5,
    title: 'Absorption Detection',
    titleAr: 'الاستيعاب المؤسسي',
    icon: <Shield className="w-5 h-5" />,
    method: 'volume > 1.8× avg + body < 35% range + close > open',
    strength: [
      'نمط كلاسيكي معروف في Order Flow',
      'ثلاثة شروط مركبة تقلل الإشارات الكاذبة',
      'إشارة تحذيرية مبكرة قبل الانفجار',
    ],
    weakness: [
      'شرط close > open قد يفوت استيعاب بذيل سفلي',
      '35% كحد للجسم قد يكون ضيقاً جداً في بعض الأسواق',
    ],
    rating: 3.5,
    color: '#f97316',
    colorClass: 'orange',
    code: 'high_vol = vol > avg × 1.8\nsmall = body < 35% range\nabsorb = high_vol & small & green',
  },
];

function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className="w-3 h-3 rounded-sm"
          style={{
            backgroundColor: star <= Math.floor(rating) ? color : star - 0.5 <= rating ? `${color}66` : '#374151',
          }}
        />
      ))}
      <span className="text-xs font-mono ml-2" style={{ color }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ModuleAnalysis() {
  return (
    <div className="space-y-4">
      {modules.map((mod, i) => (
        <motion.div
          key={mod.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-svp-border">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mod.color}20`, color: mod.color }}
            >
              {mod.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${mod.color}20`, color: mod.color }}>
                  M{mod.number}
                </span>
                <span className="text-white font-bold text-sm">{mod.title}</span>
                <span className="text-svp-dim text-xs">— {mod.titleAr}</span>
              </div>
              <p className="text-svp-dim text-[10px] mt-0.5 font-mono">{mod.method}</p>
            </div>
            <StarRating rating={mod.rating} color={mod.color} />
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x md:divide-x-svp-border">
            {/* Strengths */}
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-teal-400 text-xs font-bold">نقاط القوة</span>
              </div>
              <ul className="space-y-1.5">
                {mod.strength.map((s, j) => (
                  <li key={j} className="text-xs text-svp-muted flex items-start gap-1.5">
                    <span className="text-teal-500 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-400 text-xs font-bold">تحسينات مقترحة</span>
              </div>
              <ul className="space-y-1.5">
                {mod.weakness.map((w, j) => (
                  <li key={j} className="text-xs text-svp-muted flex items-start gap-1.5">
                    <span className="text-orange-500 mt-0.5">!</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Code */}
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <GitBranch className="w-3.5 h-3.5 text-svp-dim" />
                <span className="text-svp-dim text-xs font-bold">المنطق البرمجي</span>
              </div>
              <pre className="text-[10px] font-mono text-svp-dim bg-svp-bg/60 rounded p-2.5 overflow-x-auto">
                {mod.code}
              </pre>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
