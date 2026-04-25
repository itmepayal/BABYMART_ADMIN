import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useRegister } from "@/hooks/useRegister";
import { Mail, Lock, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { FormField } from "@/components/form/FormInput";
import { FormPasswordField } from "@/components/form/FormPassword";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  registerSchema,
  type RegisterCredentials,
} from "@/schemas/auth.schema";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
      terms: false,
    },
  });
  const navigate = useNavigate();
  const { handleRegister, loading, error } = useRegister();

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      const payload = {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
        role: data.role,
      };
      await handleRegister(payload);
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={container}
      className="space-y-6"
    >
      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}
      {/* NAME */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <FormField
          label="First Name"
          icon={User}
          placeholder="John"
          {...register("firstname")}
          error={errors.firstname?.message}
        />
        <FormField
          label="Last Name"
          icon={User}
          placeholder="Doe"
          {...register("lastname")}
          error={errors.lastname?.message}
        />
      </motion.div>

      {/* EMAIL */}
      <motion.div variants={item}>
        <FormField
          label="Email"
          icon={Mail}
          type="email"
          placeholder="john@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
      </motion.div>

      {/* PASSWORD */}
      <motion.div variants={item}>
        <FormPasswordField
          label="Password"
          icon={Lock}
          placeholder="********"
          {...register("password")}
          error={errors.password?.message}
        />
      </motion.div>

      {/* CONFIRM PASSWORD */}
      <motion.div variants={item}>
        <FormPasswordField
          label="Confirm Password"
          icon={Lock}
          placeholder="********"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </motion.div>

      {/* ROLE (FIXED WITH CONTROLLER) */}
      <motion.div variants={item}>
        <label className="text-xs font-medium text-gray-500 pl-1">
          Select Role
        </label>

        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition">
                <SelectValue placeholder="Choose role" />
              </SelectTrigger>

              <SelectContent className="rounded-xl border border-gray-100 shadow-xl">
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="deliveryMan">Delivery Man</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </motion.div>

      {/* TERMS */}
      <motion.label
        variants={item}
        className="flex items-start gap-2 text-xs text-gray-500"
      >
        <input
          type="checkbox"
          {...register("terms")}
          className="mt-1 accent-emerald-600"
        />
        <span>I agree to Terms & Privacy Policy</span>
      </motion.label>

      {/* BUTTON */}
      <motion.button
        variants={item}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isSubmitting || loading}
        className="w-full py-3 rounded-xl font-semibold text-white
        bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600
        shadow-lg shadow-emerald-200/40 hover:shadow-xl transition"
      >
        {isSubmitting || loading ? "Creating..." : "Create Account"}
      </motion.button>

      {/* LOGIN */}
      <motion.p variants={item} className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-emerald-600 font-medium hover:underline"
        >
          Sign in
        </Link>
      </motion.p>
    </motion.form>
  );
};
