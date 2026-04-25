import { motion } from "framer-motion";
import { RegisterForm } from "@/components/auth/register/RegisterForm";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      {/* CARD */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-8"
      >
        {/* HEADER */}
        <motion.div variants={item} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join{" "}
            <span className="text-emerald-600 font-semibold">Baby Mart 👶</span>
          </p>
        </motion.div>
        <RegisterForm />
      </motion.div>
    </div>
  );
};

export default Register;
