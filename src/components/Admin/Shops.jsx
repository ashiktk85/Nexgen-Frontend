import { useEffect, useState, useRef } from "react";
import { DataTable } from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Store, Building2, MapPin, Globe, Image as ImageIcon, Share2, ListChecks, XCircle } from "lucide-react";
import ConfirmModal from "@/components/Admin/ConfirmModal";
import { getAllShops, shopListUnList } from "@/apiServices/adminApi";
import { toast } from "sonner";
import {
  ADMIN_PAGE,
  ADMIN_HEADER_EYEBROW,
  ADMIN_HEADER_TITLE,
  ADMIN_STAT_GRID,
  ADMIN_TABLE_WRAP,
  ADMIN_SEARCH_INPUT,
} from "@/components/Admin/adminPageLayout";
import { displayValue } from "@/utils/tableValue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

try {
  if (typeof window !== "undefined" && L.Icon?.Default) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }
} catch (e) {
  console.error("Leaflet icon initialization error:", e);
}

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const rowsPerPage = 20;

  // Leaflet map: init when sheet is open and shop has location; cleanup on close or shop change
  useEffect(() => {
    if (!openSheet || !selectedShop || selectedShop?.location?.lat == null || selectedShop?.location?.lng == null) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }
    const lat = parseFloat(selectedShop.location.lat);
    const lng = parseFloat(selectedShop.location.lng);
    if (isNaN(lat) || isNaN(lng) || !mapContainerRef.current) return;
    const map = L.map(mapContainerRef.current).setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    L.marker([lat, lng]).addTo(map);
    mapInstanceRef.current = map;
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => {
      clearTimeout(t);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [openSheet, selectedShop?._id, selectedShop?.location?.lat, selectedShop?.location?.lng]);

  useEffect(() => {
    fetchShops(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  async function fetchShops(page, search) {
    try {
      const result = await getAllShops(page, rowsPerPage, search);
      if (result?.data?.response) {
        const { shops: list, totalPages: pages } = result.data.response;
        setShops(list || []);
        setTotalPages(pages ?? 1);
      }
    } catch (error) {
      console.log("Error in shops listing component: ", error?.message);
      toast.error("An unexpected error occurred");
    }
  }

  const handleListUnlist = async (shopId) => {
    try {
      const result = await shopListUnList(shopId);
      if (result?.data?.response) {
        const { message, response } = result.data;
        toast.success(message);
        setShops((prev) =>
          prev.map((item) =>
            item._id === shopId ? { ...item, isBlocked: response.isBlocked } : item
          )
        );
        if (selectedShop?._id === shopId) {
          setSelectedShop((prev) =>
            prev?._id === shopId ? { ...prev, isBlocked: response.isBlocked } : prev
          );
        }
      }
    } catch (error) {
      console.log("Error in handleListUnlist at shops listing component: ", error?.message);
      toast.error("An unexpected error occurred");
    }
  };

  const totalShops = shops.length;
  const listedShops = shops.filter((shop) => !shop.isBlocked).length;
  const unlistedShops = shops.filter((shop) => shop.isBlocked).length;
  const pendingShop = shops.find((shop) => shop._id === pendingId);

  const columns = [
    { id: "companyName", header: "Shop Name", accessor: "companyName", sortable: true },
    {
      id: "employerName",
      header: "Employer",
      accessor: "employerName",
      sortable: true,
      cell: (row) => (
        <span className="inline-flex items-center justify-center min-w-[100px] max-w-[120px] h-7 px-2 rounded border border-slate-200 bg-slate-50 text-blue-600 font-bold text-[11px] truncate" title={displayValue(row.employerName, "")}>
          {displayValue(row.employerName)}
        </span>
      ),
    },
    { id: "email", header: "Email", accessor: "email", sortable: true },
    { id: "phone", header: "Phone", accessor: "phone" },
    { id: "address", header: "Address", accessor: "address" },
    {
      id: "listing",
      header: "Status",
      accessor: "isBlocked",
      cell: (row) => (
        <span
          className={`inline-flex items-center justify-center min-w-[64px] px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            row.isBlocked
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}
        >
          {row.isBlocked ? "Unlisted" : "Listed"}
        </span>
      ),
    },
  ];

  return (
    <div className={ADMIN_PAGE}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <p className={ADMIN_HEADER_EYEBROW}>Overview</p>
          <h1 className={ADMIN_HEADER_TITLE}>Shops</h1>
        </div>
      </div>

      <div className={ADMIN_STAT_GRID}>
          <StatCard
            icon={<Store size={20} color="#fff" />}
            value={totalShops}
            label="Total Shops"
            gradient="linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)"
            shadow="0 8px 24px rgba(99,102,241,.35)"
          />
          <StatCard
            icon={<ListChecks size={20} color="#fff" />}
            value={listedShops}
            label="Listed"
            gradient="linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)"
            shadow="0 8px 24px rgba(16,185,129,.32)"
          />
          <StatCard
            icon={<XCircle size={20} color="#fff" />}
            value={unlistedShops}
            label="Unlisted"
            gradient="linear-gradient(135deg,#b91c1c 0%,#ef4444 55%,#f97373 100%)"
            shadow="0 8px 24px rgba(239,68,68,.32)"
          />
        </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
            placeholder="Search by shop name…"
            className={ADMIN_SEARCH_INPUT}
          />
        </div>
      </div>

      <div className={ADMIN_TABLE_WRAP}>
          <DataTable
            title="Shops"
            columns={columns}
            data={shops}
            loading={!shops.length && totalPages === 1}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            selectable={false}
            compact
            showActions
            onView={(row) => {
              setSelectedShop(row);
              setOpenSheet(true);
            }}
            onBlock={(row) => {
              setPendingId(row._id);
              setConfirmOpen(true);
            }}
            viewLabel="View"
            blockLabel={(row) => (row.isBlocked ? "List" : "Unlist")}
            showSno={true}
            rowsPerPage={rowsPerPage}
          />
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={pendingShop?.isBlocked ? "List shop?" : "Unlist shop?"}
        description={
          pendingShop?.isBlocked
            ? "This shop will become visible to users again and all of its jobs will be listed."
            : "This shop will be hidden from users and all of its jobs will be unlisted."
        }
        confirmLabel={pendingShop?.isBlocked ? "List" : "Unlist"}
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={async () => {
          if (!pendingId) return;
          setConfirmLoading(true);
          try {
            await handleListUnlist(pendingId);
            setConfirmOpen(false);
            setPendingId(null);
          } finally {
            setConfirmLoading(false);
          }
        }}
      />

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-full sm:max-w-3xl bg-slate-50 p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-slate-200 bg-white">
            <SheetTitle className="text-base font-bold text-slate-900">
              Shop details
            </SheetTitle>
          </SheetHeader>
          {selectedShop && (
            <div className="px-4 py-3 space-y-3 text-sm overflow-y-auto max-h-[calc(100vh-70px)]">
              {/* Employer */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Employer
                  </h3>
                </div>
                <div className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-extrabold text-lg bg-gradient-to-br from-violet-600 to-purple-400">
                      {(selectedShop.employerName || "E").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {selectedShop.employerName || "—"}
                      </p>
                      <p className="text-[11px] text-slate-500">Shop owner</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Listing status */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Listing status
                  </h3>
                </div>
                <div className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${
                      selectedShop.isBlocked
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {selectedShop.isBlocked ? "Unlisted" : "Listed"}
                  </span>
                </div>
              </div>

              {/* Shop info */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Shop information
                  </h3>
                </div>
                <div className="px-3 py-3 space-y-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase">Shop name</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedShop.companyName || "—"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Email</p>
                      <p className="text-xs text-slate-800 break-all">{selectedShop.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Phone</p>
                      <p className="text-xs text-slate-800">{selectedShop.phone || "—"}</p>
                    </div>
                  </div>
                  {selectedShop.address && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Address</p>
                      <p className="text-xs text-slate-800 whitespace-pre-wrap">{selectedShop.address}</p>
                    </div>
                  )}
                  {selectedShop.about && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">About</p>
                      <p className="text-xs text-slate-800 whitespace-pre-wrap">{selectedShop.about}</p>
                    </div>
                  )}
                  {selectedShop.webSite && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Website</p>
                      <a
                        href={selectedShop.webSite.startsWith("http") ? selectedShop.webSite : `https://${selectedShop.webSite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline break-all flex items-center gap-1"
                      >
                        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                        {selectedShop.webSite}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Location
                  </h3>
                </div>
                <div className="px-3 py-3 space-y-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase">Show on map</p>
                    <p className="text-xs text-slate-800">{selectedShop.showLocation !== false ? "Yes" : "No (hidden)"}</p>
                  </div>
                  {(selectedShop.location?.address || selectedShop.address) && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Address</p>
                      <p className="text-xs text-slate-800 whitespace-pre-wrap">
                        {selectedShop.location?.address || selectedShop.address}
                      </p>
                    </div>
                  )}
                  {selectedShop.showLocation !== false && selectedShop.location?.lat != null && selectedShop.location?.lng != null && (
                    <>
                      <div className="rounded-lg overflow-hidden border border-slate-200 h-72 bg-slate-100" ref={mapContainerRef} />
                      <a
                        href={`https://www.google.com/maps?q=${selectedShop.location.lat},${selectedShop.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
                      >
                        <MapPin className="h-3.5 w-3.5" /> Open in Google Maps
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Media: logo, certificate, gallery */}
              {(selectedShop.logo || selectedShop.companyCertificate || (selectedShop.images?.length > 0)) && (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
                    <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Media
                    </h3>
                  </div>
                  <div className="px-3 py-3 space-y-3">
                    {selectedShop.logo && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase mb-1">Logo</p>
                        <img
                          src={selectedShop.logo}
                          alt="Shop logo"
                          className="h-20 w-20 rounded-lg object-cover border border-slate-200"
                        />
                      </div>
                    )}
                    {selectedShop.companyCertificate && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase mb-1">Certificate</p>
                        <img
                          src={selectedShop.companyCertificate}
                          alt="Certificate"
                          className="max-h-32 rounded-lg border border-slate-200 object-contain bg-slate-50"
                        />
                      </div>
                    )}
                    {selectedShop.images?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase mb-2">Gallery</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedShop.images.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Gallery ${i + 1}`}
                              className="h-20 w-20 rounded-lg object-cover border border-slate-200"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Socials */}
              {(selectedShop.socialLinks?.linkedin || selectedShop.socialLinks?.twitter || selectedShop.socialLinks?.facebook) && (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
                    <Share2 className="h-3.5 w-3.5 text-slate-400" />
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Social links
                    </h3>
                  </div>
                  <div className="px-3 py-3 space-y-2">
                    {selectedShop.socialLinks?.linkedin && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase">LinkedIn</p>
                        <a
                          href={selectedShop.socialLinks.linkedin.startsWith("http") ? selectedShop.socialLinks.linkedin : `https://${selectedShop.socialLinks.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:underline break-all"
                        >
                          {selectedShop.socialLinks.linkedin}
                        </a>
                      </div>
                    )}
                    {selectedShop.socialLinks?.twitter && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase">Twitter</p>
                        <a
                          href={selectedShop.socialLinks.twitter.startsWith("http") ? selectedShop.socialLinks.twitter : `https://${selectedShop.socialLinks.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:underline break-all"
                        >
                          {selectedShop.socialLinks.twitter}
                        </a>
                      </div>
                    )}
                    {selectedShop.socialLinks?.facebook && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase">Facebook</p>
                        <a
                          href={selectedShop.socialLinks.facebook.startsWith("http") ? selectedShop.socialLinks.facebook : `https://${selectedShop.socialLinks.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:underline break-all"
                        >
                          {selectedShop.socialLinks.facebook}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Shops;
