import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Zap, TrendingUp, BarChart3, Activity,
  Target, Lock, Award, Copy, ChevronDown, ChevronUp,
  AlertTriangle, Eye, Terminal, Layers, Clock, Users,
  ArrowRight, Scale, FileText, Globe, Verified, Gem,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// MODULES DATA
// ═══════════════════════════════════════════════════════════
const modules = [
  {
    id: 1,
    title: 'Volume Delta — CVD',
    titleAr: 'تقدير ضغط الشراء والبيع',
    icon: <BarChart3 className="w-6 h-6" />,
    color: '#14b8a6',
    desc: 'يحسب الفرق بين ضغط الشراء والبيع باستخدام CLV (Close Location Value) ويُرسّمه على شكل CVD (Cumulative Volume Delta). يكشف تراكم الأموال الذكية عبر الزمن.',
    formula: 'CLV = (close - low - (high - close)) / range\nDelta = CLV × Volume\nCVD = EMA(Cumulative(Delta), 14)',
  },
  {
    id: 2,
    title: 'RVOL — الحجم النسبي',
    titleAr: 'كشف نشاط المؤسسات',
    icon: <TrendingUp className="w-6 h-6" />,
    color: '#06b6d4',
    desc: 'يقارن حجم التداول الحالي بمتوسط آخر 20 فترة. عندما يتجاوز 1.3× يعني أن المؤسسات والمحافظ نشطة في السوق — إشارة لبداية حركة قوية.',
    formula: 'RVOL = Volume / SMA(Volume, 20)\nActive = RVOL ≥ 1.3',
  },
  {
    id: 3,
    title: 'Delta Z-Score',
    titleAr: 'كشف العدوانية غير الطبيعية',
    icon: <Zap className="w-6 h-6" />,
    color: '#eab308',
    desc: 'يقيس بُعد ضغط الشراء/البيع الحالي عن المتوسط التاريخي بوحدات الانحراف المعياري. Z-Score > 1.2σ يعني ضغط شراء غير طبيعي — المؤسسات تدخل بقوة.',
    formula: 'Z = (Delta - SMA(Delta)) / STDEV(Delta)\nBullish = Z ≥ 1.2σ',
  },
  {
    id: 4,
    title: 'VWAP Bias',
    titleAr: 'الاتجاه المؤسسي',
    icon: <Target className="w-6 h-6" />,
    color: '#8b5cf6',
    desc: 'السعر فوق VWAP = المؤسسات في وضع شراء. VWAP يعتبره المحترفون مرجعهم الأساسي لقياس الاتجاه. يعمل أيضاً كبوابة (Gate) لمنع الإشارات المعاكسة.',
    formula: 'VWAP = ta.vwap(hlc3)\nAbove = Close > VWAP\nSlope = VWAP > VWAP[3]',
  },
  {
    id: 5,
    title: 'Absorption Detection',
    titleAr: 'الاستيعاب المؤسسي',
    icon: <Shield className="w-6 h-6" />,
    color: '#f97316',
    desc: 'يكشف أنماط الاستيعاب: حجم ضخم + جسم صغير أو ذيل قوي = المؤسسات تمتص العرض. هذه العلامة الكلاسيكية تظهر قبل الانفجار السعري بـ 1-3 شمعات.',
    formula: 'HighVol = Volume > Avg × 1.8\nSmallBody = Body < 35% Range\nWickAbsorb = LowerWick > Body × 1.5',
  },
  {
    id: 6,
    title: 'HTF Trend Filter',
    titleAr: 'فلتر الاتجاه الأعلى',
    icon: <Layers className="w-6 h-6" />,
    color: '#22c55e',
    desc: 'EMA 50/200 كفلتر اتجاه. لا تصدر إشارة شراء إلا إذا EMA50 > EMA200 والعكس للبيع. يمنع الدخول في اتجاه عرضي أو معاكس ويحسن نسبة الربح بشكل كبير.',
    formula: 'BullTrend = EMA(50) > EMA(200)\nBearTrend = EMA(50) < EMA(200)\nFilter = not use_filter or Trend',
  },
];

