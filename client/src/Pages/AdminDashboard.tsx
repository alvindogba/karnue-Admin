import {
  Car,
  RefreshCw,
  Receipt,
  ShieldCheck,
  BadgeCheck,
  Users,
  CreditCard,
} from "lucide-react";

/** Utility */
function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Accent */
const ACCENT = "#0505CE";


/** Stat cards (top row) */
const stats = [
  { icon: <Car className="h-5 w-5" />, label: "Total Bookings Today", value: "1,867" },
  { icon: <BadgeCheck className="h-5 w-5" />, label: "Active Rides", value: "89" },
  { icon: <Receipt className="h-5 w-5" />, label: "Pending Requests", value: "34" },
  { icon: <CreditCard className="h-5 w-5" />, label: "Total Revenue", value: "$1,867" },
  { icon: <ShieldCheck className="h-5 w-5" />, label: "Driver Payouts", value: "$9,867" },
  { icon: <Users className="h-5 w-5" />, label: "Active Drivers Today", value: "50/100" },
  { icon: <Users className="h-5 w-5" />, label: "Total Bookings Today", value: "234" },
  { icon: <Car className="h-5 w-5" />, label: "Issue Raised", value: "23" },
];

/** Quick actions */
const actions = [
  "Assign driver to pending rides",
  "Verify Driver Documents",
  "Review Rider Complaints",
  "Process Payment",
];

export default function AdminDashboard() {
  return (
    <>
      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              we want to see all rides reservation, dispatch, and track drivers movement,
              make announcement to drivers, chat with drivers, on click of each rides, we
              also want to see completed rides and detailed map and route, and info relating to
              {/* (mirrors the tone and spacing of your mock description) */}
            </p>
          </div>

          {/* Filters + Refresh */}
          <div className="flex items-center gap-2">
            {["Today", "Week", "Month", "Year"].map((f, i) => (
              <button
                key={f}
                className={classNames(
                  "rounded-md px-3 py-2 text-sm",
                  i === 0
                    ? "bg-[--accent] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                )}
                style={i === 0 ? ({ ["--accent" as any]: ACCENT } as React.CSSProperties) : undefined}
              >
                {f}
              </button>
            ))}
            <button className="ml-2 inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="rounded-md border border-gray-200 bg-white p-0 shadow-sm"
            >
              {/* black cap */}
              <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
                <div className="rounded-md bg-white/10 p-1.5">{s.icon}</div>
                {/* little rounded corner effect (as in your mock) handled by parent radius */}
              </div>

              <div className="px-4 py-4">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="mt-1 text-sm text-gray-600">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mt-6">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((a) => (
            <button
              key={a}
              className="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      {/* Current Ride Metrics */}
      <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-[#EFF5FF] px-5 py-3 text-sm font-semibold text-gray-800">
          Current Ride Metrics
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          <MetricCard title="Active ride requests">
            <KeyValue label="Rider requesting" value="24" />
            <KeyValue label="Available drivers" value="43" />
            <KeyValue label="Avg. wait time" value="3.5 mins" />
          </MetricCard>

          <MetricCard title="Ride Status Overview">
            <KeyValue label="Rides in Progress" value="43" />
            <KeyValue label="Completed Rides Today" value="73" />
            <KeyValue label="Cancelled Rides Today" value="12" />
          </MetricCard>

          <MetricCard title="Payment Overview">
            <KeyValue label="Cash payment" value="$24,134" />
            <KeyValue label="In app Payment" value="$27,134" />
          </MetricCard>
        </div>
      </section>
    </>
  );
}

/** Reusable metric card */
function MetricCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h4 className="mb-4 text-sm font-semibold text-gray-800">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/** Key-value row (right-aligned value, like your mock) */
function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-gray-200 py-2 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
