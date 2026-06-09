import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";
import { FormPasswordField } from "@/components/form/FormPassword";

import { FiUsers, FiRefreshCw } from "react-icons/fi";

import {
  ArrowLeft,
  Upload,
  Trash2,
  User,
  Save,
  Mail,
  Lock,
  MapPin,
  Shield,
  Plus,
  Home,
  Sparkles,
  CheckCircle2,
  Camera,
} from "lucide-react";

import { defaultAvatar } from "@/assets";
import { useUsers } from "@/hooks/users/useUsers";
import { toast } from "sonner";
import { SaveButton } from "@/components/common/Action";

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault?: boolean;
};

type FormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  addresses: Address[];
};

const cardStyle =
  "rounded-[28px] border border-slate-200/70 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl";

const CreateUser = () => {
  const navigate = useNavigate();
  const { createUser } = useUsers();

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      role: "user",
      addresses: [
        {
          street: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          isDefault: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCreate = async (data: FormValues) => {
    setSaving(true);

    const toastId = toast.loading("Creating user...");

    try {
      await createUser({
        ...data,
        addresses: data.addresses.slice(0, 5),
        avatar: avatarFile || undefined,
      });

      toast.success("User created successfully", {
        id: toastId,
      });

      reset();

      navigate("/dashboard/users");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create user", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ================= HEADER ================= */}
      <Header
        title="Create User"
        description="Create and manage professional user accounts"
        icon={FiUsers}
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/users")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      {/* ================= BODY ================= */}
      <div className="grid gap-6 xl:grid-cols-12">
        {/* ================= LEFT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 xl:col-span-8"
        >
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
            {/* ================= PERSONAL INFO ================= */}
            <div className={cardStyle}>
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <User className="text-emerald-600" size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add user basic profile details and contact information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="First Name"
                  icon={User}
                  placeholder="Enter first name"
                  {...register("firstname", {
                    required: "First name is required",
                  })}
                  error={errors.firstname?.message}
                />

                <FormField
                  label="Last Name"
                  icon={User}
                  placeholder="Enter last name"
                  {...register("lastname", {
                    required: "Last name is required",
                  })}
                  error={errors.lastname?.message}
                />
              </div>

              <div className="mt-5">
                <FormField
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  placeholder="Enter email address"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  error={errors.email?.message}
                />
              </div>
            </div>

            {/* ================= SECURITY ================= */}
            <div className={cardStyle}>
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-2xl bg-blue-50 p-3">
                  <Shield className="text-blue-600" size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Security & Permissions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure login credentials and access permissions.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FormPasswordField
                  label="Password"
                  icon={Lock}
                  placeholder="Enter secure password"
                  {...register("password", {
                    required: "Password required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters required",
                    },
                  })}
                  error={errors.password?.message}
                />

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600">
                    User Role
                  </label>

                  <select
                    {...register("role")}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="deliveryMan">Delivery Man</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ================= ADDRESSES ================= */}
            <div className={cardStyle}>
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    User Addresses
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage delivery and billing addresses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    append({
                      street: "",
                      city: "",
                      state: "",
                      country: "",
                      pincode: "",
                      isDefault: false,
                    })
                  }
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-5">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                  >
                    {/* TOP */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white p-2 shadow-sm">
                          <Home size={18} className="text-emerald-600" />
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-800">
                            Address {index + 1}
                          </h4>

                          <p className="text-xs text-slate-500">
                            User location information
                          </p>
                        </div>
                      </div>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* FORM */}
                    <div className="space-y-4">
                      <FormField
                        label="Street Address"
                        placeholder="Enter street address"
                        {...register(`addresses.${index}.street`)}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          label="City"
                          placeholder="Enter city"
                          {...register(`addresses.${index}.city`)}
                        />

                        <FormField
                          label="State"
                          placeholder="Enter state"
                          {...register(`addresses.${index}.state`)}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          label="Country"
                          placeholder="Enter country"
                          {...register(`addresses.${index}.country`)}
                        />

                        <FormField
                          label="Pincode"
                          placeholder="Enter postal code"
                          {...register(`addresses.${index}.pincode`)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="flex items-center justify-end rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="w-auto">
                <SaveButton
                  loading={saving}
                  icon={<Save size={18} />}
                  label="Create User"
                />
              </div>
            </div>
          </form>
        </motion.div>

        {/* ================= RIGHT ================= */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-4"
        >
          <div className="sticky top-24 space-y-6">
            {/* ================= PROFILE CARD ================= */}
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-100">
              {/* COVER */}
              <div className="relative h-36 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
                <div className="absolute right-5 top-5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  Draft Profile
                </div>
              </div>

              {/* CONTENT */}
              <div className="-mt-16 px-6 pb-8">
                <div className="flex flex-col items-center">
                  {/* AVATAR */}
                  <div className="group relative">
                    <img
                      src={avatarPreview || defaultAvatar}
                      alt="avatar"
                      className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-2xl"
                    />

                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <div className="flex flex-col items-center gap-1">
                        <Camera size={20} className="text-white" />

                        <span className="text-xs text-white">Upload</span>
                      </div>

                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>

                  {/* USER INFO */}
                  <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    {watch("firstname") || "New"} {watch("lastname") || "User"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {watch("email") || "email@example.com"}
                  </p>

                  <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={16} />
                    Active Account
                  </div>
                </div>
              </div>
            </div>

            {/* ================= SUMMARY ================= */}
            <div className={cardStyle}>
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-purple-50 p-3">
                  <Sparkles size={20} className="text-purple-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Account Summary
                  </h3>

                  <p className="text-xs text-slate-500">
                    Real-time user overview
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* ROLE */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-emerald-600" />

                    <span className="text-sm font-medium text-slate-700">
                      Role
                    </span>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                    {watch("role")}
                  </span>
                </div>

                {/* ADDRESS */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-blue-600" />

                    <span className="text-sm font-medium text-slate-700">
                      Addresses
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {fields.length}
                  </span>
                </div>

                {/* AVATAR */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Upload
                      size={18}
                      className={
                        avatarFile ? "text-emerald-600" : "text-slate-400"
                      }
                    />

                    <span className="text-sm font-medium text-slate-700">
                      Avatar
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      avatarFile
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {avatarFile ? "Uploaded" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateUser;
