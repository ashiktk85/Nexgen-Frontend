import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import userAxiosInstance from '@/config/axiosConfig/userAxiosInstance';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  MapPin, Mail, Phone, Briefcase, IndianRupee,
  Clock, Building2, Calendar, CheckCircle2,
  ArrowLeft, Share2, ChevronRight, Star, ExternalLink
} from 'lucide-react';

/* ─── Inject styles once ─── */
if (!document.getElementById('jd-styles')) {
  const s = document.createElement('style');
  s.id = 'jd-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .jd-root { font-family:'DM Sans',sans-serif; }
    .jd-root h1,.jd-root h2,.jd-root h3,.jd-root h4 { font-family:'Plus Jakarta Sans',sans-serif; }

    .jd-card {
      background:#fff; border:1.5px solid #e8edf5; border-radius:18px;
      padding:28px; transition:box-shadow .2s,border-color .2s;
    }
    .jd-card:hover { box-shadow:0 8px 32px rgba(79,70,229,.08); border-color:#c7d2fe; }

    .jd-chip {
      display:inline-flex; align-items:center; gap:6px;
      padding:6px 13px; border-radius:999px;
      font-size:12.5px; font-weight:600;
      font-family:'Plus Jakarta Sans',sans-serif;
      white-space:nowrap;
    }

    .jd-info-row {
      display:flex; align-items:center; gap:10px;
      padding:11px 14px; background:#f8fafc;
      border:1.5px solid #f1f5f9; border-radius:11px;
      transition:border-color .18s;
    }
    .jd-info-row:hover { border-color:#c7d2fe; }

    .jd-req-item {
      display:flex; align-items:flex-start; gap:10px;
      padding:10px 14px; border-radius:10px;
      border:1.5px solid #f1f5f9; background:#f8fafc;
      font-size:13.5px; color:#475569; line-height:1.55;
      transition:background .15s,border-color .15s;
    }
    .jd-req-item:hover { background:#eef2ff; border-color:#c7d2fe; }

    .jd-apply-btn {
      display:inline-flex; align-items:center; gap:7px;
      padding:12px 28px; border-radius:12px; border:none;
      font-size:14px; font-weight:700; cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif;
      transition:all .18s ease;
    }
    .jd-apply-btn.active {
      background:linear-gradient(135deg,#16a34a,#22c55e);
      color:#fff; box-shadow:0 6px 16px rgba(34,197,94,.3);
    }
    .jd-apply-btn.active:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(34,197,94,.35); }
    .jd-apply-btn.applied { background:#f1f5f9; color:#94a3b8; cursor:not-allowed; }

    .jd-back-btn {
      display:inline-flex; align-items:center; gap:6px;
      padding:8px 16px; border-radius:10px; border:1.5px solid #e2e8f0;
      background:#fff; color:#475569; font-size:13px; font-weight:600;
      cursor:pointer; transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif;
    }
    .jd-back-btn:hover { background:#f8fafc; border-color:#c7d2fe; color:#4f46e5; }

    .jd-share-btn {
      display:inline-flex; align-items:center; justify-content:center;
      width:40px; height:40px; border-radius:10px; border:1.5px solid #e2e8f0;
      background:#fff; color:#64748b; cursor:pointer; transition:all .18s;
    }
    .jd-share-btn:hover { border-color:#c7d2fe; color:#4f46e5; background:#eef2ff; }

    .jd-sidebar-card {
      background:#fff; border:1.5px solid #e8edf5; border-radius:16px;
      overflow:hidden;
    }

    .jd-spinner { width:40px; height:40px; border-radius:50%; border:3px solid #e0e7ff; border-top-color:#6366f1; animation:jd-spin .75s linear infinite; }
    @keyframes jd-spin { to { transform:rotate(360deg); } }

    .jd-divider { height:1.5px; background:linear-gradient(90deg,#e0e7ff,transparent); border:none; margin:20px 0; }

    /* ── Sticky mobile CTA bar ── */
    .jd-mobile-cta {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 100;
      background: #fff;
      border-top: 1.5px solid #e8edf5;
      padding: 12px 16px;
      box-shadow: 0 -4px 20px rgba(0,0,0,.08);
      gap: 10px;
      align-items: center;
    }

    /* ── Responsive breakpoints ── */

    /* Tablet & below (≤ 900px): sidebar moves below main content */
    @media (max-width: 900px) {
      .jd-layout {
        flex-direction: column !important;
      }
      .jd-sidebar {
        width: 100% !important;
      }
    }

    /* Mobile (≤ 640px) */
    @media (max-width: 640px) {
      .jd-hero {
        padding: 80px 0 56px !important;
      }

      .jd-main-wrapper {
        margin-top: -36px !important;
        padding: 0 12px !important;
        margin-bottom: 90px !important; /* space for sticky CTA */
      }

      .jd-card {
        padding: 18px !important;
        border-radius: 14px !important;
      }

      .jd-card-header-inner {
        padding: 18px !important;
      }

      /* Job title + company avatar: stack tighter on small screens */
      .jd-job-header-row {
        gap: 12px !important;
      }
      .jd-company-avatar {
        width: 48px !important;
        height: 48px !important;
        border-radius: 12px !important;
        font-size: 20px !important;
      }

      /* Chips: allow wrapping with smaller font */
      .jd-chip {
        font-size: 11.5px !important;
        padding: 5px 10px !important;
      }

      /* Info grid: single column on mobile */
      .jd-info-grid {
        grid-template-columns: 1fr !important;
      }

      /* Hide desktop CTA buttons (replaced by sticky bar) */
      .jd-desktop-cta {
        display: none !important;
      }

      /* Show sticky mobile CTA */
      .jd-mobile-cta {
        display: flex !important;
      }

      /* Sidebar: compact on mobile */
      .jd-sidebar-card .jd-sidebar-apply-btn,
      .jd-sidebar-card .jd-sidebar-view-shop-btn {
        display: none !important;
      }

      /* Section headers slightly smaller */
      .jd-section-title {
        font-size: 14px !important;
      }

      /* Requirements item */
      .jd-req-item {
        font-size: 13px !important;
        padding: 9px 12px !important;
      }

      /* Description text */
      .jd-description-text {
        font-size: 13.5px !important;
      }

      /* Back button in hero */
      .jd-hero-back-btn {
        font-size: 12px !important;
        padding: 6px 12px !important;
      }
    }

    /* Very small screens (≤ 380px) */
    @media (max-width: 380px) {
      .jd-chip {
        font-size: 11px !important;
        padding: 4px 8px !important;
      }
      .jd-apply-btn {
        padding: 11px 18px !important;
        font-size: 13px !important;
      }
    }
  `;
  document.head.appendChild(s);
}

/* ─── Avatar gradient ─── */
const getGrad = (ch = 'A') => {
  const gs = ['linear-gradient(135deg,#6366f1,#818cf8)', 'linear-gradient(135deg,#0ea5e9,#38bdf8)', 'linear-gradient(135deg,#f59e0b,#fbbf24)', 'linear-gradient(135deg,#10b981,#34d399)', 'linear-gradient(135deg,#ec4899,#f472b6)'];
  return gs[((ch.toUpperCase().charCodeAt(0) - 65) % gs.length + gs.length) % gs.length];
};

/* ─── Animation variants ─── */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .09 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: .4, ease: 'easeOut' } } };

/* ═══════════════════════════════════ */
const JobDetails = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [shopName, setShopName] = useState("");
  const { id } = useParams();
  const user = useSelector((state) => state.user.seekerInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await userAxiosInstance.get(`/job-details/${id}`, { params: { userId: user.userId } });
        setJob(data.jobDetails);
        setCompany(data.employerDetails);

        if (data.jobDetails.companyId) {
          try {
            const { data: companyData } = await userAxiosInstance.get(`/shop-details/${data.jobDetails.companyId}`);
            setShopName(companyData.shop.companyName);
          } catch (err) {
            console.error("Error fetching shop name:", err);
          }
        }
      } catch (error) {
        toast.warning(error.response?.data?.message || 'An error occurred');
        navigate('/home');
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleApplyJob = () => {
    navigate(`/job-application/${id}`, {
      state: { jobTitle: job?.name, companyName: company?.name, phone: job?.phone, companyLocation: `${job?.state}, ${job?.city}`, employerId: company?.employerId }
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  /* ── Loading ── */
  if (!job || !company) return (
    <div className="jd-root" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 14, background: '#f1f5f9' }}>
      <div className="jd-spinner" />
      <p style={{ color: '#64748b', fontSize: 14 }}>Loading job details…</p>
    </div>
  );

  const salaryText = job.salary?.[0] === 0 && job.salary?.[1] === 0
    ? 'Not disclosed'
    : `₹${job.salary?.[0]?.toLocaleString()} – ₹${job.salary?.[1]?.toLocaleString()}`;

  const companyInitial = company.name?.charAt(0) || 'C';

  return (
    <div className="jd-root" style={{ background: '#f1f5f9', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div
        className="jd-hero"
        style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)', padding: '110px 0 72px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', background: 'rgba(99,102,241,.2)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '25%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(167,139,250,.15)', filter: 'blur(45px)' }} />
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <button
            className="jd-back-btn jd-hero-back-btn"
            style={{ background: 'rgba(255,255,255,.1)', border: '1.5px solid rgba(255,255,255,.2)', color: '#e2e8f0' }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={14} /> Back to Jobs
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div
        className="jd-main-wrapper"
        style={{ maxWidth: 1300, margin: '-48px auto 48px', padding: '0 24px', position: 'relative', zIndex: 2 }}
      >
        <motion.div
          className="jd-layout"
          variants={containerVariants} initial="hidden" animate="visible"
          style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}
        >

          {/* ══ LEFT COLUMN ══ */}
          <motion.div variants={itemVariants} style={{ flex: '1 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Job Header Card ── */}
            <div className="jd-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Accent bar */}
              <div style={{ height: 4, background: 'linear-gradient(90deg,#6366f1,#a5b4fc)' }} />
              <div className="jd-card-header-inner" style={{ padding: '28px' }}>
                <div
                  className="jd-job-header-row"
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}
                >
                  {/* Company logo / avatar */}
                  <div
                    className="jd-company-avatar"
                    style={{ width: 60, height: 60, borderRadius: 14, background: getGrad(companyInitial), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", flexShrink: 0, boxShadow: '0 4px 14px rgba(99,102,241,.25)' }}
                  >
                    {companyInitial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 style={{ fontSize: 'clamp(18px,3vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {job.name}
                    </h1>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {company.name}
                    </p>
                  </div>
                </div>

                {/* Status chips row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  <span className="jd-chip" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                    <MapPin size={12} />{job.city}, {job.state}
                  </span>
                  <span className="jd-chip" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <IndianRupee size={12} />{salaryText}
                  </span>
                  <span className="jd-chip" style={{ background: '#fffbeb', color: '#d97706' }}>
                    <Briefcase size={12} />{job.experience?.[0]}–{job.experience?.[1]} yrs
                  </span>
                  <span className="jd-chip" style={{ background: job.status === 'open' ? '#f0fdf4' : '#f8fafc', color: job.status === 'open' ? '#16a34a' : '#94a3b8', border: `1px solid ${job.status === 'open' ? '#bbf7d0' : '#e2e8f0'}` }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: job.status === 'open' ? '#22c55e' : '#94a3b8' }} />
                    {job.status === 'open' ? 'Actively hiring' : 'Closed'}
                  </span>
                </div>

                {/* Contact info grid */}
                <div
                  className="jd-info-grid"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 10, marginBottom: 24 }}
                >
                  {[
                    { icon: <Mail size={14} />, label: 'Email', value: job.email, color: '#0ea5e9' },
                    { icon: <Phone size={14} />, label: 'Phone', value: `${job.countryCode} ${job.phone}`, color: '#16a34a' },
                    { icon: <Calendar size={14} />, label: 'Posted', value: new Date(job.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), color: '#8b5cf6' },
                    { icon: <MapPin size={14} />, label: 'Country', value: job.country, color: '#f59e0b' },
                  ].map(({ icon, label, value, color }) => (
                    <div key={label} className="jd-info-row">
                      <span style={{ color, flexShrink: 0 }}>{icon}</span>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase', margin: 0 }}>{label}</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '2px 0 0' }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA row — hidden on mobile (replaced by sticky bar) */}
                <div className="jd-desktop-cta" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button
                    className={`jd-apply-btn ${job.applied ? 'applied' : 'active'}`}
                    onClick={!job.applied ? handleApplyJob : undefined}
                    disabled={job.applied}
                  >
                    {job.applied ? <><CheckCircle2 size={16} />Applied</> : <>Apply Now <ChevronRight size={15} /></>}
                  </button>
                  <button className="jd-share-btn" onClick={handleShare} title="Copy link">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Job Description Card ── */}
            <motion.div variants={itemVariants} className="jd-card">
              <SectionHeader icon={<FileIcon />} title="Job Description" />
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', margin: 0 }}>
                  Employer: {shopName || company.name}
                </p>
                {job.companyId && (
                  <button
                    className="jd-back-btn"
                    style={{ padding: '4px 12px', fontSize: 12, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={() => navigate(`/shop-details/${job.companyId}`)}
                  >
                    View Shop <ExternalLink size={12} />
                  </button>
                )}
              </div>
              <p className="jd-description-text" style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>
                {job.description}
              </p>
            </motion.div>

            {/* ── Requirements Card ── */}
            <motion.div variants={itemVariants} className="jd-card">
              <SectionHeader icon={<Star size={16} style={{ color: '#f59e0b' }} />} title="Requirements" />
              <motion.div
                variants={containerVariants} initial="hidden" animate="visible"
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                {job.requirements.map((req, i) => (
                  <motion.div key={i} variants={itemVariants} className="jd-req-item">
                    <CheckCircle2 size={15} style={{ color: '#6366f1', marginTop: 2, flexShrink: 0 }} />
                    {req}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ══ SIDEBAR ══ */}
          <motion.div
            className="jd-sidebar"
            variants={itemVariants}
            style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {/* Company Card */}
            <div className="jd-sidebar-card">
              <div style={{ background: 'linear-gradient(135deg,#312e81,#4f46e5)', padding: '20px 20px 16px' }}>
                <p style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Employer Details</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {companyInitial}
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{company.name}</p>
                    <p style={{ color: '#a5b4fc', fontSize: 12, margin: 0 }}>Main Branch</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: <Mail size={13} />, label: 'Email', value: company.email, color: '#0ea5e9' },
                  { icon: <Phone size={13} />, label: 'Phone', value: company.phone, color: '#16a34a' },
                  { icon: <MapPin size={13} />, label: 'Location', value: `${job.city}, ${job.state}`, color: '#6366f1' },
                  { icon: <MapPin size={13} />, label: 'Country', value: job.country, color: '#f59e0b' },
                  { icon: <Calendar size={13} />, label: 'Posted', value: new Date(job.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), color: '#8b5cf6' },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color, marginTop: 1, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase', margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', margin: '2px 0 0', wordBreak: 'break-word' }}>{value}</p>
                    </div>
                  </div>
                ))}

                <hr className="jd-divider" />

                {/* Hidden on mobile via CSS */}
                <button
                  className={`jd-apply-btn jd-sidebar-apply-btn ${job.applied ? 'applied' : 'active'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={!job.applied ? handleApplyJob : undefined}
                  disabled={job.applied}
                >
                  {job.applied ? <><CheckCircle2 size={15} />Already Applied</> : <>Apply Now <ChevronRight size={14} /></>}
                </button>

                {job.companyId && (
                  <button
                    className="jd-back-btn jd-sidebar-view-shop-btn"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '10px' }}
                    onClick={() => navigate(`/shop-details/${job.companyId}`)}
                  >
                    View Shop Details <ExternalLink size={14} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Sticky Mobile CTA Bar ── */}
      <div className="jd-mobile-cta">
        <button className="jd-share-btn" onClick={handleShare} title="Copy link" style={{ flexShrink: 0 }}>
          <Share2 size={16} />
        </button>
        {job.companyId && (
          <button
            className="jd-back-btn"
            style={{ flexShrink: 0, padding: '10px 14px', fontSize: 13 }}
            onClick={() => navigate(`/shop-details/${job.companyId}`)}
          >
            <ExternalLink size={13} /> Shop
          </button>
        )}
        <button
          className={`jd-apply-btn ${job.applied ? 'applied' : 'active'}`}
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={!job.applied ? handleApplyJob : undefined}
          disabled={job.applied}
        >
          {job.applied ? <><CheckCircle2 size={16} />Applied</> : <>Apply Now <ChevronRight size={15} /></>}
        </button>
      </div>

    </div>
  );
};

/* ─── Helpers ─── */
function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <h3 className="jd-section-title" style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</h3>
    </div>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default JobDetails;