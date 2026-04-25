import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  Users,
  Star,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";

export const LoginLeft = () => {
  const text = "Baby Mart 👶";
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="hidden md:flex flex-col justify-between px-12 py-12 text-white relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700"
    >
      {/* 🌫 Background Glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[600px] h-[600px] bg-cyan-300/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.25),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="space-y-12">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 text-[11px] px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-lg tracking-wide">
            🧸 Trusted Baby Care Platform
          </span>

          {/* Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight leading-[1.1]">
              {display}
              <span className="animate-pulse">|</span>
            </h1>

            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              A premium shopping experience crafted for modern parents —
              delivering safe, certified and thoughtfully curated baby
              essentials with speed and reliability.
            </p>
          </div>

          {/* Features */}
          <motion.div
            className="flex flex-wrap gap-2 text-xs text-white/90"
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {[
              { icon: CheckCircle2, text: "Certified Products" },
              { icon: Truck, text: "Fast Delivery" },
              { icon: ShieldCheck, text: "Trusted Platform" },
              { icon: Sparkles, text: "Premium Quality" },
            ].map(({ icon: Icon, text }) => (
              <motion.span
                key={text}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0 },
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/20 transition"
              >
                <Icon size={13} />
                {text}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-3 gap-4 mt-10"
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            { icon: Users, value: "10K+", label: "Parents" },
            { icon: Star, value: "4.8★", label: "Rating" },
            { icon: Clock, value: "24H", label: "Delivery" },
          ].map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              className="bg-white/10 border border-white/15 backdrop-blur-xl rounded-2xl p-4 hover:bg-white/15 transition"
            >
              <Icon size={16} className="mb-2 text-white/80" />
              <div className="text-2xl font-semibold tracking-tight">
                {value}
              </div>
              <div className="text-[11px] text-white/70 mt-1 tracking-wide">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
