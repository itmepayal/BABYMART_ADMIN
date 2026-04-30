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
} from "lucide-react";

import { defaultAvatar } from "@/assets";
import { useUsers } from "@/hooks/users/useUsers";
import { toast } from "sonner";

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
      const payload = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        role: data.role,
        addresses: data.addresses.slice(0, 5),
        avatar: avatarFile || undefined,
      };

      await createUser(payload);

      toast.success("User created successfully", { id: toastId });

      reset();
      navigate("/dashboard/users");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <Header
        title="Create User"
        description="Create new users, manage permissions and profile details"
        icon={FiUsers}
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/users")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* LEFT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-8 space-y-6"
        >
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
            {/* PERSONAL INFO */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update basic user details like name and contact email.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* FIRST NAME */}
                <div>
                  <FormField
                    label="First Name"
                    icon={User}
                    placeholder="Enter first name"
                    {...register("firstname", { required: "Required" })}
                    error={errors.firstname?.message}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    This will be displayed as the user's given name.
                  </p>
                </div>

                {/* LAST NAME */}
                <div>
                  <FormField
                    label="Last Name"
                    icon={User}
                    placeholder="Enter last name"
                    {...register("lastname", { required: "Required" })}
                    error={errors.lastname?.message}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Helps identify the user uniquely in the system.
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="mt-5">
                <FormField
                  label="Email"
                  icon={Mail}
                  type="email"
                  placeholder="Enter email address"
                  {...register("email", { required: "Required" })}
                  error={errors.email?.message}
                />
                <p className="mt-2 text-xs text-slate-500">
                  This email will be used for login and notifications.
                </p>
              </div>
            </div>

            {/* SECURITY */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Security & Access
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Configure password and assign user role permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Password */}
                <div>
                  <FormPasswordField
                    label="Password"
                    icon={Lock}
                    placeholder="Enter secure password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    error={errors.password?.message}
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Use strong password with letters, numbers & symbols.
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="text-xs font-medium text-gray-500 pl-1">
                    Role
                  </label>
                  <select
                    {...register("role")}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="deliveryMan">Delivery Man</option>
                  </select>

                  <p className="mt-2 text-xs text-slate-500">
                    Defines access permissions inside dashboard.
                  </p>
                </div>
              </div>
            </div>
            {/* ADDRESSES */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              {/* HEADER */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Addresses
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage user delivery addresses. You can add multiple
                    locations and mark one as default.
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
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm text-white shadow-lg transition hover:shadow-xl"
                >
                  <Plus size={16} />
                  Add Address
                </button>
              </div>

              {/* ADDRESS LIST */}
              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    {/* TOP BAR */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                          Address {index + 1}
                        </span>

                        {watch(`addresses.${index}.isDefault`) && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            Default
                          </span>
                        )}
                      </div>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* FORM */}
                    <div className="space-y-4">
                      {/* STREET */}
                      <div>
                        <FormField
                          label="Street"
                          placeholder="Enter street address"
                          {...register(`addresses.${index}.street`)}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Include house number, area, or landmark.
                        </p>
                      </div>

                      {/* CITY + STATE */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <FormField
                            label="City"
                            placeholder="Enter city"
                            {...register(`addresses.${index}.city`)}
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            City where delivery will be made.
                          </p>
                        </div>

                        <div>
                          <FormField
                            label="State"
                            placeholder="Enter state"
                            {...register(`addresses.${index}.state`)}
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            State or region of the address.
                          </p>
                        </div>
                      </div>

                      {/* COUNTRY + PINCODE */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <FormField
                            label="Country"
                            placeholder="Enter country"
                            {...register(`addresses.${index}.country`)}
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            Country of residence.
                          </p>
                        </div>

                        <div>
                          <FormField
                            label="Pincode"
                            placeholder="Enter postal code"
                            {...register(`addresses.${index}.pincode`)}
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            Ensure correct postal/ZIP code for delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <button
                type="button"
                onClick={() => navigate("/dashboard/users")}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 text-sm rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-3 text-white shadow-lg"
              >
                <Save size={16} />
                {saving ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* RIGHT SIDEBAR */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-4 space-y-6"
        >
          {/* PROFILE */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-36 bg-gradient-to-r from-emerald-500 to-cyan-500" />

            <div className="px-6 pb-8">
              <div className="-mt-16 flex flex-col items-center">
                <div className="group relative">
                  <img
                    src={avatarPreview || defaultAvatar}
                    alt="avatar"
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                  />

                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                    <Upload className="text-white" size={18} />
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  {watch("firstname") || "New"} {watch("lastname") || "User"}
                </h3>

                <p className="text-sm text-slate-500">
                  {watch("email") || "email@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm capitalize">
            <h3 className="mb-4 font-semibold">Summary</h3>

            <div className="space-y-3 text-sm">
              {/* ROLE */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                <Shield size={16} className="text-emerald-600" />
                <span>
                  Role: <span className="font-medium">{watch("role")}</span>
                </span>
              </div>

              {/* ADDRESSES */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                <MapPin size={16} className="text-blue-600" />
                <span>
                  Addresses:{" "}
                  <span className="font-medium">{fields.length}</span>
                </span>
              </div>

              {/* AVATAR */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                <Upload
                  size={16}
                  className={avatarFile ? "text-emerald-600" : "text-gray-400"}
                />
                <span>
                  Avatar:{" "}
                  <span className="font-medium">
                    {avatarFile ? "Uploaded" : "Pending"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateUser;