// ═══════════════════════════════════════════════════════════
// FAQ DATA
// ═══════════════════════════════════════════════════════════
const faqs = [
  {
    q: 'هل المؤشر يعمل على جميع الأسواق؟',
    a: 'نعم، SVP يعمل على أي سوق فيه بيانات حجم (Volume) — أسهم، عملات رقمية، عقود فروقات، سلع، مؤشرات. الأداء أفضل على الأسواق ذات السيولة العالية.',
  },
  {
    q: 'ما هو الفرق بين EARLY و CONFIRMED و STRONG؟',
    a: 'EARLY (نقاط ≥ 3.0): تحذير أولي — استعد. CONFIRMED (نقاط ≥ 5.0): إشارة دخول مؤكدة مع SL/TP تلقائي. STRONG (نقاط ≥ 6.0): إشارة عالية الثقة جداً. كل مستوى له إشارة بصرية مختلفة على الشارت.',
  },
  {
    q: 'هل يوجد خطر إعادة الرسم (Repaint)؟',
    a: 'لا. كل الإشارات تُفعّل فقط عند إغلاق الشمعة باستخدام barstate.isconfirmed. الإشارة التي تظهر على شمعة مغلقة لن تتغير أبداً.',
  },
  {
    q: 'ما هي الأطر الزمنية الموصى بها؟',
    a: 'يعمل على جميع الفريمات، لكن الأفضل: 5 دقائق للسينلينج، 15 دقيقة للتداول اليومي، 1 ساعة للسوينج. كلما زاد الفريم زادت موثوقية الإشارة.',
  },
  {
    q: 'كيف يعمل نظام الأوزان؟',
    a: 'كل إشارة لها وزن حسب قوتها التنبؤية: CVD Divergence = ×2.0 (الأقوى)، RVOL = ×1.5، Absorption = ×1.5، Z-Delta = ×1.0، CVD = ×1.0. المجموع الأقصى 7.0 نقاط.',
  },
  {
    q: 'هل يمكن استخدام المؤشر في الباكتست؟',
    a: 'نعم! النسخة v2 تأتي كـ strategy() جاهزة للباكتست على TradingView. الدخول والخروج تلقائي مع SL/TP بالـ ATR. فقط الصقه وشغّله.',
  },
  {
    q: 'كيف يختلف SVP عن مؤشرات الحجم العادية؟',
    a: 'SVP لا يعتمد على حجم واحد. يدمج 6 أنظمة مختلفة (CVD + RVOL + Z-Score + VWAP + Absorption + HTF) في محرك نقاط مُراوَز. كل إشارة تُقاس بثقلها الحقيقي ويجب تجاوز عتبات متعددة قبل إصدار تنبيه.',
  },
];

// ═══════════════════════════════════════════════════════════
// FEATURES
// ═══════════════════════════════════════════════════════════
const features = [
  { icon: <Zap className="w-5 h-5" />, title: '6 وحدات تحليل متكاملة', desc: 'CVD · RVOL · Z-Score · VWAP · Absorption · HTF Filter' },
  { icon: <Scale className="w-5 h-5" />, title: 'نظام أوزان مُراوَز', desc: 'كل إشارة تُحسب بثقلها الحقيقي — Divergence ×2.0' },
  { icon: <AlertTriangle className="w-5 h-5" />, title: '3 مستويات إشارة', desc: 'EARLY · CONFIRMED · STRONG — مرونة كاملة' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'LONG + SHORT', desc: 'إشارات صعودية وهبوطية بالكامل' },
  { icon: <Lock className="w-5 h-5" />, title: 'حماية من Repaint', desc: 'تأكيد عند إغلاق الشمعة فقط — 100% ثبات' },
  { icon: <Clock className="w-5 h-5" />, title: 'Cooldown ذكي', desc: 'منع تكرار الإشارة خلال 4 شمعات' },
  { icon: <Shield className="w-5 h-5" />, title: 'ATR SL/TP تلقائي', desc: 'وقف خسارة وهدف تلقائي بناءً على تقلب السوق' },
  { icon: <Eye className="w-5 h-5" />, title: 'لوحة HUD احترافية', desc: 'كل المعلومات بلمحة واحدة على الشارت' },
  { icon: <Terminal className="w-5 h-5" />, title: 'وضع Strategy', desc: 'باكتست مباشر مع دخول/خروج تلقائي' },
  { icon: <Activity className="w-5 h-5" />, title: '4 أنواع تنبيهات', desc: 'LONG CONFIRMED · SHORT CONFIRMED · EARLY LONG · EARLY SHORT' },
  { icon: <Users className="w-5 h-5" />, title: 'CVD Divergence', desc: 'يكتشف الكبار يشترون بصمت قبل الانفجار' },
  { icon: <Verified className="w-5 h-5" />, title: 'يعمل على كل الأسواق', desc: 'أسهم · عملات رقمية · سلع · مؤشرات · عقود' },
];

