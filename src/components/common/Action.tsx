import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Eye, Loader2, RefreshCw } from "lucide-react";

type BaseProps = {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const isDisabled = (loading?: boolean, disabled?: boolean) =>
  loading || disabled;

const baseStyles = `
flex items-center justify-center
rounded-xl h-10 w-10
transition-all duration-200
active:scale-95
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
`;

const getStateStyles = (disabled?: boolean) =>
  disabled
    ? "opacity-60 cursor-not-allowed"
    : "hover:scale-[1.05] cursor-pointer";

/* ---------------- DELETE ---------------- */
export const DeleteButton = ({ onClick, loading, disabled }: BaseProps) => {
  const disabledState = isDisabled(loading, disabled);

  return (
    <Button
      aria-label="Delete"
      title="Delete"
      variant="outline"
      onClick={onClick}
      disabled={disabledState}
      className={`${baseStyles}
      border-red-200 text-red-500
      bg-white/50 backdrop-blur-md
      hover:bg-red-50 hover:text-red-600 hover:border-red-300
      focus-visible:ring-red-300
      ${getStateStyles(disabledState)}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
};

/* ---------------- EDIT ---------------- */
export const EditButton = ({ onClick, loading, disabled }: BaseProps) => {
  const disabledState = isDisabled(loading, disabled);

  return (
    <Button
      aria-label="Edit"
      title="Edit"
      variant="outline"
      onClick={onClick}
      disabled={disabledState}
      className={`${baseStyles}
      border-emerald-200 text-emerald-600
      bg-white/50 backdrop-blur-md
      hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300
      focus-visible:ring-emerald-300
      ${getStateStyles(disabledState)}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Pencil className="w-4 h-4" />
      )}
    </Button>
  );
};

/* ---------------- VIEW ---------------- */
export const ViewButton = ({ onClick, loading, disabled }: BaseProps) => {
  const disabledState = isDisabled(loading, disabled);

  return (
    <Button
      aria-label="View"
      title="View"
      variant="outline"
      onClick={onClick}
      disabled={disabledState}
      className={`${baseStyles}
      border-cyan-200 text-cyan-600
      bg-white/50 backdrop-blur-md
      hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300
      focus-visible:ring-cyan-300
      ${getStateStyles(disabledState)}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </Button>
  );
};

/* ---------------- CANCEL ---------------- */
export const CancelButton = ({ onClick, disabled }: BaseProps) => {
  const disabledState = isDisabled(false, disabled);

  return (
    <Button
      onClick={onClick}
      disabled={disabledState}
      variant="ghost"
      className={`
      px-5 py-2 rounded-xl font-medium
      bg-white/40 backdrop-blur-md
      border border-gray-200
      text-gray-600
      transition-all duration-200 active:scale-95
      hover:bg-white/70 hover:text-gray-800
      focus-visible:ring-gray-300
      ${getStateStyles(disabledState)}
      `}
    >
      Cancel
    </Button>
  );
};

/* ---------------- SAVE ---------------- */
export const SaveButton = ({ onClick, loading, disabled }: BaseProps) => {
  const disabledState = isDisabled(loading, disabled);

  return (
    <Button
      onClick={onClick}
      disabled={disabledState}
      className={`
      flex items-center gap-2
      px-6 py-2 rounded-xl font-semibold
      bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600
      text-white
      shadow-md hover:shadow-lg
      transition-all duration-300
      active:scale-95
      hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700
      focus-visible:ring-emerald-300
      ${getStateStyles(disabledState)}
      `}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      Save
    </Button>
  );
};

/* ---------------- REFRESH ---------------- */
export const RefreshButton = ({ onClick, loading, disabled }: BaseProps) => {
  const disabledState = isDisabled(loading, disabled);

  return (
    <Button
      onClick={onClick}
      disabled={disabledState}
      variant="outline"
      className={`
      group flex items-center gap-2 px-4 py-2.5 rounded-xl
      border-gray-200 bg-white text-gray-700
      hover:bg-gray-50 hover:border-gray-300
      transition-all duration-200 active:scale-95
      ${getStateStyles(disabledState)}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
      )}
      <span className="text-sm font-medium">
        {loading ? "Refreshing..." : "Refresh"}
      </span>
    </Button>
  );
};
