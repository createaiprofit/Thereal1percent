import { trpc } from "@/lib/trpc";
import { MapPin, Calendar, Users, ArrowLeft, Plane, Anchor, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  trip: <MapPin className="w-4 h-4" />,
  yacht: <Anchor className="w-4 h-4" />,
  jet: <Plane className="w-4 h-4" />,
  gala: <Star className="w-4 h-4" />,
  nye: <Star className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  trip: "from-emerald-900/60 to-teal-900/40",
  yacht: "from-blue-900/60 to-cyan-900/40",
  jet: "from-indigo-900/60 to-purple-900/40",
  gala: "from-yellow-900/60 to-amber-900/40",
  nye: "from-red-900/60 to-pink-900/40",
};

type ConciergeEvent = {
  id: number;
  title: string;
  location: string;
  description: string | null;
  eventDate: Date;
  price: string | null;
  capacity: number;
  spotsLeft: number;
  imageUrl: string | null;
  hostName: string | null;
  hostAvatarUrl: string | null;
  category: string;
};

function EventCard({ event }: { event: ConciergeEvent }) {
  const spotsPercent = Math.round(((event.capacity - event.spotsLeft) / event.capacity) * 100);
  const isSoldOut = event.spotsLeft === 0;
  const isAlmostFull = event.spotsLeft <= 5 && event.spotsLeft > 0;

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-yellow-500/20 transition-all">
      {/* Hero image */}
      <div className={`relative h-48 bg-gradient-to-br ${CATEGORY_COLORS[event.category] ?? "from-gray-900 to-black"} overflow-hidden`}>
        {event.imageUrl && (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white/80 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
            {CATEGORY_ICONS[event.category]}
            {event.category}
          </span>
        </div>

        {/* Spots badge */}
        <div className="absolute top-3 right-3">
          {isSoldOut ? (
            <span className="bg-red-600/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              Sold Out
            </span>
          ) : isAlmostFull ? (
            <span className="bg-orange-500/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse">
              {event.spotsLeft} spots left
            </span>
          ) : null}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3">
          <span className="text-yellow-400 font-bold text-lg">{event.price ?? "Invite Only"}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {event.title}
        </h3>

        <div className="flex items-center gap-4 text-white/40 text-xs mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {event.description && (
          <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">{event.description}</p>
        )}

        {/* Capacity bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-white/30 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {event.capacity - event.spotsLeft} / {event.capacity} attending
            </span>
            <span className="text-white/30">{spotsPercent}% full</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${spotsPercent > 80 ? "bg-red-500" : spotsPercent > 50 ? "bg-yellow-500" : "bg-green-500"}`}
              style={{ width: `${spotsPercent}%` }}
            />
          </div>
        </div>

        {/* Host */}
        {event.hostName && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
            {event.hostAvatarUrl ? (
              <img src={event.hostAvatarUrl} alt={event.hostName} className="w-7 h-7 rounded-full object-cover border border-yellow-400/30" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-600 to-red-900 flex items-center justify-center text-white text-xs font-bold">
                {event.hostName[0]}
              </div>
            )}
            <div>
              <div className="text-white/60 text-xs">Hosted by</div>
              <div className="text-white text-xs font-semibold">{event.hostName}</div>
            </div>
          </div>
        )}

        <Button
          className={`w-full ${isSoldOut ? "bg-white/5 text-white/30 cursor-not-allowed" : "bg-gradient-to-r from-yellow-600 to-red-700 text-white border-0 hover:opacity-90"}`}
          disabled={isSoldOut}
          onClick={() => {
            if (!isSoldOut) toast(`Booking request sent for ${event.title}. A concierge will contact you.`);
          }}
        >
          {isSoldOut ? "Sold Out" : "Request Booking"}
        </Button>
      </div>
    </div>
  );
}

export default function Concierge() {
  const { data: events, isLoading } = trpc.social.getEvents.useQuery();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/feed">
            <button className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="text-white font-bold text-lg tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Concierge
            </div>
            <div className="text-white/30 text-xs tracking-widest">Curated Experiences</div>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="px-4 py-6 border-b border-white/5">
        <p className="text-white/50 text-sm leading-relaxed">
          Exclusive trips, yacht weeks, private galas, and jet experiences — curated for Club members only.
          All events are vetted, limited capacity, and priced for the serious.
        </p>
      </div>

      {/* Events */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-white/5 rounded-2xl mb-3" />
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))
        ) : !events?.length ? (
          <div className="text-center py-16 text-white/20">
            <Plane className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <div className="text-sm">No events scheduled yet.<br />Check back soon.</div>
          </div>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={event as ConciergeEvent} />
          ))
        )}
      </div>
    </div>
  );
}