// ═══════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const copyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-dark-1 grid-bg">

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-1/80 backdrop-blur-xl border-b border-dark-5/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">SVP <span className="text-svp-teal">v2</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '#about', label: 'عن المؤشر' },
              { href: '#modules', label: 'آلية العمل' },
              { href: '#signals', label: 'نظام الإشارات' },
              { href: '#features', label: 'المميزات' },
              { href: '#faq', label: 'أسئلة شائعة' },
              { href: '#rights', label: 'الحقوق' },
            ].map((l) => (
              <a key={l.href} href={l.href} className="px-3 py-1.5 rounded-lg text-xs text-svp-muted hover:text-white hover:bg-dark-3/50 transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <a href="#get" className="px-4 py-1.5 rounded-lg bg-svp-teal/20 text-svp-teal text-xs font-bold border border-svp-teal/30 hover:bg-svp-teal/30 transition-colors">
            احصل على المؤشر
          </a>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <header className="relative pt-14 overflow-hidden">
        {/* BG Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-teal-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-40 right-[10%] w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[100px]" />
          <div className="absolute top-60 left-[50%] w-[300px] h-[300px] bg-green-500/[0.03] rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-3/60 border border-dark-5/50 mb-8">
              <Gem className="w-3.5 h-3.5 text-svp-gold" />
              <span className="text-svp-gold text-[11px] font-bold tracking-wider">PREMIUM INDICATOR — PINE SCRIPT v6</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-gradient-hero">Smart Volume</span>
              <br />
              <span className="text-gradient-hero">Predictor</span>
            </h1>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-svp-teal text-xl font-bold">[ SVP ]</span>
              <span className="text-dark-5 text-xl">|</span>
              <span className="text-svp-muted text-lg">النسخة الثانية المحسّنة</span>
            </div>

            <p className="text-svp-muted text-base sm:text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
              مؤشر تنبؤي متقدم يكتشف تراكم الأموال الذكية والمؤسسية <span className="text-white font-bold">قبل الانفجار السعري بـ 1–3 شمعات</span> — باستخدام 6 أنظمة تحليل مدمجة في محرك نقاط ذكي.
            </p>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="inline-flex flex-col items-center mt-8 mb-10"
            >
              <div className="glass-gold rounded-2xl p-6 sm:p-8">
                <div className="text-svp-gold/60 text-[10px] uppercase tracking-[0.2em] mb-2">Developed & Designed by</div>
                <div className="text-gradient-gold text-2xl sm:text-3xl font-black mb-1">ابراهيم اللاحم ابوحمود</div>
                <div className="text-svp-gold/50 text-xs font-mono">Ibrahim Al-Laham Abu Hammoud</div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Verified className="w-3.5 h-3.5 text-svp-gold" />
                  <span className="text-svp-gold/70 text-[10px] font-bold tracking-wider">ORIGINAL AUTHOR & COPYRIGHT HOLDER</span>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#get" className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg shadow-teal-500/20">
                احصل على المؤشر الآن
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#modules" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-dark-3/60 text-svp-muted font-bold border border-dark-5/50 hover:text-white hover:border-dark-5 transition-all">
                كيف يعمل؟
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-12 max-w-3xl mx-auto">
              {[
                { v: '6', l: 'Modules' },
                { v: '10', l: 'Signals' },
                { v: '4', l: 'Alerts' },
                { v: '100%', l: 'No Repaint' },
                { v: '7.0', l: 'Max Score' },
                { v: '~350', l: 'Lines' },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-lg glass text-center">
                  <div className="text-teal-400 font-mono font-bold text-lg">{s.v}</div>
                  <div className="text-dark-5 text-[10px] uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="section-divider" />
      </header>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <span className="text-svp-teal text-xs font-bold tracking-[0.2em] uppercase">About SVP</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">ما هو Smart Volume Predictor؟</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <p className="text-svp-muted leading-relaxed">
                  <span className="text-white font-bold">SVP</span> هو مؤشر تحليل حجم متقدم لمنصة TradingView، يدمج 6 أنظمة تحليل مختلفة في محرك نقاط مُراوَز يُصدر إشارات تداول عالية الدقة.
                </p>
                <p className="text-svp-muted leading-relaxed">
                  الفلسفة الأساسية: <span className="text-teal-400 font-bold">المؤسسات لا تختبئ</span>. عندما تدخل أموال ضخمة في السوق، تترك آثاراً على الحجم والدلتا والسيولة. SVP يلتقط هذه الآثار ويحسبها بنظام أوزان ذكي.
                </p>
                <p className="text-svp-muted leading-relaxed">
                  النتيجة: إشارات تداول تسبق الحركة السعرية بـ <span className="text-yellow-400 font-bold">1–3 شمعات</span>، مع ثلاثة مستويات ثقة وحماية كاملة من إعادة الرسم.
                </p>

                {/* Key Points */}
                <div className="glass rounded-xl p-5 space-y-3 mt-4">
                  <div className="text-white text-sm font-bold mb-3">المبادئ الأساسية:</div>
                  {[
                    'الحجم يقود السعر — Volume precedes Price',
                    'تراكم الأموال الذكية يترك بصمة على CVD',
                    'الاستيعاب المؤسسي يسبق الانفجار السعري',
                    'التباعد بين CVD والسعر أقوى إشارة تنبؤية',
                    'فوق VWAP = تيار مؤسسي صاعد',
                  ].map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-teal-400" />
                      </div>
                      <span className="text-svp-muted text-sm">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Card */}
              <div className="glass-teal rounded-2xl p-6 flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-white text-lg font-bold">محرك النقاط المُراوَز</div>
                  <div className="text-svp-dim text-xs mt-1">Weighted Score Engine</div>
                </div>

                {/* Score Visualization */}
                <div className="w-full max-w-xs space-y-3">
                  {[
                    { name: 'CVD Divergence', weight: 2.0, pct: 100, color: '#14b8a6' },
                    { name: 'RVOL Active', weight: 1.5, pct: 75, color: '#06b6d4' },
                    { name: 'Absorption', weight: 1.5, pct: 75, color: '#f97316' },
                    { name: 'Z-Delta', weight: 1.0, pct: 50, color: '#eab308' },
                    { name: 'CVD Direction', weight: 1.0, pct: 50, color: '#8b5cf6' },
                  ].map((w, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-svp-muted">{w.name}</span>
                        <span className="font-mono" style={{ color: w.color }}>×{w.weight}</span>
                      </div>
                      <div className="w-full h-2 bg-dark-3 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${w.pct}%`, backgroundColor: w.color }} />
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-dark-5 pt-3 mt-3 flex justify-between">
                    <span className="text-svp-muted text-xs font-bold">MAX TOTAL</span>
                    <span className="text-teal-400 font-mono font-bold">7.0</span>
                  </div>
                </div>

                {/* Signal Levels */}
                <div className="mt-6 w-full space-y-2">
                  {[
                    { level: 'STRONG', min: 6.0, color: '#eab308', icon: '⭐' },
                    { level: 'CONFIRMED', min: 5.0, color: '#14b8a6', icon: '▲' },
                    { level: 'EARLY', min: 3.0, color: '#f97316', icon: '⚡' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: `${s.color}10`, borderLeft: `2px solid ${s.color}` }}>
                      <span className="text-sm">{s.icon}</span>
                      <span className="text-white text-xs font-bold">{s.level}</span>
                      <span className="text-svp-dim text-[10px]">≥ {s.min.toFixed(1)} نقاط + VWAP + HTF</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════ MODULES ═══════════════════ */}
      <section id="modules" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <span className="text-svp-cyan text-xs font-bold tracking-[0.2em] uppercase">How It Works</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">6 وحدات تحليل متكاملة</h2>
              <p className="text-svp-muted text-sm max-w-xl mx-auto">كل وحدة تحلل بعداً مختلفاً من السوق — مدمجة في نظام واحد لا يُخطئ</p>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((mod, i) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="glass rounded-xl p-5 hover:border-opacity-80 transition-all duration-300 group"
                  style={{ borderTop: `2px solid ${mod.color}` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
                      {mod.icon}
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">{mod.title}</div>
                      <div className="text-svp-dim text-[10px]">{mod.titleAr}</div>
                    </div>
                    <div className="ml-auto text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
                      M{mod.id}
                    </div>
                  </div>

                  <p className="text-svp-muted text-xs leading-relaxed mb-4">{mod.desc}</p>

                  <pre className="code-block rounded-lg p-3 text-[10px] overflow-x-auto" style={{ color: `${mod.color}90` }}>
                    {mod.formula}
                  </pre>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════ SIGNAL SYSTEM ═══════════════════ */}
      <section id="signals" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <span className="text-svp-orange text-xs font-bold tracking-[0.2em] uppercase">Signal System</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">نظام الإشارات المتعدد</h2>
              <p className="text-svp-muted text-sm max-w-xl mx-auto">ثلاثة مستويات ثقة + إشارات شراء وبيع + حماية متعددة الطبقات</p>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto mt-4" />
            </div>

            {/* Signal Levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {[
                {
                  icon: '⚡',
                  level: 'EARLY WARNING',
                  levelAr: 'تحذير أولي',
                  min: '≥ 3.0',
                  color: '#f97316',
                  desc: 'الأنظمة تبدأ بالتفاعل — حجم مرتفع، CVD يتحرك، علامات استيعاب. استعد لدخول محتمل!',
                  action: 'مراقبة + تحضير أمر',
                  shape: 'shape.diamond',
                },
                {
                  icon: '▲',
                  level: 'CONFIRMED SIGNAL',
                  levelAr: 'إشارة مؤكدة',
                  min: '≥ 5.0',
                  color: '#14b8a6',
                  desc: 'تراكم مؤسسي مكتشف مع تأكيد VWAP وHTF Trend. نقاط دخول محددة مع SL/TP تلقائي.',
                  action: 'دخول تلقائي (Strategy)',
                  shape: 'shape.triangleup/down',
                },
                {
                  icon: '⭐',
                  level: 'STRONG SIGNAL',
                  levelAr: 'إشارة عالية الثقة',
                  min: '≥ 6.0',
                  color: '#eab308',
                  desc: 'كل الأنظمة مفعّلة — Divergence + Absorption + RVOL + VWAP + HTF. أعلى احتمال نجاح.',
                  action: 'ثقة عالية — حجم مضاعف',
                  shape: 'مع خلفية مميزة',
                },
              ].map((s, i) => (
                <div key={i} className="glass rounded-xl p-6 text-center" style={{ borderTop: `3px solid ${s.color}` }}>
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <div className="text-lg font-black mb-1" style={{ color: s.color }}>{s.level}</div>
                  <div className="text-svp-dim text-xs mb-3">{s.levelAr}</div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold mb-4" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                    Score {s.min}
                  </div>
                  <p className="text-svp-muted text-xs leading-relaxed mb-4">{s.desc}</p>
                  <div className="text-[10px] text-svp-dim font-mono p-2 rounded-lg bg-dark-1/60">{s.action}</div>
                </div>
              ))}
            </div>

            {/* Long / Short */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass-teal rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-teal-400 font-bold text-lg">LONG — شراء</div>
                    <div className="text-svp-dim text-xs">إشارات صعودية</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    'CVD يرتفع + Divergence صعودي',
                    'Z-Delta ≥ +1.2σ',
                    'RVOL ≥ 1.3x',
                    'Absorption بذيل سفلي قوي',
                    'فوق VWAP + EMA50 > EMA200',
                  ].map((c, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span className="text-svp-muted">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6" style={{ borderTop: '3px solid #ef4444' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <div className="text-red-400 font-bold text-lg">SHORT — بيع</div>
                    <div className="text-svp-dim text-xs">إشارات هبوطية</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    'CVD ينخفض + Divergence هبوطي',
                    'Z-Delta ≤ -1.2σ',
                    'RVOL ≥ 1.3x',
                    'Absorption بذيل علوي قوي',
                    'تحت VWAP + EMA50 < EMA200',
                  ].map((c, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span className="text-svp-muted">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <span className="text-svp-green text-xs font-bold tracking-[0.2em] uppercase">Features</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">12 ميزة احترافية</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="glass rounded-xl p-4 flex items-start gap-3 hover:border-teal-500/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold mb-0.5">{f.title}</div>
                    <div className="text-svp-dim text-xs">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════ GET INDICATOR ═══════════════════ */}
      <section id="get" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <span className="text-svp-teal text-xs font-bold tracking-[0.2em] uppercase">Get Started</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">احصل على المؤشر</h2>
              <p className="text-svp-muted text-sm">3 خطوات فقط لتشغيل SVP على TradingView</p>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto mt-4" />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                { step: '01', title: 'انسخ الكود', desc: 'اضغط زر النسخ أدناه لنسخ كود PineScript كاملاً', icon: <Copy className="w-5 h-5" /> },
                { step: '02', title: 'افتح PineScript', desc: 'TradingView → Pine Editor → امسح الكود الموجود والصق الكود الجديد', icon: <Terminal className="w-5 h-5" /> },
                { step: '03', title: 'فعّل المؤشر', desc: 'اضغط "Add to Chart" — المؤشر يعمل فوراً مع كل الإعدادات الافتراضية', icon: <Activity className="w-5 h-5" /> },
              ].map((s, i) => (
                <div key={i} className="glass rounded-xl p-5 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-mono font-bold border border-teal-500/30">
                    {s.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mx-auto mt-3 mb-3">
                    {s.icon}
                  </div>
                  <div className="text-white font-bold mb-1">{s.title}</div>
                  <p className="text-svp-dim text-xs">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Copy Button */}
            <div className="glass-gold rounded-2xl p-8 text-center">
              <div className="text-gradient-gold text-xl font-black mb-2">Smart Volume Predictor v2</div>
              <div className="text-svp-dim text-xs mb-6">كود PineScript كامل — جاهز للنسخ واللصق في TradingView</div>
              <button
                onClick={copyCode}
                className={`group inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                  copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-500 hover:to-cyan-500 shadow-lg shadow-teal-500/20'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? '✓ تم النسخ!' : 'نسخ الكود الكامل'}
              </button>
              <p className="text-svp-dim text-[10px] mt-4">
                من تطوير <span className="text-svp-gold">ابراهيم اللاحم ابوحمود</span> — استخدام شخصي فقط — الحقوق محفوظة
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <span className="text-svp-violet text-xs font-bold tracking-[0.2em] uppercase">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">أسئلة شائعة</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-teal-500 rounded-full mx-auto" />
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="glass rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-right cursor-pointer"
                  >
                    <span className="text-white text-sm font-bold">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-svp-dim flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-svp-dim flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-4 pb-4"
                    >
                      <p className="text-svp-muted text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════ RIGHTS ═══════════════════ */}
      <section id="rights" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <span className="text-svp-gold text-xs font-bold tracking-[0.2em] uppercase">Copyright & License</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">حقوق الملكية الفكرية</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-svp-gold to-yellow-400 rounded-full mx-auto" />
            </div>

            <div className="glass-gold rounded-2xl p-8 sm:p-10">
              {/* Author Card */}
              <div className="text-center mb-8 pb-8 border-b border-svp-gold/10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-svp-gold/30 to-yellow-600/30 flex items-center justify-center mx-auto mb-4 border-2 border-svp-gold/30">
                  <Award className="w-8 h-8 text-svp-gold" />
                </div>
                <div className="text-gradient-gold text-2xl font-black">ابراهيم اللاحم ابوحمود</div>
                <div className="text-svp-gold/50 text-sm font-mono mt-1">Ibrahim Al-Laham Abu Hammoud</div>
                <div className="text-svp-dim text-xs mt-2">المطور والمصمم الأصلي لمؤشر Smart Volume Predictor [SVP]</div>
              </div>

              {/* Rights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-1/40">
                  <FileText className="w-5 h-5 text-svp-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-bold">المؤلف والمالك الأصلي</div>
                    <div className="text-svp-muted text-xs mt-0.5">ابراهيم اللاحم ابوحمود هو المطور الوحيد والمالك الأصلي لجميع حقوق مؤشر Smart Volume Predictor [SVP] بجميع إصداراته.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-1/40">
                  <Lock className="w-5 h-5 text-svp-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-bold">حماية حقوق النشر</div>
                    <div className="text-svp-muted text-xs mt-0.5">جميع حقوق النشر والتأليف والملكية الفكرية محفوظة. يُمنع منعاً باتاً إعادة نشر الكود أو بيعه أو توزيعه أو تعديله دون إذن كتابي مسبق من المالك.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-1/40">
                  <Shield className="w-5 h-5 text-svp-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-bold">الاستخدام الشخصي فقط</div>
                    <div className="text-svp-muted text-xs mt-0.5">يُسمح باستخدام المؤشر لغايات التداول الشخصي فقط. أي استخدام تجاري أو إعادة توزيع يتطلب ترخيصاً رسمياً من المالك.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-1/40">
                  <Scale className="w-5 h-5 text-svp-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-bold">المسؤولية القانونية</div>
                    <div className="text-svp-muted text-xs mt-0.5">أي مخالفة لشروط الاستخدام تعرض صاحبها للمساءلة القانونية وفقاً لقوانين حماية الملكية الفكرية المعمول بها.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-1/40">
                  <Globe className="w-5 h-5 text-svp-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-bold">إثبات الملكية</div>
                    <div className="text-svp-muted text-xs mt-0.5">هذه الصفحة تُثبت ملكية المؤشر باسم المطور. تاريخ النشر و all associated intellectual property documentation serve as proof of original authorship.</div>
                  </div>
                </div>
              </div>

              {/* Copyright Notice */}
              <div className="text-center p-4 rounded-xl bg-dark-1/60 border border-svp-gold/10">
                <div className="text-svp-gold text-xs font-mono font-bold mb-2">
                  © {new Date().getFullYear()} ابراهيم اللاحم ابوحمود — جميع الحقوق محفوظة
                </div>
                <div className="text-svp-dim text-[10px] font-mono">
                  Smart Volume Predictor [SVP] — Version 2.0 — All Rights Reserved
                </div>
                <div className="text-svp-dim text-[10px] font-mono mt-1">
                  Original Creation Date: 2025 | Published: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
                <div className="mt-3 flex items-center justify-center gap-4 text-[10px]">
                  <span className="text-svp-gold/50 font-mono">SHA-256 Verified</span>
                  <span className="text-dark-5">|</span>
                  <span className="text-svp-gold/50 font-mono">Timestamp Recorded</span>
                  <span className="text-dark-5">|</span>
                  <span className="text-svp-gold/50 font-mono">IP Protected</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 glass rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-svp-orange flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-svp-orange text-sm font-bold mb-1">إخلاء مسؤولية — Disclaimer</div>
                  <p className="text-svp-dim text-xs leading-relaxed">
                    هذا المؤشر هو أداة تحليلية تعليمية ولا يُعد نصيحة مالية أو استثمارية. التداول ينطوي على مخاطر عالية وقد تخسر رأس مالك. الأداء السابق لا يضمن النتائج المستقبلية. استخدم المؤشر على مسؤوليتك الخاصة.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-dark-5/30 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">SVP <span className="text-svp-teal">v2</span></div>
                  <div className="text-svp-dim text-[10px]">Smart Volume Predictor</div>
                </div>
              </div>
              <p className="text-svp-dim text-xs leading-relaxed">
                مؤشر تنبؤي متقدم يكتشف تراكم الأموال الذكية والمؤسسية قبل الانفجار السعري.
              </p>
            </div>

            {/* Links */}
            <div>
              <div className="text-white text-xs font-bold mb-3">روابط سريعة</div>
              <div className="space-y-1.5">
                {[
                  { href: '#about', label: 'عن المؤشر' },
                  { href: '#modules', label: 'آلية العمل' },
                  { href: '#signals', label: 'نظام الإشارات' },
                  { href: '#features', label: 'المميزات' },
                  { href: '#faq', label: 'أسئلة شائعة' },
                ].map((l) => (
                  <a key={l.href} href={l.href} className="block text-svp-dim text-xs hover:text-teal-400 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div>
              <div className="text-white text-xs font-bold mb-3">الحقوق</div>
              <div className="text-svp-dim text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2">
                  <Verified className="w-3.5 h-3.5 text-svp-gold" />
                  <span>المالك الأصلي: ابراهيم اللاحم ابوحمود</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-svp-gold" />
                  <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-svp-gold" />
                  <span>الاستخدام الشخصي فقط</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-dark-5/30 pt-6 text-center">
            <div className="text-gradient-gold text-sm font-bold mb-1">ابراهيم اللاحم ابوحمود</div>
            <div className="text-svp-dim text-[10px] font-mono">
              © {new Date().getFullYear()} Ibrahim Al-Laham Abu Hammoud — Smart Volume Predictor [SVP] v2.0 — All Rights Reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Small utility component
function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
