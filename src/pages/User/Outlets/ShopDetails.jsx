import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import userAxiosInstance from '@/config/axiosConfig/userAxiosInstance';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import JobCard from '@/components/User/JobCard';
import Pagination from '@/components/ui/Pagination';
import { JOB_GRID_PAGE_SIZE } from '@/constants/pagination';
import { getSafePage } from '@/utils/pagination';
import {
    MapPin, Mail, Phone, Globe, Info,
    ArrowLeft, Building2, ShieldCheck, Linkedin,
    Twitter, Facebook, ExternalLink, Briefcase, Images
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

try {
    if (typeof window !== 'undefined' && L.Icon && L.Icon.Default) {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
    }
} catch (e) {
    console.error('Leaflet icon initialization error:', e);
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const ShopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.seekerInfo);
    const isLoggedIn = Boolean(user?.userId);
    const [shop, setShop] = useState(null);
    const [employer, setEmployer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxImg, setLightboxImg] = useState(null);
    const [shopJobs, setShopJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [jobsPage, setJobsPage] = useState(1);

    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const { data } = await userAxiosInstance.get(`/shop-details/${id}`);
                setShop(data.shop);
                setEmployer(data.employer || null);
            } catch (error) {
                console.error('Error fetching shop details:', error);
                toast.error('Failed to load shop details');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchShopDetails();
    }, [id]);

    // Fetch jobs belonging to this shop (company) and paginate client-side
    useEffect(() => {
        const fetchJobsForShop = async () => {
            if (!id) return;
            try {
                setJobsLoading(true);
                const { data } = await userAxiosInstance.get("/getJobPosts", {
                    params: { userId: user?.userId },
                });
                const allJobs = data.jobPosts || [];
                const jobsForShop = allJobs
                    .filter((job) => job.companyId === id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setShopJobs(jobsForShop);
                setJobsPage(1);
            } catch (error) {
                console.error("Error fetching jobs for shop:", error);
            } finally {
                setJobsLoading(false);
            }
        };
        fetchJobsForShop();
    }, [id, user?.userId]);

    useEffect(() => {
        if (
            loading ||
            shop?.showLocation === false ||
            !shop?.location?.lat ||
            !shop?.location?.lng ||
            !mapContainerRef.current
        ) return;
        const lat = parseFloat(shop.location.lat);
        const lng = parseFloat(shop.location.lng);
        if (isNaN(lat) || isNaN(lng)) return;
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapContainerRef.current).setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap',
            }).addTo(mapInstance.current);
            L.marker([lat, lng]).addTo(mapInstance.current);
        }
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [loading, shop]);

    const JOBS_PER_PAGE = JOB_GRID_PAGE_SIZE;
    const totalJobPages = Math.max(1, Math.ceil(shopJobs.length / JOBS_PER_PAGE));
    const safeJobsPage = getSafePage(jobsPage, totalJobPages);
    const jobsStartIdx = (safeJobsPage - 1) * JOBS_PER_PAGE;
    const visibleShopJobs = shopJobs.slice(jobsStartIdx, jobsStartIdx + JOBS_PER_PAGE);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-violet-50">
                <div className="w-10 h-10 rounded-full border-[3px] border-violet-200 border-t-violet-600 animate-spin" />
                <p className="mt-4 text-sm text-slate-400 font-medium">Loading shop details…</p>
            </div>
        );
    }

    /* ── Not Found ── */
    if (!shop) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-violet-50 gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Building2 size={36} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Shop not found</h2>
                <p className="text-sm text-slate-400">This shop may have been removed or doesn't exist.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const shopImages = Array.isArray(shop.images) ? shop.images.slice(0, 5) : [];
    const hasImages = shopImages.length > 0;

    const socialLinks = [
        shop.socialLinks?.linkedin && { href: shop.socialLinks.linkedin, icon: <Linkedin size={15} />, label: 'LinkedIn', color: 'text-blue-700' },
        shop.socialLinks?.twitter && { href: shop.socialLinks.twitter, icon: <Twitter size={15} />, label: 'Twitter / X', color: 'text-slate-900' },
        shop.socialLinks?.facebook && { href: shop.socialLinks.facebook, icon: <Facebook size={15} />, label: 'Facebook', color: 'text-blue-500' },
        shop.website && { href: shop.website, icon: <ExternalLink size={15} />, label: 'Official Website', color: 'text-violet-600' },
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-violet-50 pb-20">

            {/* ── Lightbox ── */}
            {lightboxImg && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setLightboxImg(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 cursor-zoom-out"
                    style={{ background: 'rgba(7,7,26,0.9)', backdropFilter: 'blur(16px)' }}
                >
                    <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={lightboxImg}
                        alt="Shop preview"
                        className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                    />
                    <button
                        onClick={() => setLightboxImg(null)}
                        className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        ×
                    </button>
                </motion.div>
            )}

            {/* ── Hero Banner ── */}
            <div
                className="relative h-56 overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)' }}
            >
                {/* Grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                {/* Glow blobs */}
                <div className="absolute -top-16 right-[10%] w-72 h-72 rounded-full bg-violet-500/30 blur-[60px]" />
                <div className="absolute -bottom-10 left-[5%] w-48 h-48 rounded-full bg-purple-400/20 blur-[40px]" />
            </div>

            {/* Header content: back + title (sits above hero and card) */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 pb-10 relative z-20 flex items-end gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-slate-800 text-sm font-semibold hover:bg-white/40 hover:text-slate-900 transition-all hover:-translate-x-0.5 shadow-sm"
                    style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
                >
                    <ArrowLeft size={16} className="text-violet-600" />
                    Back
                </button>
                <div className="flex flex-col">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-violet-100 font-semibold">
                        Shop Header
                    </p>
                    <h1 className="text-lg md:text-2xl font-semibold text-white leading-snug">
                        Shop Details
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">

                    {/* ── Profile Card (overlaps banner) ── */}
                    <motion.div
                        variants={itemVariants}
                        className="-mt-4 mb-6 bg-white rounded-2xl border border-violet-100 shadow-sm p-6 flex items-start gap-6 flex-wrap relative z-10"
                    >
                        {/* Logo: first letter of shop */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl border-[3px] border-white shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-violet-600 to-purple-400 text-white text-3xl font-extrabold">
                                {(shop.companyName || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-white flex items-center justify-center">
                                <ShieldCheck size={12} className="text-white" />
                            </div>
                        </div>

                        {/* Name & Meta */}
                        <div className="flex-1 min-w-[180px]">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    {shop.companyName}
                                </h1>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wide">
                                    <ShieldCheck size={11} /> Verified
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed mb-3 max-w-lg">
                                {shop.about}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold">
                                    <Briefcase size={12} /> Recruitment Tier
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                                    <MapPin size={12} />
                                    {shop.location?.address?.split(',').pop()?.trim() || 'Location Verified'}
                                </span>
                                {employer?.createdAt && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold">
                                        Since {new Date(employer.createdAt).getFullYear()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quick contact chips */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                            {shop.email && !isLoggedIn && (
                                <a
                                    href={`mailto:${shop.email}`}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 border border-violet-100 text-slate-600 text-sm font-medium hover:bg-violet-100 hover:text-slate-900 transition-all no-underline whitespace-nowrap"
                                >
                                    <Mail size={14} className="text-violet-500" />
                                    {shop.email}
                                </a>
                            )}
                            {shop.phone && (
                                <a
                                    href={`tel:${shop.phone}`}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-slate-600 text-sm font-medium hover:bg-emerald-100 hover:text-slate-900 transition-all no-underline whitespace-nowrap"
                                >
                                    <Phone size={14} className="text-emerald-500" />
                                    {shop.phone}
                                </a>
                            )}
                        </div>
                    </motion.div>

                    {/* ── Main Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">

                        {/* ══ LEFT COLUMN ══ */}
                        <div className="flex flex-col gap-6">

                            {/* Map */}
                            {(() => {
                                if (shop.showLocation === false) return null;
                                const lat = parseFloat(shop.location?.lat);
                                const lng = parseFloat(shop.location?.lng);
                                if (isNaN(lat) || isNaN(lng)) return null;
                                return (
                                    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6">
                                        {/* Card header */}
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                                                <MapPin size={16} className="text-pink-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 leading-tight">Shop Location</h3>
                                                <p className="text-xs text-slate-400">Interactive map view</p>
                                            </div>
                                        </div>
                                        <div
                                            ref={mapContainerRef}
                                            className="h-72 rounded-2xl overflow-hidden border border-violet-100 relative z-[1]"
                                        />
                                        {shop.location?.address && (
                                            <div className="flex items-start gap-2 mt-4 px-3 py-2.5 bg-violet-50 rounded-xl border border-violet-100">
                                                <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-slate-500 leading-relaxed">{shop.location.address}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })()}
                        </div>

                        {/* ══ RIGHT COLUMN ══ */}
                        <div className="flex flex-col gap-6">

                            {/* Employer Card */}
                            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                        <Globe size={16} className="text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 leading-tight">Employer Profile</h3>
                                        <p className="text-xs text-slate-400">Account & presence info</p>
                                    </div>
                                </div>

                                {/* Avatar tile */}
                                <div className="flex items-center gap-3 p-3.5 bg-violet-50 rounded-xl border border-violet-100 mb-5">
                                    <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-extrabold text-lg bg-gradient-to-br from-violet-600 to-purple-400">
                                        {(employer?.name || shop.companyName || 'E').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {employer?.name || 'Authorized Employer'}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Verified since {new Date(employer?.createdAt || shop.createdAt).getFullYear()}
                                        </p>
                                    </div>
                                </div>

                                {/* Social links */}
                                {socialLinks.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            Online Presence
                                        </p>
                                        {socialLinks.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold no-underline hover:bg-violet-50 hover:border-violet-200 hover:translate-x-0.5 transition-all"
                                            >
                                                <span className={link.color}>{link.icon}</span>
                                                <span className="text-slate-700">{link.label}</span>
                                                <ExternalLink size={12} className="ml-auto text-slate-400 flex-shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-3">No social links provided</p>
                                )}
                            </motion.div>

                            {/* Contact Details */}
                            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <Phone size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 leading-tight">Contact Channels</h3>
                                        <p className="text-xs text-slate-400">Direct communication</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {shop.email && !isLoggedIn && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 border border-violet-100">
                                            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                                                <Mail size={15} className="text-violet-600" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Email</p>
                                                <p className="text-sm font-semibold text-slate-800">{shop.email}</p>
                                            </div>
                                        </div>
                                    )}
                                    {shop.phone && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <Phone size={15} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Phone</p>
                                                <p className="text-sm font-semibold text-slate-800">{shop.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                        {/* Stat Tiles */}

                        </div>
                    </div>

                    {/* ── Jobs from this Shop ── */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-6 bg-white rounded-2xl border border-violet-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                    <Briefcase size={16} className="text-violet-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                                        Jobs at this Shop
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {shopJobs.length} job{shopJobs.length === 1 ? "" : "s"} found
                                    </p>
                                </div>
                            </div>
                        </div>

                        {jobsLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-8 h-8 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
                            </div>
                        ) : shopJobs.length === 0 ? (
                            <p className="text-sm text-slate-400">
                                No jobs listed for this shop yet.
                            </p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {visibleShopJobs.map((job) => (
                                        <JobCard key={job._id} job={job} layout="grid" />
                                    ))}
                                </div>

                                {shopJobs.length > JOBS_PER_PAGE && (
                                    <div className="mt-6">
                                        <Pagination
                                            currentPage={safeJobsPage}
                                            totalPages={totalJobPages}
                                            onPageChange={setJobsPage}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* ── Full-width Gallery ── */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-6 bg-white rounded-2xl border border-violet-100 shadow-sm p-6"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                <Images size={16} className="text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 leading-tight">Shop Gallery</h3>
                                <p className="text-xs text-slate-400">
                                    {hasImages
                                        ? `${shopImages.length} photo${shopImages.length > 1 ? 's' : ''} available`
                                        : 'No photos uploaded'}
                                </p>
                            </div>
                        </div>

                        {hasImages ? (
                            <div
                                className={`grid gap-2.5 ${
                                    shopImages.length === 1
                                        ? 'grid-cols-1'
                                        : shopImages.length === 2
                                        ? 'grid-cols-2'
                                        : 'grid-cols-3'
                                }`}
                            >
                                {shopImages.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setLightboxImg(img)}
                                        className={`relative rounded-xl overflow-hidden cursor-zoom-in group aspect-[4/3] bg-slate-100
                                            ${shopImages.length === 4 && i === 0 ? 'col-span-2' : ''}
                                            ${shopImages.length === 5 && i === 0 ? 'col-span-2' : ''}
                                        `}
                                    >
                                        <img
                                            src={img}
                                            alt={`Shop view ${i + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-[#07071a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                            <ExternalLink size={18} className="text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                    <Images size={26} className="text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-500 mb-1">No Images Provided</p>
                                <p className="text-xs text-slate-400 text-center max-w-[200px] leading-relaxed">
                                    The shop owner hasn't uploaded any photos yet.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ShopDetails;