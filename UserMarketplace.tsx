import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Filter, Crown, Gavel, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "watches", label: "Watches" },
  { value: "cars", label: "Cars" },
  { value: "fashion", label: "Fashion" },
  { value: "jets", label: "Jets" },
  { value: "yachts", label: "Yachts" },
  { value: "cigars", label: "Cigars" },
  { value: "other", label: "Other" },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  watches: "⌚", cars: "🏎️", fashion: "👔", jets: "✈️",
  yachts: "🛥️", cigars: "🚬", other: "💎",
};

type Listing = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  askPrice: string;
  currency: string;
  imageUrl: string | null;
  bidCount: number;
  createdAt: Date;
  sellerName: string | null;
  sellerAvatar: string | null;
  sellerTier: "silver" | "gold" | "platinum" | null;
};

function ListingCard({ listing, onBid }: { listing: Listing; onBid: (id: number, price: number) => void }) {
  const price = parseFloat(listing.askPrice);

  return (
    <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden hover:border-yellow-500/30 transition-all group">
      {/* Image */}
      <div className="aspect-square bg-black/40 relative overflow-hidden">
        {listing.imageUrl ? (
          <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
            {CATEGORY_EMOJIS[listing.category] ?? "💎"}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-black/70 backdrop-blur-sm text-white/60 text-xs px-2 py-0.5 rounded-full uppercase tracking-wider">
            {CATEGORY_EMOJIS[listing.category]} {listing.category}
          </span>
        </div>
        {listing.bidCount > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-600/80 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              {listing.bidCount} bids
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="text-white font-semibold text-sm truncate mb-1">{listing.title}</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-yellow-400 font-bold text-lg">${price.toLocaleString()}</div>
            <div className="text-white/30 text-xs">{listing.currency}</div>
          </div>
          <Button
            size="sm"
            onClick={() => onBid(listing.id, price)}
            className="bg-gradient-to-r from-yellow-600 to-red-700 text-white border-0 text-xs h-8 px-3"
          >
            <Gavel className="w-3 h-3 mr-1" />
            Bid
          </Button>
        </div>

        {/* Seller */}
        {listing.sellerName && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-600 to-red-900 flex items-center justify-center text-white text-xs">
              {listing.sellerName[0]}
            </div>
            <span className="text-white/40 text-xs">{listing.sellerName}</span>
            {listing.sellerTier === "platinum" && <Crown className="w-3 h-3 text-purple-400" />}
            {listing.sellerTier === "gold" && <Crown className="w-3 h-3 text-yellow-400" />}
          </div>
        )}
      </div>
    </div>
  );
}

function BidDialog({ listingId, askPrice, onClose }: { listingId: number; askPrice: number; onClose: () => void }) {
  const [amount, setAmount] = useState(String(askPrice));
  const [note, setNote] = useState("");

  const placeBid = trpc.social.placeBid.useMutation({
    onSuccess: () => {
      toast.success("Bid placed! The seller will be notified.");
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Place a Private Bid
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-2">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-widest mb-1.5 block">Your Offer (USD)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-white/5 border-white/10 text-white text-lg font-bold"
          />
          <div className="text-white/30 text-xs mt-1">Ask price: ${askPrice.toLocaleString()}</div>
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-widest mb-1.5 block">Note (optional)</label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a message to the seller..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
        <Button
          onClick={() => placeBid.mutate({ listingId, amount: parseFloat(amount), note: note || undefined })}
          disabled={!amount || parseFloat(amount) <= 0 || placeBid.isPending}
          className="w-full bg-gradient-to-r from-yellow-600 to-red-700 text-white border-0"
        >
          {placeBid.isPending ? "Submitting..." : "Submit Bid"}
        </Button>
      </div>
    </DialogContent>
  );
}

export default function UserMarketplace() {
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState("all");
  const [bidTarget, setBidTarget] = useState<{ id: number; price: number } | null>(null);

  const { data, isLoading } = trpc.social.getListings.useQuery({
    category: category === "all" ? undefined : category,
    limit: 20,
  });

  const handleBid = (id: number, price: number) => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    setBidTarget({ id, price });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link href="/feed">
              <button className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <span className="text-white font-bold text-lg tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Marketplace
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => {
              if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
              toast("Listing creation launching soon.");
            }}
            className="bg-gradient-to-r from-yellow-600 to-red-700 text-white border-0 h-8"
          >
            <Plus className="w-4 h-4 mr-1" />
            List Item
          </Button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                category === cat.value
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                  : "bg-white/5 text-white/40 border border-white/10 hover:text-white/60"
              }`}
            >
              {cat.value !== "all" && CATEGORY_EMOJIS[cat.value]} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings grid */}
      <div className="p-3">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-white/5 rounded-xl mb-2" />
                <div className="h-3 bg-white/5 rounded w-3/4 mb-1" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : !data?.items?.length ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Tag className="w-12 h-12 text-white/10" />
            <div className="text-white/30 text-sm text-center">
              No listings yet in this category.<br />Be the first to list.
            </div>
            <Button
              variant="outline"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              onClick={() => toast("Listing creation launching soon.")}
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Listing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {data.items.map((listing) => (
              <ListingCard key={listing.id} listing={listing as Listing} onBid={handleBid} />
            ))}
          </div>
        )}
      </div>

      {/* Bid dialog */}
      {bidTarget && (
        <Dialog open onOpenChange={() => setBidTarget(null)}>
          <BidDialog
            listingId={bidTarget.id}
            askPrice={bidTarget.price}
            onClose={() => setBidTarget(null)}
          />
        </Dialog>
      )}
    </div>
  );
}
