import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ==========================================
// VIDEO URLS
// ==========================================
const HERO_BG = "/preview2.mp4";
const SECONDARY_BG = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4";

// ==========================================
// BRAND LOGOS DEFINITIONS
// ==========================================
const BRAND_LOGOS = [
  { name: "Think Travel", src: "/logo_think_travel.png", className: "h-5 md:h-7" },
  { name: "MAG", src: "/logo_mag.png", className: "h-4 md:h-5" },
  { name: "GenFlix", src: "/logo_genflix.png", className: "h-5 md:h-7" },
  { name: "Monshell", src: "/logo_monshell.png", className: "h-5 md:h-7" },
  { name: "Cèffy", src: "/logo_ceffy.png", className: "h-5 md:h-7" },
  { name: "SemiGlobe", src: "/logo_semiglobe.png", className: "h-5 md:h-7" },
  { name: "SW", src: "/logo_sw.png", className: "h-5 md:h-7" }
];

// ==========================================
// CUSTOM SVG ICONS (NO LIBRARIES)
// ==========================================
const ArrowUpRight = ({ className = "text-current" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${className}`}>
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const ChevronDown = ({ className = "text-current" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${className}`}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-400">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// ==========================================
// FADING VIDEO COMPONENT
// ==========================================
export function FadingVideo({ src, className, style, startTime = 0 }) {
  const videoRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [srcIndex, setSrcIndex] = useState(0);
  const isArray = Array.isArray(src);
  const currentSrc = isArray ? src[srcIndex] : src;

  const fadeDuration = 500; // ms
  const fadeOutDuration = 550; // ms

  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;

    if (startTime > 0 && video.currentTime < startTime) {
      video.currentTime = startTime;
    }

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / fadeDuration, 1);
      setOpacity(progress);

      if (elapsed < fadeDuration) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (startTime > 0 && video.currentTime < startTime - 0.5 && !isArray) {
      video.currentTime = startTime;
    }

    const remainingTime = video.duration - video.currentTime;
    
    if (remainingTime <= 0.55 && video.duration > 0) {
      const progress = Math.max(remainingTime / 0.55, 0);
      setOpacity(progress);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isArray) {
      setSrcIndex((prev) => (prev + 1) % src.length);
      setOpacity(0);
    } else {
      video.currentTime = startTime;
      video.play().catch(e => console.log(e));
      handleLoadedData();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      if (startTime > 0) {
        video.currentTime = startTime;
      }
      video.play().catch(e => console.log(e));
    }
  }, [srcIndex, currentSrc, startTime]);

  return (
    <video
      ref={videoRef}
      src={currentSrc}
      className={className}
      style={{ ...style, opacity, transition: 'opacity 0.05s linear' }}
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}

