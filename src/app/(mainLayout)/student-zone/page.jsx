import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  Truck,
  Users,
} from "lucide-react";

const pickups = [
  {
    area: "Mirpur",
    location: "Mirpur 10",
    day: "Friday",
    time: "3:00 PM - 6:00 PM",
    items: 8,
  },
  {
    area: "Uttara",
    location: "Sector 7",
    day: "Saturday",
    time: "4:00 PM - 7:00 PM",
    items: 5,
  },
  {
    area: "Dhanmondi",
    location: "Road 27",
    day: "Sunday",
    time: "2:00 PM - 5:00 PM",
    items: 6,
  },
];

export const metadata = {
  title: "Community Pickup | ReSellHub",
  description:
    "Discover scheduled local pickup options for convenient second-hand exchanges in Bangladesh.",
};

export default function CommunityPickupPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8]">
      {/* HERO */}
      <section className="overflow-hidden border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:px-8 lg:py-20">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
              <PackageCheck size={15} />
              Community Pickup
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
              Make local exchanges
              <span className="text-emerald-600">
                {" "}
                easier together.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Join scheduled local pickup windows instead
              of arranging every small-value product
              handover separately.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
              <Users
                size={17}
                className="text-emerald-600"
              />

              Built around local community convenience
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="relative">
            <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-emerald-100/60 blur-3xl" />

            <div className="relative rounded-[30px] border border-slate-200 bg-[#f8fbf9] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                How it works
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                One simple local flow.
              </h2>

              <div className="mt-6 space-y-3">
                <Step
                  number="01"
                  title="Choose your area"
                  text="Find an available pickup zone around your community."
                />

                <Step
                  number="02"
                  title="Select a schedule"
                  text="Choose an available local pickup window."
                />

                <Step
                  number="03"
                  title="Join the pickup"
                  text="Add your product to the scheduled community pickup."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PICKUPS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              Upcoming schedules
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Pickups around the community.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500">
            These are initial example schedules. Live
            pickup availability will be connected later.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pickups.map((pickup) => (
            <article
              key={pickup.area}
              className="group rounded-[24px] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Truck size={19} />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Available
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950">
                {pickup.area} Pickup
              </h3>

              <div className="mt-5 space-y-3">
                <InfoRow
                  icon={MapPin}
                  text={pickup.location}
                />

                <InfoRow
                  icon={CalendarDays}
                  text={pickup.day}
                />

                <InfoRow
                  icon={Clock3}
                  text={pickup.time}
                />

                <InfoRow
                  icon={Users}
                  text={`${pickup.items} items scheduled`}
                />
              </div>

              <button
                type="button"
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-black text-white transition hover:bg-slate-800"
              >
                View Pickup
                <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              Why Community Pickup?
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Less hassle for local exchanges.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Reason
              icon={PackageCheck}
              title="Fewer Individual Handovers"
              text="Multiple local items can use the same scheduled pickup window."
            />

            <Reason
              icon={Users}
              title="Community Based"
              text="People from the same area can participate in a shared local flow."
            />

            <Reason
              icon={CheckCircle2}
              title="Simple Experience"
              text="Choose your area, select a schedule and join without complicated logistics."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700">
        {number}
      </div>

      <div>
        <p className="text-sm font-black text-slate-950">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-600">
      <Icon
        size={15}
        className="flex-none text-slate-400"
      />

      <span>{text}</span>
    </div>
  );
}

function Reason({ icon: Icon, title, text }) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-[#f8fbf9] p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon size={18} />
      </div>

      <h3 className="mt-4 text-base font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </article>
  );
}