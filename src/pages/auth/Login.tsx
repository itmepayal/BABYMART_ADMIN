import { motion } from "framer-motion";
import { LoginRight } from "@/components/auth/login/LoginRight";
import { LoginLeft } from "@/components/auth/login/LoginLeft";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50">
      {/* BACKGROUND BLUR BLOBS */}
      <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl top-[-250px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl bottom-[-250px] right-[-200px]" />

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl grid md:grid-cols-2 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* LEFT PANEL */}
        <LoginLeft />

        {/* RIGHT PANEL */}
        <LoginRight />
      </motion.div>
    </div>
  );
}
