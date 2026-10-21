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

const PICKUPS = [
  {
    area: "Mirpur",
    location: "Mirpur 10",
    day: "Friday",
    time: "3:00 PM – 6:00 PM",
    items: 8,
  },
  {
    area: "Uttara",
    location: "Sector 7",
    day: "Saturday",
    time: "4:00 PM – 7:00 PM",
    items: 5,
  },
  {
    area: "Dhanmondi",
    location: "Road 27",
    day: "Sunday",
    time: "2:00 PM – 5:00 PM",
    items: 6,
  },
];

export const metadata = {
  title: "Community Pickup | ReSellHub",
  description:
    "A simple community-based pickup concept for local second-hand exchanges.",
};

export default function CommunityPickupPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8]">
      {/* HERO */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
              <PackageCheck size={15} />
              Community Pickup
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Make local handovers
              <span className="text-emerald-600"> more convenient.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Join scheduled pickup windows in your area instead of arranging
              every small-value product handover separately.
            </p>
          </div>

          {/* SUMMARY CARD */}
          <div className="rounded-[2rem] border border-slate-200 bg-[#f8fbf9] p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              How it works
            </p>

            <div className="mt-6 space-y-4">
              <Step
                number="01"
                title="Choose your area"
                text="Find an available pickup zone near you."
              />

              <Step
                number="02"
                title="Join a schedule"
                text="Select an available community pickup window."
              />

              <Step
                number="03"
                title="Hand over your item"
                text="Your product joins the scheduled local pickup."
              />
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING PICKUPS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              Upcoming schedules
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Pickups around the community.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500">
            Initial schedules are shown for UI design. Dynamic availability can
            be connected later.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PICKUPS.map((pickup) => (
            <article
              key={pickup.area}
              className="rounded-[1.6rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Truck size={19} />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Available
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950">
                {pickup.area} Pickup
              </h3>

              <div className="mt-4 space-y-3">
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
                  text={`${pickup.items} items already scheduled`}
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

      {/* WHY THIS EXISTS */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <Reason
              icon={PackageCheck}
              title="Fewer individual handovers"
              text="Users can join a shared local pickup schedule."
            />

            <Reason
              icon={Users}
              title="Community based"
              text="People in the same area can participate in the same pickup window."
            />

            <Reason
              icon={CheckCircle2}
              title="Simple experience"
              text="Choose area, select schedule and join. No complicated logistics flow."
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
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Icon size={15} className="text-slate-400" />
      {text}
    </div>
  );
}

function Reason({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f8fbf9] p-5">
      <Icon size={20} className="text-emerald-600" />

      <h3 className="mt-3 text-base font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}