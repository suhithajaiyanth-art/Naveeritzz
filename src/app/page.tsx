"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Heart,
  MapPin,
  Waves,
  Navigation2,
  Quote,
  Sun,
  Compass,
  Shell,
  Wind,
  Sparkles,
  CalendarDays,
  Clock,
  Bus,
  Train,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fadeInUp,
  fadeInScale,
  staggerContainer,
  slideInLeft,
  slideInRight,
  scaleIn,
  floatingAnimation,
  rotatingAnimation,
  pulseAnimation,
} from "@/lib/animations";
import {
  colors,
  baseButtonClasses,
  baseCardClasses,
  baseLabelClasses,
  baseInputClasses,
  baseTextareaClasses,
} from "@/lib/constants";

interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

// Reusable Components
const Grain = () => (
  <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const NRLogo = ({ className = "" }: { className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="relative flex items-center justify-center p-6 md:p-8">
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(232, 162, 93, 0.1) 0%, rgba(185, 226, 229, 0.1) 100%)",
        }}
        className="absolute inset-0 rounded-full blur-2xl group-hover:opacity-100 transition-opacity duration-1000 opacity-0"
      />
      <motion.div
        className="absolute inset-2 border-[0.5px] border-white/20 rounded-full"
        {...rotatingAnimation}
      />
      <div className="relative z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center"
        >
          <span className="text-4xl md:text-5xl font-serif font-light text-white tracking-tighter">
            N
          </span>
          <div className="flex flex-col items-center mx-3">
            <motion.div
              animate={{ height: [0, 16, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundColor: "rgba(232, 162, 93, 0.6)" }}
              className="w-[0.5px]"
            />
            <span
              style={{ color: "var(--color-gold)" }}
              className="font-accent text-2xl leading-none my-1"
            >
              &
            </span>
            <motion.div
              animate={{ height: [0, 16, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              style={{ backgroundColor: "rgba(232, 162, 93, 0.6)" }}
              className="w-[0.5px]"
            />
          </div>
          <span className="text-4xl md:text-5xl font-serif font-light text-white tracking-tighter">
            R
          </span>
        </motion.div>
      </div>
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1"
        animate={{ rotate: 360 }}
        style={{ originY: "40px" }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div
          style={{
            backgroundColor: "var(--color-gold)",
            boxShadow: "0 0 10px var(--color-gold)",
          }}
          className="w-1 h-1 rounded-full"
        />
      </motion.div>
    </div>
  </div>
);

export default function WeddingInvitation() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const [metCountdown, setMetCountdown] = useState<number>(0);
  const [weddingCountdown, setWeddingCountdown] = useState<number>(0);
  const [metLabel, setMetLabel] = useState("Until Our Tides Meet");

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const metDate = new Date(2025, 10, 14).getTime();
  const weddingDate = new Date(2026, 2, 5).getTime();

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date().getTime();
      if (now < metDate) {
        setMetCountdown(Math.ceil((metDate - now) / (1000 * 60 * 60 * 24)));
        setMetLabel("Until Our First Meet");
      } else {
        setMetCountdown(Math.floor((now - metDate) / (1000 * 60 * 60 * 24)));
        setMetLabel("Since We First Met");
      }
      setWeddingCountdown(
        Math.max(0, Math.ceil((weddingDate - now) / (1000 * 60 * 60 * 24))),
      );
    };
    calculateDays();
    const timer = setInterval(calculateDays, 3600000);
    return () => clearInterval(timer);
  }, [metDate, weddingDate]);

  // Load messages from API on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await fetch("/api/guestbook");
        if (res.ok) {
          const data = await res.json();
          setWishes(data);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, []);

  const handleSendWish = async () => {
    if (!newName.trim() || !newMessage.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, message: newMessage }),
      });

      if (res.ok) {
        const newWish = await res.json();
        setWishes([newWish, ...wishes]);
        setNewName("");
        setNewMessage("");
      } else {
        console.error("Failed to save message");
      }
    } catch (error) {
      console.error("Error sending wish:", error);
    } finally {
      setIsSending(false);
    }
  };

  const generateICS = () => {
    const title = "NaveeRitzz Wedding";
    const location = "Bhavani, Tamilnadu";
    const description = "Join us to celebrate Naveen and Rithika's wedding.";
    const startDate = "20260305T133000Z"; // 7:00 PM IST
    const endDate = "20260305T153000Z"; // 9:00 PM IST
    const uid = `naveeritzz-wedding-${Date.now()}@naveeritzz.com`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NaveeRitzz//Wedding//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${uid}
DTSTART:${startDate}
DTEND:${endDate}
DTSTAMP:${dtstamp}
CREATED:${dtstamp}
DESCRIPTION:${description}
LOCATION:${location}
SUMMARY:${title}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "NaveeRitzz-Wedding.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const FloatingElement = ({
    children,
    delay = 0,
    className = "",
    style = {},
  }: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <motion.div
      animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );

  const WoodenBoat = ({
    color = "#C19A6B",
    className = "",
  }: {
    color?: string;
    className?: string;
  }) => (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 md:w-24 md:h-24"
      >
        <path d="M8 36C8 36 12 52 32 52C52 52 56 36 56 36H8Z" fill={color} />
        <path d="M8 36H56L52 40H12L8 36Z" fill={colors.wood} opacity="0.3" />
        <path d="M31 12V36H33V12H31Z" fill={colors.wood} />
        <path
          d="M33 14L50 32H33V14Z"
          fill={colors.cream}
          fillOpacity="0.9"
          stroke={colors.wood}
          strokeWidth="0.5"
        />
        <path
          d="M31 14L16 32H31V14Z"
          fill={colors.cream}
          fillOpacity="0.8"
          stroke={colors.wood}
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );

  const BottleButton = ({
    onClick,
    children,
    disabled = false,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
  }) => {
    const [isPopping, setIsPopping] = useState(false);
    const handleClick = () => {
      if (disabled) return;
      setIsPopping(true);
      setTimeout(() => {
        setIsPopping(false);
        onClick();
      }, 800);
    };
    return (
      <motion.button
        onClick={handleClick}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        disabled={disabled}
        className={`relative w-full h-24 group mt-4 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div
          style={{ backgroundColor: "rgba(27, 60, 64, 0.1)" }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 rounded-full blur-xl"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{ borderColor: "var(--color-teal)" }}
            className={`relative w-full h-16 bg-white backdrop-blur-xl border-2 rounded-[2rem] flex items-center justify-center overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-700 ${disabled ? "opacity-50" : ""}`}
          >
            <motion.div
              style={{
                background:
                  "linear-gradient(to top, rgba(185, 226, 229, 0.7) 0%, rgba(185, 226, 229, 0.3) 100%)",
              }}
              animate={{ y: [0, 5, 0], skewY: [-1, 1, -1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 right-0 h-[65%]"
            />
            <div className="relative z-20 flex items-center gap-4">
              <span
                style={{ color: "var(--color-darkTeal)" }}
                className="tracking-[0.5em] text-[12px] font-normal uppercase drop-shadow-sm"
              >
                {children}
              </span>
              <AnimatePresence>
                {isPopping && !disabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{ color: "var(--color-gold)" }}
                  >
                    <Sparkles size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              style={{ backgroundColor: "var(--color-cream)" }}
              animate={{ rotate: [5, -5, 5], y: [0, -3, 0], x: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute left-[10%] w-10 h-6 rounded shadow-sm opacity-60 flex flex-col gap-1 p-1 justify-center"
            >
              <div
                style={{ backgroundColor: "rgba(27, 60, 64, 0.1)" }}
                className="h-[1px] w-full"
              />
              <div
                style={{ backgroundColor: "rgba(27, 60, 64, 0.1)" }}
                className="h-[1px] w-[80%]"
              />
            </motion.div>
            <div className="absolute top-0 left-0 w-full h-2 bg-white/30" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/5" />
          </div>
          <div className="absolute -right-1 w-10 h-10 flex items-center">
            <div className="w-6 h-8 bg-white/10 backdrop-blur-xl border border-white/40 rounded-r-xl border-l-0" />
            <motion.div
              style={{ backgroundColor: "var(--color-wood)" }}
              animate={
                isPopping && !disabled
                  ? {
                      x: [0, 40],
                      y: [0, -20],
                      rotate: [0, 45],
                      opacity: [1, 0],
                    }
                  : { x: 0, y: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-4 h-6 rounded-sm shadow-md z-30"
            />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute left-4 right-4 top-3 bottom-3 rounded-[2rem] bg-[var(--color-gold)] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out opacity-20 shadow-[0_8px_30px_rgba(232,162,93,0.12)]" />
          {isPopping && !disabled && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.7 }}
              animate={{ scale: 5, opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[var(--color-teal)] rounded-full pointer-events-none opacity-60 shadow-[0_12px_40px_rgba(185,226,229,0.18)]"
            />
          )}
        </div>
      </motion.button>
    );
  };

  const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      const toggleVisibility = () => {
        setIsVisible(window.pageYOffset > 300);
      };
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            style={{ borderColor: "rgba(27, 60, 64, 0.05)" }}
            className="fixed bottom-8 right-8 z-[100] bg-white/60 backdrop-blur-xl border p-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] transition-all duration-500 group"
          >
            <div style={{ color: "var(--color-darkTeal)" }} className="p-2">
              <Navigation2 size={24} className="rotate-[-45deg]" />
            </div>
            <motion.div
              {...pulseAnimation}
              style={{ color: "var(--color-gold)" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles size={16} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-cream)",
        color: "var(--color-darkTeal)",
      }}
      className="min-h-screen selection:bg-[#B9E2E5] selection:text-[#1B3C40] overflow-x-hidden font-sans"
    >
      <Grain />
      <ScrollToTop />

      {/* Hero Section */}
      
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24">

        <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
          <div
            style={{
              background:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, var(--color-cream) 100%)",
            }}
            className="absolute inset-0 z-10"
          />
          <img
            src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=2000"
            alt="Aerial Beach"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

        <div className="relative z-20 container mx-auto px-6 pt-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.3, delayChildren: 0.5 },
              },
            }}
            className="flex flex-col items-center text-center space-y-8 md:space-y-10"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="mb-[-10px] md:mb-0"
            >
              <NRLogo />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-col items-center gap-2 mt-2 md:mt-4"
            >
              <div className="flex items-center gap-4">
                <div
                  style={{
                    background:
                      "linear-gradient(to right, transparent 0%, rgba(232, 162, 93, 0.6) 50%, rgba(232, 162, 93, 0.6) 100%)",
                  }}
                  className="h-px w-6 md:w-10"
                />
                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/90 text-center">
                  A new beginning, written by the waves.
                </span>
                <div
                  style={{
                    background:
                      "linear-gradient(to left, transparent 0%, rgba(232, 162, 93, 0.6) 50%, rgba(232, 162, 93, 0.6) 100%)",
                  }}
                  className="h-px w-6 md:w-10"
                />
              </div>
              <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/90 text-center">
                Two hearts.. One horizon.
              </span>
            </motion.div>

            <motion.div variants={scaleIn} className="relative">
              <h1 className="text-[3.5rem] md:text-[7.5rem] font-serif leading-none tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <span className="block italic font-light opacity-95">
                  Naveen
                </span>
                <span
                  style={{ color: "var(--color-gold)" }}
                  className="text-2xl md:text-5xl font-accent lowercase block -my-3 md:-my-8 ml-16 md:ml-40 drop-shadow-lg"
                >
                  &
                </span>
                <span className="block font-medium">Rithika</span>
              </h1>
              <FloatingElement
                delay={1}
                className="absolute -top-12 -right-8 hidden md:block"
                style={{ color: "rgba(185, 226, 229, 0.8)" }}
              >
                <Shell size={48} />
              </FloatingElement>
              <FloatingElement
                delay={2.5}
                className="absolute -bottom-8 -left-12 hidden md:block"
                style={{ color: "rgba(232, 162, 93, 0.6)" }}
              >
                <Sun size={64} />
              </FloatingElement>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
  <span className="text-[12px] uppercase tracking-[0.45em] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
    Scroll to Dive
  </span>

          <div
            style={{
              background:
                "linear-gradient(to bottom, var(--color-teal) 0%, transparent 100%)",
            }}
            className="w-[1px] h-12"
          />
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="py-40 relative overflow-hidden bg-[rgba(27,60,64,0.05)]">
        <div
          style={{ backgroundColor: "rgba(185, 226, 229, 0.1)" }}
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -mr-32"
        />
        <div
          style={{ backgroundColor: "rgba(232, 162, 93, 0.1)" }}
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[120px] -ml-40"
        />
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInScale}>
              <Compass
                style={{ color: "rgba(232, 162, 93, 0.4)" }}
                className="mx-auto mb-8"
                size={32}
              />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              style={{ color: "var(--color-darkTeal)" }}
              className="text-3xl md:text-5xl font-serif italic leading-snug"
            >
              "Two hearts drift together <br className="hidden md:block" /> to
              form a single shore."
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="flex justify-center items-center gap-6 opacity-30"
            >
              <div
                style={{ backgroundColor: "var(--color-darkTeal)" }}
                className="h-px w-12"
              />
              <Waves size={20} />
              <div
                style={{ backgroundColor: "var(--color-darkTeal)" }}
                className="h-px w-12"
              />
            </motion.div>
            <motion.p
              variants={fadeInUp}
              style={{ color: "rgba(27, 60, 64, 0.7)" }}
              className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
            >
              Our journey has been like the tide—constant, rhythmic, and
              destined. We invite you to join us as we anchor our lives in the
              beautiful waters of forever.
            </motion.p>
          </motion.div>

          <motion.div
            variants={scaleIn}
            className="relative mt-8 md:mt-12 flex justify-center"
          >
            {/* Outer rotating rings */}
            <div className="absolute inset-0 -m-10 border border-white/15 rounded-full animate-[spin_22s_linear_infinite] hidden md:block" />
            <div
              style={{ borderColor: "rgba(232,162,93,0.25)" }}
              className="absolute inset-0 -m-5 border rounded-full animate-[spin_16s_linear_infinite_reverse] hidden md:block"
            />

            {/* Semi-Solid Card with Animations */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              whileHover={{ y: -12, transition: { type: "spring", stiffness: 300 } }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ backgroundColor: "rgba(185, 226, 229, 0.5)" }}
              className="relative max-w-[90vw] md:max-w-none border border-white/40 rounded-[2.8rem] px-10 py-8 md:px-12 md:py-10 space-y-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)] transition-all duration-500">
              {/* Card highlight */}
              <div className="absolute inset-0 rounded-[2.8rem] bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

              {/* Top icons */}
              <div className="flex items-center justify-center gap-4">
                <Heart
                  size={20}
                  style={{
                    color: "var(--color-gold)",
                    fill: "var(--color-gold)",
                  }}
                />
                <div
                  style={{
                    background:
                      "linear-gradient(to right, transparent, var(--color-gold), transparent)",
                  }}
                  className="h-px w-10"
                />
                <Compass
                  size={20}
                  style={{ color: "var(--color-gold)" }}
                  className="animate-[spin_4s_linear_infinite]"
                />
              </div>

              {/* Date & place */}
              <div className="space-y-2 text-center">
                <p className="text-2xl md:text-4xl font-serif tracking-[0.18em] text-[var(--color-darkTeal)] drop-shadow-2xl">
                  March 5 2026, Thursday
                </p>

                <div className="flex items-center justify-center gap-3">
                  <MapPin size={15} style={{ color: "var(--color-darkTeal)" }} />
                  <p
                    style={{ color: "var(--color-darkTeal)" }}
                    className="text-[10px] md:text-[14px] uppercase tracking-[0.35em] font-bold"
                  >
                    Bhavani • Tamil Nadu
                  </p>
                </div>
              </div>

              {/* Save the Date – Calendar Style Button */}
              <div className="pt-4 flex justify-center">
                <motion.div
                  whileTap={{ scale: 0.95 }} // click animation
                  whileHover={{ scale: 1.05 }} // subtle hover animation
                  style={{ backgroundColor: "var(--color-gold)" }}
                  className="relative w-max rounded-lg border border-white/20 shadow-[0_5px_15px_rgba(0,0,0,0.15)] 
               backdrop-blur-sm cursor-pointer overflow-hidden"
                  onClick={() => setShowCalendarModal(true)}
                >
                  {/* Button Text */}
                  <div className="px-6 py-2 text-[11px] md:text-[12px] font-black uppercase tracking-[0.35em] text-white text-center relative z-10">
                    Save the Date
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCalendarModal(false)}
          />
          <div className="relative z-10 bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Add to Calendar</h3>
            <p className="text-sm mb-4" style={{ color: "rgba(27,60,64,0.8)" }}>
              Add "NaveeRitzz Wedding" to your Google Calendar for March 5, 2026 at 7:00 PM IST.
            </p>
            <div className="flex flex-col gap-3">
              <a
                className="w-full text-center px-4 py-2 bg-[#2A8C9A] text-white rounded-lg font-medium"
                href={
                  (() => {
                    const title = "NaveeRitzz Wedding";
                    const location = "Bhavani, Tamilnadu";
                    const details = "Join us to celebrate Naveen and Rithika's wedding.";
                    const start = "20260305T133000Z"; // 7:00 PM IST -> 13:30 UTC
                    const end = "20260305T153000Z"; // 9:00 PM IST -> 15:30 UTC
                    return (
                      "https://www.google.com/calendar/render?action=TEMPLATE" +
                      `&text=${encodeURIComponent(title)}` +
                      `&dates=${start}/${end}` +
                      `&details=${encodeURIComponent(details)}` +
                      `&location=${encodeURIComponent(location)}` +
                      `&ctz=Asia/Kolkata`
                    );
                  })()
                }
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowCalendarModal(false)}
              >
                Add to Google Calendar
              </a>
              <button
                className="w-full px-4 py-2 bg-[#E8A25D] text-white rounded-lg font-medium hover:opacity-90"
                onClick={() => {
                  generateICS();
                  setShowCalendarModal(false);
                }}
              >
                Download .ics File
              </button>
              <button
                className="w-full px-4 py-2 border rounded-lg"
                onClick={() => setShowCalendarModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Counters Section */}
      <section className="py-32 bg-[#F9F7F2] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8 text-center md:text-left"
            >
              <motion.div
                variants={slideInLeft}
                style={{
                  backgroundColor: "rgba(185, 226, 229, 0.2)",
                  color: "var(--color-darkTeal)",
                }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]"
              >
                <Waves size={12} /> Our Journey
              </motion.div>
              <motion.h3
                variants={slideInLeft}
                className="text-4xl md:text-6xl font-serif"
              >
                {metLabel}
              </motion.h3>
              <motion.div
                variants={fadeInScale}
                className="flex flex-col gap-2"
              >
                <motion.span
                  style={{ color: "var(--color-gold)" }}
                  className="text-8xl md:text-[10rem] font-serif font-light leading-none inline-block"
                  initial={{ scale: 1, opacity: 0.85 }}
                  whileInView={{
                    scale: [1, 1.08, 1],
                    opacity: [0.85, 1, 0.85],
                  }}
                  viewport={{ once: false }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  {metCountdown}
                </motion.span>

                <span
                  style={{ color: "rgba(27, 60, 64, 0.4)" }}
                  className="text-sm uppercase tracking-[0.6em] font-bold"
                >
                  Days of Sunlight
                </span>
              </motion.div>
              <motion.p
                variants={fadeInUp}
                style={{ color: "rgba(27, 60, 64, 0.6)" }}
                className="max-w-sm mx-auto md:mx-0 font-light italic"
              >
                The day the horizon shifted.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8 text-center md:text-right"
            >
              <motion.div
                variants={slideInRight}
                style={{
                  backgroundColor: "rgba(232, 162, 93, 0.2)",
                  color: "var(--color-darkTeal)",
                }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] md:flex-row-reverse"
              >
                <Wind size={12} /> The Big Day
              </motion.div>
              <motion.h3
                variants={slideInRight}
                className="text-4xl md:text-6xl font-serif"
              >
                Sailing to Forever
              </motion.h3>
              <motion.div
                variants={fadeInScale}
                className="flex flex-col gap-2"
              >
                <motion.span
                  style={{ color: "var(--color-teal)" }}
                  className="text-8xl md:text-[10rem] font-serif font-light leading-none inline-block"
                  initial={{ scale: 1, opacity: 0.85 }}
                  whileInView={{
                    scale: [1, 1.08, 1],
                    opacity: [0.85, 1, 0.85],
                  }}
                  viewport={{ once: false }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  {weddingCountdown}
                </motion.span>

                <span
                  style={{ color: "rgba(27, 60, 64, 0.4)" }}
                  className="text-sm uppercase tracking-[0.6em] font-bold"
                >
                  Days Until High Tide
                </span>
              </motion.div>
              <motion.p
                variants={fadeInUp}
                style={{ color: "rgba(27, 60, 64, 0.6)" }}
                className="max-w-sm mx-auto md:ml-auto md:mr-0 font-light italic"
              >
                The beginning of our greatest sail.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-24 space-y-6"
          >
            <motion.span
              variants={fadeInUp}
              style={{ color: "var(--color-gold)" }}
              className="text-[10px] font-bold uppercase tracking-[0.8em]"
            >
              The Itinerary
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-serif"
            >
              Moments to Celebrate
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              style={{ color: "rgba(27, 60, 64, 0.6)" }}
              className="text-lg font-light italic max-w-xl mx-auto"
            >
              The days we’ve been waiting to celebrate with you.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12"
          >
            {[
              {
                type: "Golden Hour Reception",
                date: "March 5, 2026, Thursday",
                time: "07:00 PM onwards",
                venue: "KMP Mahal",
                loc: "Petharan Thottam, Bhavani",
                icon: <Sun size={32} style={{ color: "var(--color-gold)" }} />,
                img: "/KMPMahal.jpeg",
              },
              {
                type: "Where We Tie the Knot",
                date: "March 6, 2026, Friday",
                time: "07:00 AM - 08:30 AM",
                venue: "Sangameswarar Temple",
                loc: "Kooduthurai, Bhavani",
                icon: (
                  <Heart
                    size={24}
                    style={{
                      color: "var(--color-gold)",
                      fill: "var(--color-gold)",
                    }}
                  />
                ),
                img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1200",
              },
            ].map((event, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="group relative"
              >
                <div
                  style={{
                    backgroundColor: "var(--color-cream)",
                    borderColor: "rgba(27, 60, 64, 0.05)",
                    boxShadow: `0 20px 25px -5px rgba(27, 60, 64, 0.05)`,
                  }}
                  className="relative overflow-hidden rounded-[2.5rem] border"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={event.img}
                      alt={event.type}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                    />
                  </div>
                  <div className="p-12 space-y-8 relative">
                    <div
                      style={{
                        backgroundColor: "white",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      className="absolute -top-8 right-12 w-16 h-16 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500"
                    >
                      {event.icon}
                    </div>
                    <div className="space-y-2">
                      <span
                        style={{ color: "var(--color-gold)" }}
                        className="text-[10px] font-bold uppercase tracking-[0.4em]"
                      >
                        {event.type}
                      </span>
                      <h3 className="text-4xl font-serif">{event.venue}</h3>
                    </div>
                    <div
                      style={{ borderColor: "rgba(27, 60, 64, 0.05)" }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <div
                        style={{ color: "rgba(27, 60, 64, 0.6)" }}
                        className="flex items-center gap-4"
                      >
                        <CalendarDays size={18} />
                        <span className="text-sm font-medium">
                          {event.date}
                        </span>
                      </div>
                      <div
                        style={{ color: "rgba(27, 60, 64, 0.6)" }}
                        className="flex items-center gap-4"
                      >
                        <Clock size={18} />
                        <span className="text-sm font-medium">
                          {event.time}
                        </span>
                      </div>
                      <div
                        style={{ color: "rgba(27, 60, 64, 0.6)" }}
                        className="flex items-center gap-4"
                      >
                        <MapPin size={18} />
                        <span className="text-sm font-medium">{event.loc}</span>
                      </div>
                    </div>
                    <Button
                      style={{
                        backgroundColor: "var(--color-darkTeal)",
                        boxShadow: "0 10px 15px -3px rgba(27, 60, 64, 0.2)",
                      }}
                      className="w-full hover:bg-[#2A5257] text-white rounded-full h-14 tracking-[0.3em] text-[10px] font-bold transition-all duration-500"
                    >
                      GET DIRECTIONS
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-40 bg-[#F9F7F2] overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-12 gap-8 items-center mb-24"
          >
            <motion.div
              variants={slideInLeft}
              className="md:col-span-5 space-y-6"
            >
              <span
                style={{ color: "var(--color-gold)" }}
                className="text-[10px] font-bold uppercase tracking-[0.8em]"
              >
                Sea of Memories
              </span>
              <h2 className="text-5xl md:text-7xl font-serif">
                Capturing the <br /> Golden Hour
              </h2>
            </motion.div>
            <motion.div variants={slideInRight} className="md:col-span-7">
              <p
                style={{ color: "rgba(27, 60, 64, 0.6)" }}
                className="font-light italic text-lg leading-relaxed"
              >
                Each photo is a seashell we've collected along the shore of our
                love story—tiny treasures that tell the tale of our tides.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 auto-rows-[300px] md:auto-rows-[400px]"
          >
            <motion.div
              variants={fadeInScale}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="col-span-2 row-span-2 overflow-hidden rounded-[2.5rem] shadow-xl group"
            >
              <img
                src="/Image4.jpg"
                alt="Gallery 1"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              variants={fadeInScale}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="col-span-2 overflow-hidden rounded-[2.5rem] shadow-xl group"
            >
              <img
                src="/Image3.jpg"
                alt="Gallery 3"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              variants={fadeInScale}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="overflow-hidden rounded-[2.5rem] shadow-xl group"
            >
              <img
                src="/Image1.jpg"
                alt="Gallery 4"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              variants={fadeInScale}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="overflow-hidden rounded-[2.5rem] shadow-xl group"
            >
              <img
                src="/Image5.jpg"
                alt="Gallery 5"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              variants={fadeInScale}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="overflow-hidden rounded-[2.5rem] shadow-xl group"
            >
              <img
                src="/Image0.jpg"
                alt="Gallery 6"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              variants={fadeInScale}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="overflow-hidden rounded-[2.5rem] shadow-xl group"
            >
              <img
                src="/Image7.jpg"
                alt="Gallery 7"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              variants={fadeInScale}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="overflow-hidden rounded-[2.5rem] shadow-xl group"
            >
              <img
                src="/Image10.jpg"
                alt="Gallery 8"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              variants={fadeInScale}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="overflow-hidden rounded-[2.5rem] shadow-xl group"
            >
              <img
                src="/Image2.jpg"
                alt="Gallery 9"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How to Reach Section */}
      <section className="py-32 bg-[#F0F7F8] relative overflow-hidden">
        <div
          style={{ backgroundColor: "rgba(185, 226, 229, 0.1)" }}
          className="absolute top-0 left-0 w-80 h-80 rounded-full blur-[120px] -ml-40"
        />
        <div
          style={{ backgroundColor: "rgba(232, 162, 93, 0.1)" }}
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[100px] -mr-32"
        />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16 space-y-6"
          >
            <motion.span
              variants={fadeInUp}
              style={{ color: "var(--color-gold)" }}
              className="text-[10px] font-bold uppercase tracking-[0.8em]"
            >
              Travel Guide
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-serif"
            >
              Plan your Voyage
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              style={{ color: "rgba(27, 60, 64, 0.6)" }}
              className="text-lg font-light italic max-w-xl mx-auto"
            >
              Find your way to our celebration with these simple directions.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div
              variants={slideInLeft}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
              style={{
                borderColor: "rgba(27, 60, 64, 0.05)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 border hover:shadow-xl transition-shadow duration-500"
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  style={{ backgroundColor: "rgba(232, 162, 93, 0.1)" }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                >
                  <Bus size={28} style={{ color: "var(--color-gold)" }} />
                </div>
                <h3 className="text-3xl font-serif">By Bus</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    style={{ color: "var(--color-gold)" }}
                    className="mt-1 flex-shrink-0"
                  />
                  <div>
                    <p
                      style={{ color: "rgba(27, 60, 64, 0.8)" }}
                      className="text-sm font-bold uppercase tracking-wider"
                    >
                      Drop Point
                    </p>
                    <p style={{ color: "rgba(27, 60, 64, 0.7)" }}>
                      Bhavani Lakshmi Nagar Bypass
                    </p>
                  </div>
                </div>
                <div
                  style={{ backgroundColor: "var(--color-cream)" }}
                  className="rounded-2xl p-5 space-y-3"
                >
                  <p
                    style={{ color: "rgba(27, 60, 64, 0.7)" }}
                    className="text-[15px]"
                  >
                    From the Bypass, take a local bus to Bhavani Bus Stand
                  </p>
                </div>
                <Button
                  onClick={() =>
                    window.parent.postMessage(
                      {
                        type: "OPEN_EXTERNAL_URL",
                        data: {
                          url: "https://maps.google.com/?q=Bhavani+Lakshmi+Nagar+Bypass",
                        },
                      },
                      "*",
                    )
                  }
                  style={{ backgroundColor: "var(--color-darkTeal)" }}
                  className="w-full hover:bg-[#2A5257] text-white rounded-full h-12 tracking-[0.2em] text-[10px] font-bold transition-all duration-500"
                >
                  <MapPin size={14} className="mr-2" />
                  BHAVANI BYPASS
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
              style={{
                borderColor: "rgba(27, 60, 64, 0.05)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 border hover:shadow-xl transition-shadow duration-500"
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  style={{ backgroundColor: "rgba(185, 226, 229, 0.2)" }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                >
                  <Train size={28} style={{ color: "var(--color-darkTeal)" }} />
                </div>
                <h3 className="text-3xl font-serif">By Train</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    style={{ color: "var(--color-gold)" }}
                    className="mt-1 flex-shrink-0"
                  />
                  <div>
                    <p
                      style={{ color: "rgba(27, 60, 64, 0.8)" }}
                      className="text-sm font-bold uppercase tracking-wider"
                    >
                      Drop Point
                    </p>
                    <p style={{ color: "rgba(27, 60, 64, 0.7)" }}>
                      Erode Junction (ED)
                    </p>
                  </div>
                </div>
                <div
                  style={{ backgroundColor: "var(--color-cream)" }}
                  className="rounded-2xl p-5 space-y-3"
                >
                  <p
                    style={{ color: "rgba(27, 60, 64, 0.7)" }}
                    className="text-[15px]"
                  >
                    From Erode Junction, take a bus to Bhavani Bus Stand
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() =>
                      window.parent.postMessage(
                        {
                          type: "OPEN_EXTERNAL_URL",
                          data: {
                            url: "https://maps.google.com/?q=Erode+Junction+Railway+Station",
                          },
                        },
                        "*",
                      )
                    }
                    style={{ backgroundColor: "var(--color-darkTeal)" }}
                    className="w-full hover:bg-[#2A5257] text-white rounded-full h-12 tracking-[0.1em] text-[9px] font-bold transition-all duration-500"
                  >
                    <MapPin size={12} className="mr-1" />
                    ERODE STATION
                  </Button>
                  <Button
                    onClick={() =>
                      window.parent.postMessage(
                        {
                          type: "OPEN_EXTERNAL_URL",
                          data: {
                            url: "https://maps.google.com/?q=Bhavani+Bus+Stand",
                          },
                        },
                        "*",
                      )
                    }
                    style={{
                      backgroundColor: "var(--color-teal)",
                      color: "var(--color-darkTeal)",
                    }}
                    className="w-full hover:bg-[#A5D4D7] rounded-full h-12 tracking-[0.1em] text-[9px] font-bold transition-all duration-500"
                  >
                    <MapPin size={12} className="mr-1" />
                    BUS STAND
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Guestbook Section */}
      <section
        style={{ backgroundColor: "var(--color-cream)" }}
        className="py-40 relative overflow-hidden"
      >
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="sticky top-20 space-y-12"
            >
              <div className="space-y-6 relative">
                <span
                  style={{ color: "var(--color-gold)" }}
                  className="text-[10px] font-bold uppercase tracking-[0.8em]"
                >
                  Messages in the Tide
                </span>
                <h2 className="text-5xl md:text-7xl font-serif">
                  Leave a Ripple
                </h2>
                <p
                  style={{ color: "rgba(27, 60, 64, 0.6)" }}
                  className="text-lg font-light italic max-w-md"
                >
                  Your blessings are the wind in our sails. 
                  Send us a message to our new beginning.
                </p>
                <div className="relative w-full h-24 -mt-8 overflow-hidden pointer-events-none">
                  <motion.div
                    initial={{ x: "-20%" }}
                    animate={{
                      x: "120%",
                      y: [0, -3, 0],
                      rotate: [0, 1, -1, 0],
                    }}
                    transition={{
                      x: { duration: 35, repeat: Infinity, ease: "linear" },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      rotate: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="absolute top-0"
                  >
                    <WoodenBoat className="scale-[0.4] opacity-30" />
                  </motion.div>
                  <div
                    style={{
                      background:
                        "linear-gradient(to right, transparent 0%, rgba(185, 226, 229, 0.2) 50%, transparent 100%)",
                    }}
                    className="absolute bottom-8 left-0 right-0 h-px"
                  />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--color-cream)",
                  borderColor: "rgba(27, 60, 64, 0.05)",
                  boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.05)",
                }}
                className="p-10 rounded-[3rem] border space-y-8"
              >
                <div className="space-y-3">
                  <Label className={baseLabelClasses}>Voyager Name</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    className={baseInputClasses}
                  />
                </div>
                <div className="space-y-3">
                  <Label className={baseLabelClasses}>Sea Whisper</Label>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Whisper your message to the tides..."
                    className={baseTextareaClasses}
                  />
                </div>
                <BottleButton onClick={handleSendWish} disabled={isSending}>
                  {isSending ? "SENDING..." : "SEND TO SHORE"}
                </BottleButton>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {isLoading ? (
                <motion.div className="text-center py-8">
                  <p style={{ color: "rgba(27, 60, 64, 0.6)" }}>
                    Loading messages...
                  </p>
                </motion.div>
              ) : wishes.length === 0 ? (
                <motion.div className="text-center py-8">
                  <p
                    style={{ color: "rgba(27, 60, 64, 0.6)" }}
                    className="italic"
                  >
                    Be the first to leave a message!
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {wishes.map((wish, index) => (
                    <motion.div
                      key={wish.id}
                      layout
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{
                        y: -5,
                        transition: { type: "spring", stiffness: 300 },
                      }}
                      style={{ borderColor: "rgba(27, 60, 64, 0.05)" }}
                      className="p-10 bg-white rounded-[2.5rem] border shadow-sm hover:shadow-md transition-all duration-500 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                        <Shell size={64} />
                      </div>
                      <Quote
                        style={{ color: "var(--color-teal)" }}
                        className="mb-6"
                        size={24}
                      />
                      <p
                        style={{ color: "rgba(27, 60, 64, 0.8)" }}
                        className="text-xl font-serif italic leading-relaxed"
                      >
                        "{wish.message}"
                      </p>
                      <div
                        style={{ borderColor: "rgba(27, 60, 64, 0.05)" }}
                        className="mt-8 pt-8 border-t flex justify-between items-center"
                      >
                        <span className="font-serif text-xl tracking-tight">
                          {wish.name}
                        </span>
                        <span
                          style={{ color: "rgba(27, 60, 64, 0.3)" }}
                          className="text-[9px] uppercase tracking-[0.3em] font-bold"
                        >
                          {wish.date}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "var(--color-cream)",
          color: "var(--color-darkTeal)",
          borderColor: "rgba(27, 60, 64, 0.05)",
        }}
        className="py-12 relative border-t"
      >
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{
                fontFamily: "'Great Vibes', cursive",
                letterSpacing: "0.08em",
                color: "var(--color-darkTeal)",
              }}
              className="text-4xl md:text-4xl"
            >
              NaveeRitzz
            </motion.h2>

            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: "#7C3AED" }}
            >
              <Heart size={30} fill="currentColor" />
            </motion.div>
          </motion.div>
        </div>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Great+Vibes&display=swap");
        :root {
          --font-serif: "Cormorant Garamond", serif;
          --font-sans: "Montserrat", sans-serif;
          --font-accent: "Great Vibes", cursive;
          --color-cream: #fdfbf7;
          --color-gold: #e8a25d;
          --color-teal: #b9e2e5;
          --color-darkTeal: #1b3c40;
          --color-lightTeal: #2e8b57;
          --color-wood: #8b5e3c;
        }
        body {
          font-family: var(--font-sans);
          background-color: var(--color-cream);
          color: var(--color-darkTeal);
          scroll-behavior: smooth;
        }
        .font-serif {
          font-family: var(--font-serif);
        }
        .font-accent {
          font-family: var(--font-accent);
        }
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--color-cream);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--color-teal);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-gold);
        }
      `}</style>
    </div>
  );
}
