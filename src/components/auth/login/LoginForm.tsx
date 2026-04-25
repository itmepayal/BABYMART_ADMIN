import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/useLogin";
import { loginSchema, type LoginCredentials } from "@/schemas/auth.schema";
import { FormField } from "@/components/form/FormInput";
import { FormPasswordField } from "@/components/form/FormPassword";

export const LoginForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { handleLogin, loading, error } = useLogin();
  const onSubmit = async (payload: LoginCredentials) => {
    try {
      await handleLogin(payload);
      reset();
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}
        <FormField
          label="Email"
          type="email"
          placeholder="baby@example.com"
          icon={Mail}
          {...register("email")}
          error={errors.email?.message}
        />
        <FormPasswordField
          label="Password"
          icon={Lock}
          {...register("password")}
          error={errors.password?.message}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition"
            />
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition">
              Remember me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 
        text-white font-semibold shadow-lg shadow-emerald-200/40 hover:shadow-xl transition disabled:opacity-60"
        >
          {isSubmitting || loading ? "Signing in..." : "Sign In"}
        </motion.button>
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <p className="text-center text-sm text-gray-500">
          New here?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-medium hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </>
  );
};
