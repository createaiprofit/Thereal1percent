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
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Tag className="w-12 h-12 text-white/10" />
            <div className="text-white/30 text-sm text-center">
              No listings yet in this category.
              <br />
              Be the first to list.
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
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onBid={handleBid}
              />
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