import { motion } from "framer-motion";
import { LoginForm } from "./LoginForm";

export const LoginRight = () => {
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="p-10 md:p-14 flex flex-col justify-center"
    >
      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome Back 👋
        </h2>

        <p className="text-sm text-gray-500">
          Sign in to continue shopping with Baby Mart
        </p>
      </div>

      <LoginForm />
    </motion.div>
  );
};