// ==========================================
// BLUR TEXT COMPONENT
// ==========================================
export function BlurText({ text, className, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay
      }
    }
  };

  const wordVariants = {
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      y: 50
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`flex flex-wrap justify-center ${className}`}
      style={{ rowGap: '0.1em' }}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={wordVariants}
          className="inline-block"
          style={{ marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ==========================================
// ACCORDION / FAQ ITEM COMPONENT
// ==========================================
function AccordionItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="liquid-glass rounded-[1rem] overflow-hidden transition-all duration-300">
      <button 
        onClick={onClick}
        className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-base font-medium text-white/95">{question}</span>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="px-6 py-5 text-sm text-white/80 leading-relaxed font-light">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// SECTION: LOADING SCREEN
// ==========================================
function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const words = ["Estratégia", "Design", "Código"];
  const wordIndex = Math.min(Math.floor(count / 33.4), words.length - 1);

  useEffect(() => {
    let animId;
    const startTime = performance.now();
    const duration = 2700; // 2700ms

    const updateCounter = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * 100);
      setCount(currentCount);

      if (progress < 1) {
        animId = requestAnimationFrame(updateCounter);
      } else {
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden font-sans">
      {/* Top Left Label */}
      <div className="flex items-center">
        <motion.span 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xs text-white/50 uppercase tracking-[0.3em] font-mono"
        >
          Método CRAFT
        </motion.span>
      </div>

      {/* Center Word Rotator */}
      <div className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-white/95"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div className="text-xs text-white/40 font-mono tracking-wider max-w-[200px] leading-relaxed">
            SÉRGIO COLPAERT © 2026 PRODUCT DESIGNER
          </div>
          {/* Counter display */}
          <div className="text-6xl md:text-8xl lg:text-9xl font-sans font-semibold tracking-tighter text-white tabular-nums leading-none">
            {String(count).padStart(3, "0")}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[2px] bg-white/10 w-full rounded-full overflow-hidden relative">
          <div 
            className="bg-white h-full origin-left transition-transform duration-75"
            style={{ 
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 12px rgba(255, 255, 255, 0.4)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP V4 COMPONENT
// ==========================================
export default function AppV4() {
  const [isLoading, setIsLoading] = useState(true);
  const [faqOpenIdx, setFaqOpenIdx] = useState(null);

  // Form Multi-Step State
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    urgency: '',
    budgetRange: '',
    name: '',
    whatsapp: ''
  });

  const handleScrollToForm = () => {
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // WhatsApp Redirect Logic
  const handleSendWhatsApp = () => {
    const { projectType, urgency, budgetRange, name, whatsapp } = formData;
    
    if (!name || !whatsapp) {
      alert("Por favor, preencha seu nome e WhatsApp.");
      return;
    }

    const message = `Olá, Sérgio! Acabei de preencher o formulário no seu site. Resumo: projeto de ${projectType}, urgência ${urgency}, faixa de investimento ${budgetRange}. Meu nome é ${name}. Aguardo seu retorno.`;
    
    // TODO: WhatsApp - Substituir XXXXXXXXXXX pelo número oficial em produção
    const waUrl = `https://wa.me/55XXXXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const motionProps = {
    initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
    animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' }
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden font-sans antialiased selection:bg-white/20 selection:text-white">
      
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
      
      {/* NAVBAR */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 md:px-8 lg:px-16 select-none">
        <div className="w-full max-w-[1400px] flex justify-between items-center">
          {/* Left: Brand Name Logo */}
          <div className="liquid-glass h-12 px-5 rounded-full flex items-center justify-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-sans font-semibold text-sm md:text-base text-white tracking-tight">Sergio Colpaert.</span>
          </div>

          {/* Center Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1.5 liquid-glass rounded-full px-2 py-1.5">
            {[
              { label: "Método", id: "metodo" },
              { label: "Garantias", id: "garantias" },
              { label: "Projetos", id: "projetos" },
              { label: "Sobre", id: "sobre" },
              { label: "FAQ", id: "faq" }
            ].map((link) => (
              <button 
                key={link.id}
                onClick={() => handleScrollToSection(link.id)}
                className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors font-sans"
              >
                {link.label}
              </button>
            ))}
            
            {/* CTA inside navbar */}
            <button 
              onClick={handleScrollToForm}
              className="bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-full px-4 py-2 flex items-center gap-1 ml-2 transition-transform hover:scale-105"
            >
              Solicitar diagnóstico
              <ArrowUpRight />
            </button>
          </div>

          {/* Right: Spacer */}
          <div className="h-12 w-12" />
        </div>
      </nav>

      {/* SECTION 1 — HERO */}
      <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-between">
        
        {/* Background Video (20% smaller, centered, rounded with CSS mask to fade edges) */}
        <FadingVideo
          src={HERO_BG}
          startTime={7}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-[2.5rem] z-0"
          style={{ 
            width: '80vw', 
            height: '80vh',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 95%)',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 95%)'
          }}
        />
        {/* Dark overlay for text legibility (slightly lighter as requested) */}
        <div className="absolute inset-0 bg-black/35 z-[1] pointer-events-none" />
        {/* Vignette effect to fade video edges into pure black */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none" 
          style={{ 
            background: 'radial-gradient(circle, rgba(0,0,0,0) 25%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,1) 85%)' 
          }} 
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col h-full justify-between items-center text-center px-4 pt-28 pb-10">
          
          <div className="my-auto max-w-4xl mx-auto flex flex-col items-center">
            {/* Booking Badge */}
            <motion.div
              {...motionProps}
              transition={{ ...motionProps.transition, delay: 3.4 }}
              className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/95 flex items-center gap-2 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Agenda aberta para o 3º trimestre. Vagas limitadas.</span>
            </motion.div>

            {/* Headline (Divided into two lines for desktop impact) */}
            <div className="flex flex-col items-center select-text">
              <BlurText 
                text="Seu site não é um custo."
                delay={3.0}
                className="text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-[-0.04em] leading-[0.95] text-white"
              />
              <BlurText 
                text="É o seu melhor vendedor."
                delay={3.3}
                className="text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-[-0.04em] leading-[0.95] text-white mt-2"
              />
            </div>

            {/* Subtext */}
            <motion.p
              {...motionProps}
              transition={{ ...motionProps.transition, delay: 3.8 }}
              className="text-base md:text-lg text-white/85 max-w-2xl mt-5 leading-snug font-light"
            >
              Sites sob medida para empresas que querem subir de nível. Estratégia, design e código. Um processo só. Um responsável só.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              {...motionProps}
              transition={{ ...motionProps.transition, delay: 4.1 }}
              className="flex flex-wrap justify-center items-center gap-4 mt-8"
            >
              <button 
                onClick={handleScrollToForm}
                className="liquid-glass-strong rounded-full px-7 py-3.5 flex items-center gap-2 hover:scale-105 transition-transform text-sm font-semibold tracking-wide"
              >
                Solicitar diagnóstico gratuito <ArrowUpRight />
              </button>
              <button 
                onClick={() => handleScrollToSection('metodo')}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium px-4 py-2 group"
              >
                Ver o método <ChevronDown />
              </button>
            </motion.div>

            {/* Microcopy */}
            <motion.span
              {...motionProps}
              transition={{ ...motionProps.transition, delay: 4.2 }}
              className="text-[11px] text-white/60 mt-3 block font-mono uppercase tracking-wider"
            >
              Resposta em poucos minutos. Sem compromisso.
            </motion.span>
          </div>

          {/* Bottom Trust Strip */}
          <motion.footer
            {...motionProps}
            transition={{ ...motionProps.transition, delay: 4.4 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <div className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/80 font-sans tracking-wide">
              Projetos premiados em UI Design.
            </div>
            
            <div className="relative w-full max-w-5xl mx-auto overflow-hidden mt-3 py-2">
              {/* Fade sutil nas laterais (gradiente dark) */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
              
              {/* Movimento de carrossel infinito */}
              <div className="animate-marquee flex items-center gap-16 md:gap-24">
                {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
                  <img 
                    key={`${brand.name}-${idx}`}
                    src={brand.src}
                    alt={brand.name}
                    className={`${brand.className} object-contain brightness-0 invert opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer flex-shrink-0`}
                  />
                ))}
              </div>
            </div>
          </motion.footer>

        </div>
      </section>

      {/* SECTION 2 — DIAGNÓSTICO / PROBLEMA */}
      <section className="relative w-full min-h-screen bg-black flex flex-col justify-center py-24 px-6 md:px-16">
        <div className="max-w-3xl mx-auto flex flex-col justify-center items-start">
          
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-sm text-white/60 font-mono block mb-4"
          >
            // O problema
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.0] text-white"
          >
            A maioria dos sites trava antes de vender.
          </motion.h2>

          {/* Problem Card Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="liquid-glass rounded-[1.5rem] p-8 md:p-10 w-full mt-10"
          >
            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed">
              Template genérico. Texto que ninguém lê. Visual que não passa confiança. O resultado aparece no caixa: visitas que não viram conversa, e conversas que não viram contrato.
            </p>
            <p className="text-lg md:text-xl text-white/95 font-medium mt-6 leading-relaxed">
              Um site bom não é o mais bonito. É o que conduz a decisão certa.
            </p>
          </motion.div>

          {/* Dores Chips Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {["Genérico demais", "Sem estratégia", "Sem resultado"].map((chip) => (
              <span key={chip} className="liquid-glass rounded-full px-4 py-2 text-sm text-white/85 font-sans flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white w-3 h-3 flex-shrink-0">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>{chip}</span>
              </span>
            ))}
          </motion.div>

        </div>
      </section>

      {/* SECTION 3 — MÉTODO CRAFT */}
      <section id="metodo" className="relative w-full min-h-screen bg-black overflow-hidden py-32 px-6 md:px-16">
        
        {/* Background Video */}
        <FadingVideo
          src={SECONDARY_BG}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Dark overlay for method section */}
        <div className="absolute inset-0 bg-black/55 z-[1]" />

        <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col h-full justify-between">
          
          {/* Header */}
          <div className="mb-16">
            <span className="text-sm text-white/60 font-mono block mb-4">// O método</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[0.95] text-white">
              Método CRAFT.<br />Cinco fases. Zero achismo.
            </h2>
            <p className="text-lg text-white/85 max-w-2xl mt-6 leading-relaxed font-light">
              Um processo autoral, do conceito ao lançamento. Cada fase tem entrega clara e ponto de aprovação.
            </p>
          </div>

          {/* Grid of 5 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Card C */}
            <div className="liquid-glass rounded-[1.25rem] p-5 min-h-[260px] flex flex-col justify-between">
              <span className="text-5xl font-semibold tracking-[-2px] text-white/30 block">C</span>
              <div>
                <h3 className="text-base font-semibold text-white/95 mt-4">Conceito</h3>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  Discovery e estratégia. Entendo o negócio antes de desenhar qualquer tela.
                </p>
              </div>
            </div>

            {/* Card R */}
            <div className="liquid-glass rounded-[1.25rem] p-5 min-h-[260px] flex flex-col justify-between">
              <span className="text-5xl font-semibold tracking-[-2px] text-white/30 block">R</span>
              <div>
                <h3 className="text-base font-semibold text-white/95 mt-4">Roteiro</h3>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  Arquitetura e copy. Defino o que a página diz e em que ordem.
                </p>
              </div>
            </div>

            {/* Card A */}
            <div className="liquid-glass rounded-[1.25rem] p-5 min-h-[260px] flex flex-col justify-between">
              <span className="text-5xl font-semibold tracking-[-2px] text-white/30 block">A</span>
              <div>
                <h3 className="text-base font-semibold text-white/95 mt-4">Arquitetura</h3>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  Wireframe aprovado. Você aprova tudo antes do início do desenvolvimento.
                </p>
              </div>
            </div>

            {/* Card F */}
            <div className="liquid-glass rounded-[1.25rem] p-5 min-h-[260px] flex flex-col justify-between">
              <span className="text-5xl font-semibold tracking-[-2px] text-white/30 block">F</span>
              <div>
                <h3 className="text-base font-semibold text-white/95 mt-4">Forma</h3>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  UI em alta fidelidade. Ajustamos a interface até a aprovação final.
                </p>
              </div>
            </div>

            {/* Card T */}
            <div className="liquid-glass rounded-[1.25rem] p-5 min-h-[260px] flex flex-col justify-between">
              <span className="text-5xl font-semibold tracking-[-2px] text-white/30 block">T</span>
              <div>
                <h3 className="text-base font-semibold text-white/95 mt-4">Tecnologia</h3>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  Desenvolvimento e go-live. Investimento dividido pelas entregas realizadas.
                </p>
              </div>
            </div>

          </div>

          {/* Post-CRAFT Strip */}
          <div className="liquid-glass rounded-full px-6 py-3.5 mt-8 w-full text-center md:text-left text-xs md:text-sm text-white/85">
            + 30 dias de acompanhamento após o lançamento. Ajustes finos com base no uso real.
          </div>

        </div>
      </section>

      {/* SECTION 4 — GARANTIAS */}
      <section id="garantias" className="relative w-full min-h-screen bg-black flex flex-col justify-center py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header */}
          <div className="mb-16">
            <span className="text-sm text-white/60 font-mono block mb-4">// Segurança</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-tight text-white">
              Risco do seu lado, zero.
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="liquid-glass rounded-[1.25rem] p-7 flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <CheckIcon />
                </div>
                <h3 className="text-lg font-semibold text-white/95">Garantia de escopo</h3>
              </div>
              <p className="text-sm text-white/80 mt-6 leading-relaxed font-light">
                O desenvolvimento só começa depois que você aprova formalmente o que será entregue.
              </p>
            </div>

            {/* Card 2 */}
            <div className="liquid-glass rounded-[1.25rem] p-7 flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <CheckIcon />
                </div>
                <h3 className="text-lg font-semibold text-white/95">Garantia de design</h3>
              </div>
              <p className="text-sm text-white/80 mt-6 leading-relaxed font-light">
                Revisões ilimitadas na interface até a aprovação final. Sem retrabalho que vira refém.
              </p>
            </div>

            {/* Card 3 */}
            <div className="liquid-glass rounded-[1.25rem] p-7 flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <CheckIcon />
                </div>
                <h3 className="text-lg font-semibold text-white/95">Garantia de fluxo</h3>
              </div>
              <p className="text-sm text-white/80 mt-6 leading-relaxed font-light">
                Pagamento dividido por marcos, alinhado a cada entrega do CRAFT.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5 — PROJETOS */}
      <section id="projetos" className="relative w-full min-h-screen bg-black py-32 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header */}
          <div className="mb-16">
            <span className="text-sm text-white/60 font-mono block mb-4">// Projetos</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-tight text-white">
              Trabalho que sustenta o resultado.
            </h2>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {[
              { name: "Think Travel", tag: "Design de Conversão", logo: "/logo_think_travel.png" },
              { name: "MAG", tag: "Portal & Plataforma", logo: "/logo_mag.png" },
              { name: "GenFlix", tag: "Web App & Plataforma", logo: "/logo_genflix.png" },
              { name: "Monshell", tag: "Direção de Arte & Dev", logo: "/logo_monshell.png" },
              { name: "Cèffy", tag: "E-Commerce de Luxo", logo: "/logo_ceffy.png", award: true },
              { name: "SemiGlobe", tag: "Branding & Web Design", logo: "/logo_semiglobe.png" }
            ].map((proj, idx) => (
              <div key={idx} className="liquid-glass rounded-[1.25rem] overflow-hidden group cursor-pointer relative flex flex-col justify-between">
                
                {/* Logo Display area */}
                <div className="aspect-[4/3] w-full bg-white/[0.01] flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={proj.logo} 
                    alt={proj.name} 
                    className="max-h-10 max-w-[65%] object-contain brightness-0 invert opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                  
                  {proj.award && (
                    <span className="absolute top-4 right-4 liquid-glass-strong text-[9px] font-bold text-white uppercase tracking-wider px-3 py-1 rounded-full">
                      Premiado · UI Design
                    </span>
                  )}
                </div>

                {/* Footer details */}
                <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                  <h3 className="text-lg font-semibold text-white/95 group-hover:translate-x-1 transition-transform duration-300">
                    {proj.name}
                  </h3>
                  <span className="text-xs text-white/60 block mt-1 font-sans">{proj.tag}</span>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* SECTION 6 — SOBRE / BIO */}
      <section id="sobre" className="relative w-full min-h-screen bg-black flex items-center py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          
          {/* Left Column: Profile Photo */}
          <div className="liquid-glass rounded-[1.5rem] aspect-[4/5] w-full overflow-hidden relative shadow-2xl">
            <img 
              src="/profile.jpg" 
              alt="Sérgio Colpaert" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out" 
            />
          </div>

          {/* Right Column: Bio text */}
          <div className="flex flex-col items-start justify-center">
            <span className="text-sm text-white/60 font-mono block mb-4">// Quem faz</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-tight text-white mb-6">
              Sérgio Colpaert.
            </h2>
            <div className="text-lg text-white/80 font-light leading-relaxed flex flex-col gap-6">
              <p>
                Sou <strong className="text-white font-medium">Product Designer</strong> — desenho produtos digitais ponta a ponta, da estratégia ao código. Mais de 6 anos transformando ideias em interfaces que funcionam.
              </p>
              <p>
                Trabalho sozinho com você, sem intermediário. Quem desenha é quem entende do seu negócio. Quem entende é quem entrega.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7 — FORMULÁRIO DE CONVERSÃO */}
      <section id="form" className="relative w-full min-h-screen bg-black flex items-center py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="flex flex-col items-start">
            <span className="text-sm text-white/60 font-mono block mb-4">// Vamos conversar</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-tight text-white mb-4">
              Solicite seu diagnóstico gratuito.
            </h2>
            <p className="text-lg text-white/80 font-light">
              Poucas perguntas. Resposta em poucos minutos.
            </p>
          </div>

          {/* Right Form Card */}
          <div className="w-full flex justify-center md:justify-end">
            <div className="liquid-glass-strong rounded-[1.5rem] p-8 w-full max-w-lg relative border border-white/10 shadow-2xl flex flex-col min-h-[460px]">
              
              {/* Form Step Indicator */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-[#89AACC]">Passo {formStep} de 4</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        formStep >= step ? 'bg-white scale-110' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Form Step Content */}
              <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="text-lg font-medium text-white/95 mb-2">Qual o tipo do seu projeto?</h3>
                      {[
                        "Site institucional",
                        "Landing page",
                        "E-commerce",
                        "Web app"
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFormData({ ...formData, projectType: option })}
                          className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${
                            formData.projectType === option 
                              ? 'border-white bg-white/5 text-white' 
                              : 'border-white/10 bg-white/[0.01] text-white/70 hover:border-white/30'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="text-lg font-medium text-white/95 mb-2">Qual a urgência de entrega?</h3>
                      {[
                        "O quanto antes",
                        "Nas próximas semanas",
                        "Ainda planejando"
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFormData({ ...formData, urgency: option })}
                          className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${
                            formData.urgency === option 
                              ? 'border-white bg-white/5 text-white' 
                              : 'border-white/10 bg-white/[0.01] text-white/70 hover:border-white/30'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {formStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="text-lg font-medium text-white/95 mb-2">Faixa de investimento estimada:</h3>
                      {[
                        "R$ 5–10k",
                        "R$ 10–20k",
                        "R$ 20–40k",
                        "Acima de R$ 40k"
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFormData({ ...formData, budgetRange: option })}
                          className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${
                            formData.budgetRange === option 
                              ? 'border-white bg-white/5 text-white' 
                              : 'border-white/10 bg-white/[0.01] text-white/70 hover:border-white/30'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {formStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="text-lg font-medium text-white/95 mb-2">Dados de contato:</h3>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-white/60 font-mono">NOME COMPLETO</label>
                        <input
                          type="text"
                          placeholder="Ex: João Silva"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/[0.02] border border-white/10 focus:border-white/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1 mt-2">
                        <label className="text-xs text-white/60 font-mono">WHATSAPP</label>
                        <input
                          type="tel"
                          placeholder="Ex: (11) 99999-9999"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          className="w-full bg-white/[0.02] border border-white/10 focus:border-white/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Form Navigation Buttons */}
              <div className="flex justify-between items-center gap-4 mt-8 pt-4 border-t border-white/5">
                {formStep > 1 && (
                  <button 
                    onClick={() => setFormStep(formStep - 1)}
                    className="text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors py-2 px-3 rounded"
                  >
                    Voltar
                  </button>
                )}
                
                {formStep < 4 ? (
                  <button 
                    disabled={
                      (formStep === 1 && !formData.projectType) || 
                      (formStep === 2 && !formData.urgency) || 
                      (formStep === 3 && !formData.budgetRange)
                    }
                    onClick={() => setFormStep(formStep + 1)}
                    className="ml-auto bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-full px-5 py-3 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 transition-all"
                  >
                    Continuar
                  </button>
                ) : (
                  <button 
                    onClick={handleSendWhatsApp}
                    className="ml-auto bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded-full px-6 py-3 flex items-center gap-1.5 hover:scale-105 transition-all shadow-lg"
                  >
                    Enviar para o WhatsApp
                  </button>
                )}
              </div>

              {formStep === 4 && (
                <span className="text-[10px] text-white/40 text-center mt-3 block font-mono">
                  Resposta em poucos minutos. Sem compromisso.
                </span>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8 — FAQ + FECHAMENTO */}
      <section id="faq" className="relative w-full min-h-screen bg-black py-32 px-6 md:px-16 border-t border-white/5 flex flex-col justify-between">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-16">
            <span className="text-sm text-white/60 font-mono block mb-4">// Dúvidas</span>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
              Antes de você perguntar.
            </h2>
          </div>

          {/* Accordion Questions */}
          <div className="flex flex-col gap-4">
            {[
              {
                q: "Quanto custa um projeto?",
                a: "Projetos a partir de R$ 5.000. O valor final depende do escopo, definido no diagnóstico."
              },
              {
                q: "Quanto tempo leva?",
                a: "Em média de 4 a 6 semanas, conforme a complexidade. O cronograma é fechado na fase de Conceito."
              },
              {
                q: "O que é \"Product Designer\"?",
                a: "É quem desenha produtos digitais de ponta a ponta — pensando estratégia, experiência e código, não só o visual."
              },
              {
                q: "Você desenvolve ou só desenha?",
                a: "Os dois. Desenho e desenvolvo. Um processo só, um responsável só."
              },
              {
                q: "E depois que o site fica pronto?",
                a: "30 dias de acompanhamento incluídos, com plano de manutenção mensal opcional."
              }
            ].map((faq, idx) => (
              <AccordionItem
                key={idx}
                question={faq.q}
                answer={faq.a}
                isOpen={faqOpenIdx === idx}
                onClick={() => setFaqOpenIdx(faqOpenIdx === idx ? null : idx)}
              />
            ))}
          </div>

          {/* Final CTA Band */}
          <div className="liquid-glass-strong rounded-[1.5rem] p-10 text-center mt-20 border border-white/10 shadow-2xl flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-6">
              Pronto para um site que vende?
            </h3>
            <button 
              onClick={handleScrollToForm}
              className="bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-full px-6 py-3.5 flex items-center gap-1.5 hover:scale-105 transition-all shadow-lg"
            >
              Solicitar diagnóstico gratuito <ArrowUpRight />
            </button>
            <span className="text-[10px] text-white/50 mt-4 block font-mono uppercase tracking-wider">
              Resposta em poucos minutos. Sem compromisso.
            </span>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/5 bg-black py-10 px-8 md:px-16 flex flex-col sm:flex-row justify-between items-center gap-6 text-white/50 text-sm">
        <div>
          © 2026 Sérgio Colpaert · Product Designer
        </div>
        <div className="flex items-center gap-6">
          <a 
            href="https://www.behance.net/sergiocolpaert" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            Behance
          </a>
          <a 
            href="https://www.linkedin.com/in/sergio-colpaert/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a 
            href="https://wa.me/5521993755022?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20gratuito." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </footer>

        </motion.div>
      )}

    </div>
  );
}
