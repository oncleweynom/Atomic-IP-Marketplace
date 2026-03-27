import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Loader2, AlertTriangle } from "lucide-react";

interface Listing {
  id: number;
  ipfs_hash: string;
  owner: string;
  price: number;
}

const mockListings: Listing[] = [
  {
    id: 1,
    ipfs_hash: "QmXyZ12345abcdefghijkLMNOPQRSTUVWXYZabcdef",
    owner: "GABCDEFGHJKLMNPQRSTUVXYZ23456789ABCDEFGHJK",
    price: 120,
  },
  {
    id: 2,
    ipfs_hash: "QmZyX54321mnopqrstuVWXYZabcdef1234567890",
    owner: "GABCDE1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    price: 225,
  },
  {
    id: 3,
    ipfs_hash: "QmLmnopQRStuvwxyZABCDEF1234567890ghijklmnop",
    owner: "G1234567890ABCDEFGHJKLMNPQRSTUVWXYZabcdef",
    price: 89,
  },
];

function truncateHash(hash: string): string {
  if (!hash) return "";
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
}

function truncateAddress(address: string): string {
  if (!address) return "";
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

async function fetchListings(): Promise<Listing[]> {
  // TODO: replace with real indexer API call once available
  // e.g. const res = await fetch("/api/listings");
  // return await res.json();
  await new Promise((resolve) => setTimeout(resolve, 750));
  return mockListings;
}

export function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchListings();
        if (mounted) {
          setListings(data);
        }
      } catch (err) {
        if (mounted) {
          setError("Unable to fetch listings at this time. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const content = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse"
            >
              <div className="h-5 w-2/3 bg-slate-200 mb-3 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 mb-2 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 mb-3 rounded" />
              <div className="h-10 w-full bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-red-700">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle size={18} /> Error
          </div>
          <p className="mt-2">{error}</p>
          <button
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchListings()
                .then((data) => setListings(data))
                .catch(() => setError("Unable to refresh listings."))
                .finally(() => setLoading(false));
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    if (listings.length === 0) {
      return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
          <p>No listings found yet.</p>
          <p className="text-sm text-slate-500">Check back soon or connect your indexer.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <article
            key={listing.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span>Listing #{listing.id}</span>
              <span>{listing.price} USDC</span>
            </div>

            <div className="mb-3">
              <p className="text-xs text-slate-400">IPFS Hash</p>
              <p className="truncate text-sm font-medium text-slate-800" title={listing.ipfs_hash}>
                {truncateHash(listing.ipfs_hash)}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-400">Owner</p>
              <p className="truncate text-sm text-slate-700" title={listing.owner}>
                {truncateAddress(listing.owner)}
              </p>
            </div>

            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => navigate(`/swap/${listing.id}`)}
            >
              <ShoppingCart size={16} />
              Buy Now
            </button>
          </article>
        ))}
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-7xl p-4">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace Listings</h1>
          <p className="text-sm text-slate-500">Browse all IP listings and select one to swap.</p>
        </div>
        {loading && (
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading
          </div>
        )}
      </div>

      {content()}
    </section>
  );
}
