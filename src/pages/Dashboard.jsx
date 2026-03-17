import React, { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700">
    {children}
  </span>
);

const Dashboard = () => {
  const { user, logout, setPassword, changePassword } = useAuth();
  const methods = user?.authMethods || [];
  const hasPassword = methods.includes("password");
  const hasGoogle = methods.includes("google");

  const [mode, setMode] = useState(null); // "set" | "change" | null
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const displayName = useMemo(() => user?.name || user?.email || "User", [user]);

  const submit = async () => {
    try {
      setSaving(true);
      setError(null);
      if (mode === "set") {
        await setPassword(form.password, form.confirmPassword);
        setMode(null);
        setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
      } else if (mode === "change") {
        await changePassword(form.currentPassword, form.newPassword);
        setMode(null);
        setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="h-12 w-12 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200" />
            )}
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome, {displayName}
              </h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              Logout
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Auth methods</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>{hasGoogle ? "Google connected" : "Google not connected"}</Badge>
              <Badge>{hasPassword ? "Password set" : "Password not set"}</Badge>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!hasPassword ? (
              <button
                onClick={() => setMode("set")}
                className="rounded-md bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-95"
              >
                Set Password
              </button>
            ) : (
              <button
                onClick={() => setMode("change")}
                className="rounded-md bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-95"
              >
                Change Password
              </button>
            )}
          </div>

          {mode ? (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-800">
                {mode === "set" ? "Set a password" : "Change your password"}
              </h3>

              {error ? (
                <div className="mt-3 border border-red-300 bg-red-50 text-red-700 rounded-md p-3 text-sm">
                  {error}
                </div>
              ) : null}

              <div className="mt-4 grid gap-4">
                {mode === "set" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, password: e.target.value }))
                        }
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm password
                      </label>
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                        }
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current password
                      </label>
                      <input
                        type="password"
                        value={form.currentPassword}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, currentPassword: e.target.value }))
                        }
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New password
                      </label>
                      <input
                        type="password"
                        value={form.newPassword}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, newPassword: e.target.value }))
                        }
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={submit}
                  disabled={saving}
                  className="rounded-md bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-95 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setMode(null);
                    setError(null);
                  }}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

