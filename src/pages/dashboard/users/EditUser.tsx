import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";

import { FiUsers, FiRefreshCw } from "react-icons/fi";
import {
  ArrowLeft,
  Upload,
  Trash2,
  User,
  Shield,
  Lock,
  Plus,
  MapPin,
  Save,
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
  role: string;
  isBlocked: boolean;
  addresses: Address[];
};

const defaultAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  isDefault: true,
};

const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { changeAvatarUser, getUserById, selectedUser, updateUser } =
    useUsers();

  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      role: "user",
      isBlocked: false,
      addresses: [defaultAddress],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  useEffect(() => {
    if (userId) getUserById(userId);
  }, [userId]);

  useEffect(() => {
    if (!selectedUser) return;

    reset({
      firstname: selectedUser.firstname,
      lastname: selectedUser.lastname,
      role: selectedUser.role,
      isBlocked: selectedUser.isBlocked,
      addresses:
        selectedUser.addresses?.length > 0
          ? selectedUser.addresses
          : [defaultAddress],
    });

    setAvatarPreview(selectedUser.avatar?.url || "");
  }, [selectedUser, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!userId) return;

    setLoading(true);
    const id = toast.loading("Updating user...");

    try {
      await updateUser(userId, data);
      toast.success("User updated successfully", { id });
      navigate("/dashboard/users");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed", {
        id,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setAvatarPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    const id = toast.loading("Uploading avatar...");

    try {
      await changeAvatarUser(formData, userId);
      toast.success("Avatar updated", { id });
    } catch {
      toast.error("Upload failed", { id });
    }
  };

  return (
    <div className="min-h-screen text-sm">
      <Header
        title="Edit User"
        description="Manage user information and account settings"
        icon={FiUsers}
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/users")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 xl:col-span-8"
          >
            {/* PERSONAL */}
            <div className={cardStyle}>
              {/* HEADER */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage the user's identity details used across the platform.
                </p>
              </div>

              {/* FORM */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* FIRST NAME */}
                <div>
                  <FormField
                    label="First Name"
                    icon={User}
                    {...register("firstname", { required: "Required" })}
                    error={errors.firstname?.message}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Enter the user's first name as it should appear across the
                    platform.
                  </p>
                </div>

                {/* LAST NAME */}
                <div>
                  <FormField
                    label="Last Name"
                    icon={User}
                    {...register("lastname", { required: "Required" })}
                    error={errors.lastname?.message}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Enter the user's last name for proper identification and
                    records.
                  </p>
                </div>
              </div>
            </div>

            {/* ROLE */}
            <div className={cardStyle}>
              <h2 className="mb-2 text-lg font-semibold">Role Management</h2>

              <p className="mb-4 text-sm text-slate-500">
                Select the user role to define system permissions and access
                level.
              </p>

              <select
                {...register("role")}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="deliveryMan">Delivery Man</option>
              </select>

              <p className="mt-2 text-xs text-slate-500">
                Admin role has full system access. Assign carefully.
              </p>
            </div>

            {/* STATUS */}
            <div className={cardStyle}>
              {/* HEADER */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Account Status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Control whether this user can access the platform.
                </p>
              </div>

              {/* TOGGLE */}
              <Controller
                name="isBlocked"
                control={control}
                render={({ field }) => (
                  <div>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`flex h-14 w-full items-center justify-between rounded-2xl border px-5 text-sm font-medium transition ${
                        field.value
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <span>{field.value ? "Blocked" : "Active"}</span>

                      {/* SWITCH UI */}
                      <div
                        className={`h-6 w-11 rounded-full p-1 ${
                          field.value ? "bg-red-500" : "bg-emerald-500"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full bg-white transition ${
                            field.value ? "ml-auto" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* MESSAGE */}
                    <p className="mt-2 text-xs text-slate-500">
                      {field.value
                        ? "Blocked users cannot log in or perform any actions."
                        : "Active users can access and use the platform normally."}
                    </p>
                  </div>
                )}
              />
            </div>

            {/* ADDRESS */}
            <div className={cardStyle}>
              {/* HEADER */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Addresses
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage user delivery locations and contact details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => append(defaultAddress)}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500 px-4 py-2 font-medium text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
                >
                  <Plus size={16} />
                  Add Address
                </button>
              </div>

              {/* ADDRESS LIST */}
              <div className="space-y-5">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    {/* TOP BAR */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Address {index + 1}
                      </span>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* FORM */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* STREET */}
                      <div className="md:col-span-2">
                        <FormField
                          label="Street"
                          {...register(`addresses.${index}.street`)}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Enter house number, building, and street name.
                        </p>
                      </div>

                      {/* CITY */}
                      <div>
                        <FormField
                          label="City"
                          {...register(`addresses.${index}.city`)}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          City where the address is located.
                        </p>
                      </div>

                      {/* STATE */}
                      <div>
                        <FormField
                          label="State"
                          {...register(`addresses.${index}.state`)}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          State or region for this address.
                        </p>
                      </div>

                      {/* COUNTRY */}
                      <div>
                        <FormField
                          label="Country"
                          {...register(`addresses.${index}.country`)}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Country of the delivery location.
                        </p>
                      </div>

                      {/* PINCODE */}
                      <div>
                        <FormField
                          label="Pincode"
                          {...register(`addresses.${index}.pincode`)}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Postal code used for delivery and verification.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOT NOTE */}
              <p className="mt-4 text-xs text-slate-500">
                Ensure address details are accurate to avoid delivery or service
                issues.
              </p>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-4 capitalize"
          >
            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-8 text-center text-white">
                <label className="group relative mx-auto block w-fit cursor-pointer">
                  <img
                    src={avatarPreview || defaultAvatar}
                    alt="avatar"
                    className="h-28 w-28 rounded-full border-4 border-white object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                    <Upload size={18} />
                  </div>

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>

                <h3 className="mt-4 text-xl font-bold">
                  {watch("firstname")} {watch("lastname")}
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  {selectedUser?.email}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <Shield size={16} className="mr-2 inline" />
                  {watch("role")}
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <Lock size={16} className="mr-2 inline" />
                  {watch("isBlocked") ? "Blocked" : "Active"}
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <MapPin size={16} className="mr-2 inline" />
                  {fields.length} Addresses
                </div>
              </div>

              {/* SINGLE SAVE BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
