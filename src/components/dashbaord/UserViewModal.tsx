import {
  X,
  Mail,
  Calendar,
  ShieldCheck,
  User,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import type { User as UserType } from "@/types/users";
import { defaultAvatar } from "@/assets";

type Props = {
  user: UserType | null;
  onClose: () => void;
};

export const UserViewModal = ({ user, onClose }: Props) => {
  if (!user) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
      >
        {/* HEADER */}
        <div className="relative h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
          >
            <X size={18} />
          </button>
        </div>

        {/* PROFILE */}
        <div className="relative px-6 pb-6 text-center">
          <img
            src={user.avatar?.url || defaultAvatar}
            alt={`${user.firstname} ${user.lastname}`}
            className="mx-auto -mt-14 h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
          />

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {user.firstname} {user.lastname}
          </h2>

          <p className="mx-auto mt-1 max-w-[260px] truncate text-sm text-gray-500">
            {user.email}
          </p>

          {/* ROLE */}
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {user.role === "admin" ? (
                <ShieldCheck size={14} />
              ) : (
                <User size={14} />
              )}
              {user.role}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-3 px-6 pb-6">
          <InfoCard
            label="Status"
            value={
              user.isBlocked ? (
                <span className="flex items-center gap-2 font-medium text-red-600">
                  <XCircle size={16} />
                  Blocked
                </span>
              ) : (
                <span className="flex items-center gap-2 font-medium text-emerald-600">
                  <CheckCircle size={16} />
                  Active
                </span>
              )
            }
          />

          <InfoCard
            label="Email"
            value={
              <span className="flex items-center gap-2 text-gray-700 truncate">
                <Mail size={15} />
                <span className="truncate">{user.email}</span>
              </span>
            }
          />

          <InfoCard
            label="Joined"
            value={
              <span className="flex items-center gap-2 text-gray-700">
                <Calendar size={15} />
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            }
          />
        </div>

        {/* ADDRESSES */}
        {user.addresses && user.addresses.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPin size={16} />
              Addresses
            </h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {user.addresses.map((addr, index) => (
                <div
                  key={addr._id || index}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 text-gray-700">
                      <p className="font-medium">{addr.street}</p>
                      <p>
                        {addr.city}, {addr.state}
                      </p>
                      <p>
                        {addr.country} - {addr.pincode}
                      </p>
                    </div>

                    {addr.isDefault && (
                      <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full whitespace-nowrap">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-200 py-3 text-sm font-medium text-slate-600 transition hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

type InfoCardProps = {
  label: string;
  value: React.ReactNode;
};

const InfoCard = ({ label, value }: InfoCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 transition hover:bg-gray-100">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <div className="max-w-[60%] text-sm">{value}</div>
    </div>
  );
};
