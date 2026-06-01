import { getInitials } from "../utils/initials";

type UserAvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-3xl",
};

export default function UserAvatar({ name, size = "lg" }: UserAvatarProps) {
  return (
    <div
      aria-hidden
      className={[
        "flex shrink-0 items-center justify-center rounded-full",
        "bg-linear-to-br from-indigo-600 to-purple-600 font-semibold text-white shadow-md",
        sizeClasses[size],
      ].join(" ")}
    >
      {getInitials(name)}
    </div>
  );
}
