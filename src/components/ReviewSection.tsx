import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowUpCircle,
  Target,
  Gauge,
  Shield,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface ReviewItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  severity: 'positive' | 'warning' | 'tip';
}

const strengths: ReviewItem[] = [
  {
    icon: <Target className="w-4 h-4" />,
    title: 'نظام نقاط متعدد الأبعاد',
    description: 'دمج 5 إشارات مختلفة في Score Engine يقلل الإشارات الكاذبة بشكل كبير مقارنة بأي إشارة منفردة.',
    severity: 'positive',
  },
  {
    icon: <Gauge className="w-4 h-4" />,
    title: 'CVD Divergence كإشارة تنبؤية',
    description: 'كشف تباعد السعر مع CVD هو من أقوى إشارات التراكم المؤسسي — إضافة ممتازة تعطي أفضلية واضحة.',
    severity: 'positive',
  },
  {
    icon: <Shield className="w-4 h-4" />,
    title: 'بوابة VWAP كفلتر نهائي',
    description: 'عدم إصدار إشارة除非 السعر فوق VWAP يمنع الدخول في اتجاه معاكس للتيار المؤسسي.',
    severity: 'positive',
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: 'HUD احترافي متكامل',
    description: 'لوحة بيانات شاملة تعرض كل المعلومات المطلوبة بلمحة واحدة — تصميم تداولي حقيقي.',
    severity: 'positive',
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    title: 'تحذير مبكر بالاستيعاب',
    description: 'إشارة الاستيعاب المنفصلة تعطي إنذاراً مبكراً قبل اكتمال شروط التنبؤ — قيمة تداولية عالية.',
    severity: 'positive',
  },
];

const improvements: ReviewItem[] = [
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    title: 'إشارات قد تتغير أثناء الشمعة (Repaint)',
    description: 'أضف barstate.isconfirmed كشرط إضافي: predict := predict and barstate.isconfirmed لضمان ثبات الإشارة عند الإغلاق فقط.',
    severity: 'warning',
  },
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    title: '{{plot("RVOL")}} في التنبيهات لن يعمل',
    description: 'أنت لا ترسم RVOL كـ plot مسمى. الحل: أضف plot(rvol, title="RVOL", display=display.none) أو احذفه من رسالة التنبيه.',
    severity: 'warning',
  },
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    title: 'شرط Absorption ضيق',
    description: 'close > open يفوت استيعاب بذيل سفلي قوي. اقتراح: أضف شرطاً بديلاً (lower_wick > body) أو ألغِ شرط الإغلاق الإيجابي.',
    severity: 'warning',
  },
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    title: 'أوزان متساوية غير مثلى',
    description: 'CVD Divergence أقوى من مجرد CVD Rising. اقتراح: وزنها 1.5 أو استخدم نظام أوزان: divergence=2, rvol=1.5, الباقي=1.',
    severity: 'warning',
  },
];

const recommendations: ReviewItem[] = [
  {
    icon: <Lightbulb className="w-4 h-4" />,
    title: 'أضف فلتر اتجاه أعلى (HTF Trend)',
    description: 'EMA 50/200 أو VWAP على فريم أعلى. يمنع الإشارات في اتجاه عرضي/معاكس ويحسن نسبة الربح بشكل ملحوظ.',
    severity: 'tip',
  },
  {
    icon: <Lightbulb className="w-4 h-4" />,
    title: 'Cooldown بسيط (منع التكرار)',
    description: 'بعد إشارة، انتظر 3-5 شمعات قبل السماح بإشارة جديدة. يمنع الدخول المتكرر في نفس المنطقة.',
    severity: 'tip',
  },
  {
    icon: <Lightbulb className="w-4 h-4" />,
    title: 'مستويات إشارة (Early / Confirmed)',
    description: 'Early (score=3) = تحذير أولي. Confirmed (score≥4) = دخول. يعطي مرونة أكبر للمتداول.',
    severity: 'tip',
  },
  {
    icon: <Lightbulb className="w-4 h-4" />,
    title: 'حوّله لـ Strategy() للباكتست',
    description: 'أضف دخول عند predict مع SL/TL محددين وشوف الأرقام فعلياً. الانطباع البصري يخدع أحياناً.',
    severity: 'tip',
  },
  {
    icon: <ArrowUpCircle className="w-4 h-4" />,
    title: 'أضف نسخة سفلية (Short Prediction)',
    description: 'المؤشر حالياً صعودي فقط. نفس المنطق معكوساً (CVD falling, under VWAP, etc.) يعطي صورة كاملة.',
    severity: 'tip',
  },
];

function ReviewCard({ item, index }: { item: ReviewItem; index: number }) {
  const colors = {
    positive: {
      border: 'border-teal-500/30',
      bg: 'bg-teal-500/5',
      iconBg: 'bg-teal-500/15',
      iconColor: 'text-teal-400',
    },
    warning: {
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/5',
      iconBg: 'bg-orange-500/15',
      iconColor: 'text-orange-400',
    },
    tip: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/5',
      iconBg: 'bg-cyan-500/15',
      iconColor: 'text-cyan-400',
    },
  };
  const c = colors[item.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex items-start gap-3 p-4 rounded-lg border ${c.border} ${c.bg}`}
    >
      <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${c.iconBg} ${c.iconColor}`}>
        {item.icon}
      </div>
      <div>
        <div className="text-sm font-bold text-white mb-0.5">{item.title}</div>
        <p className="text-xs text-svp-muted leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function ReviewSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Strengths */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400" />
          <h3 className="text-teal-400 font-bold">نقاط القوة</h3>
          <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-mono">
            {strengths.length}
          </span>
        </div>
        <div className="space-y-3">
          {strengths.map((item, i) => (
            <ReviewCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Improvements Needed */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <h3 className="text-orange-400 font-bold">تحسينات مطلوبة</h3>
          <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-mono">
            {improvements.length}
          </span>
        </div>
        <div className="space-y-3">
          {improvements.map((item, i) => (
            <ReviewCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          <h3 className="text-cyan-400 font-bold">توصيات للنسخة القادمة</h3>
          <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
            {recommendations.length}
          </span>
        </div>
        <div className="space-y-3">
          {recommendations.map((item, i) => (
            <ReviewCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
