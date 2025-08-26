// src/pages/AdminLogin.tsx
import React, { useState } from "react";

type Props = {
  onSubmit?: (payload: { email: string; secretKey: string }) => Promise<void> | void;
  // If you have a reset route, pass it in; otherwise it stays as "#"
  resetLinkHref?: string;
  // Optional illustration URL (SVG/PNG). You can keep a local asset: /assets/admin-illustration.svg
  illustrationSrc?: string;
};

export default function AdminLogin({
  onSubmit,
  resetLinkHref = "#",
  illustrationSrc = "/assets/illustration.svg",
}: Props) {
  const [email, setEmail] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; secretKey?: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const emailError =
    touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email" : "";
  const secretError = touched.secretKey && !secretKey ? "Secret key is required" : "";

  const canSubmit = !emailError && !secretError && email && secretKey && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, secretKey: true });
    setError(null);

    if (!canSubmit) return;

    try {
      setLoading(true);
      await onSubmit?.({ email, secretKey });
    } catch (err: any) {
      setError(err?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center min-h-screen w-full overflow-hidden bg-white">
      {/* Corner blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-90 w-90 rounded-full bg-[#0505CE]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-90 w-90 rounded-full bg-[#6E66FF] opacity-70" />

      {/* Center card */}
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-10 md:py-16">

        <div className="mx-auto w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Left panel (dark) */}
            <div className="relative flex items-center justify-center bg-[#0B0B0E] px-8 py-12 md:px-10 md:py-14">
              <div className="w-full max-w-md text-white">
                <div className="mb-8">
                  <p className="text-2xl font-semibold tracking-wide">Karnue</p>
                </div>
                <h1 className="mb-8 text-4xl font-extrabold leading-tight md:text-5xl">
                  Welcome back
                </h1>

                <div className="mt-6 flex w-full items-center justify-center">
                  {illustrationSrc ? (
                    // Replace with your actual art; this container keeps the proportions like the mock
                    <img
                      src='/assets/admin-illustration.svg'
                      alt="Admin working at desk"
                      className="h-64 w-auto select-none"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-64 w-full rounded-xl bg-[#0F0F14] ring-1 ring-white/10" />
                  )}
                </div>
              </div>
            </div>

            {/* Right panel (form) */}
            <div className="flex items-center justify-center bg-gray-50 px-6 py-10 md:px-10 md:py-14">
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">Admin Access Page</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    To access this Dashboard please enter information needed below.
                  </p>
                </div>

                <div className="mt-8 space-y-5">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-800">
                      Email*
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      className={`w-full rounded-md border bg-white px-4 py-3 text-gray-900 outline-none transition focus:ring-4
                        ${emailError ? "border-red-500 ring-red-100" : "border-gray-300 focus:border-[#0505CE] focus:ring-[#0505CE]/15"}`}
                      placeholder="admin@example.com"
                    />
                    {emailError ? (
                      <p className="mt-1 text-sm text-red-600">{emailError}</p>
                    ) : null}
                  </div>

                  {/* Secret Key */}
                  <div>
                    <label
                      htmlFor="secret"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Secret Key*
                    </label>
                    <input
                      id="secret"
                      type="password"
                      autoComplete="current-password"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, secretKey: true }))}
                      className={`w-full rounded-md border bg-white px-4 py-3 text-gray-900 outline-none transition focus:ring-4
                        ${secretError ? "border-red-500 ring-red-100" : "border-gray-300 focus:border-[#0505CE] focus:ring-[#0505CE]/15"}`}
                      placeholder="••••••••••"
                    />
                    {secretError ? (
                      <p className="mt-1 text-sm text-red-600">{secretError}</p>
                    ) : null}
                  </div>

                  <div className="pt-1">
                    <a
                      href={resetLinkHref}
                      className="text-sm font-medium text-[#0505CE] hover:underline"
                    >
                      Reset Secret key, if forgotten
                    </a>
                  </div>

                  {error ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`mt-2 w-full rounded-md px-4 py-3 text-center text-base font-semibold text-white transition
                      ${canSubmit ? "bg-[#0505CE] hover:opacity-95 focus:ring-4 focus:ring-[#0505CE]/30" : "cursor-not-allowed bg-[#0505CE]/60"}`}
                    aria-busy={loading}
                  >
                    {loading ? "Confirming..." : "Confirm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
