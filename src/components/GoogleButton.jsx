import React from "react";

const GoogleSvg = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.655 32.652 29.209 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.069 6.053 29.247 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.069 6.053 29.247 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.107 0 9.86-1.961 13.409-5.152l-6.19-5.238C29.172 35.091 26.701 36 24 36c-5.188 0-9.62-3.316-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.793 2.226-2.231 4.138-4.084 5.61l.003-.002 6.19 5.238C36.98 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

export const GoogleButton = ({ onClick, label = "Continue with Google", disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-800 rounded-md py-2 px-4 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <GoogleSvg />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

