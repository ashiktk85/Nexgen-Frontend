import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import userAxiosInstance from '@/config/axiosConfig/userAxiosInstance';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  MapPin, Phone, Briefcase,
  CheckCircle2, ArrowLeft,
  ChevronRight, ExternalLink, Bookmark, ChevronDown, ChevronUp,
} from 'lucide-react';
import { buildTelHref, formatPhoneDisplay } from '@/utils/phone';
import JobWhatsAppButton from '@/components/common/JobWhatsAppButton';
import { formatSalary } from '@/utils/formatSalary';
import { formatJobLocation } from '@/utils/formatLocation';
import JobShareButton from '@/components/common/JobShareButton';

if (!document.getElementById('jd-li-styles')) {
  const s = document.createElement('style');
  s.id = 'jd-li-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

    .jd-li-root {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: #f3f2ef;
      min-height: 100vh;
      padding: 0 0 100px;
      overflow-x: hidden;
    }

    .jd-li-hero {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
      padding: 110px 0 72px;
      position: relative;
      overflow: hidden;
      max-width: 100vw;
    }
    .jd-li-hero-glow-1 {
      position: absolute; top: -40px; right: 0;
      width: 180px; height: 180px; border-radius: 50%;
      background: rgba(99,102,241,0.25); filter: blur(50px);
      transform: translateX(40%);
    }
    .jd-li-hero-glow-2 {
      position: absolute; bottom: -20px; left: 30%;
      width: 150px; height: 150px; border-radius: 50%;
      background: rgba(167,139,250,0.15); filter: blur(40px);
    }
    .jd-li-hero-inner {
      max-width: 1128px; margin: 0 auto; padding: 0 16px;
      position: relative; z-index: 1;
    }
    .jd-li-hero-back {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 0; margin-bottom: 20px; border: none; background: none;
      color: #c7d2fe; font-size: 14px; font-weight: 600; cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: color 0.15s ease;
    }
    .jd-li-hero-back:hover { color: #fff; text-decoration: underline; }
    .jd-li-hero-label {
      color: #a5b4fc; font-size: 13px; font-weight: 500;
      margin: 0 0 6px; letter-spacing: 0.05em; text-transform: uppercase;
    }
    .jd-li-hero-title {
      color: #fff; font-size: clamp(20px, 4vw, 32px);
      font-weight: 800; margin: 0; letter-spacing: -0.02em;
      line-height: 1.25;
    }
    .jd-li-hero-sub {
      color: #c7d2fe; font-size: 14px; margin: 8px 0 0; font-weight: 400;
    }

    .jd-li-main-wrap {
      margin-top: -52px;
      position: relative;
      z-index: 2;
    }
    .jd-li-root h1, .jd-li-root h2, .jd-li-root h3 {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }

    .jd-li-container {
      max-width: 1128px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .jd-li-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 0;
      margin-bottom: 16px;
      border: none;
      background: none;
      color: #0a66c2;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .jd-li-back:hover { text-decoration: underline; }

    .jd-li-layout {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }

    .jd-li-main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .jd-li-sidebar {
      width: 300px;
      flex-shrink: 0;
      position: sticky;
      top: 24px;
    }

    .jd-li-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 8px;
    }

    .jd-li-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      background: #e8f4fc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0a66c2;
      margin-bottom: 16px;
    }

    .jd-li-title {
      font-size: 28px;
      font-weight: 600;
      color: rgba(0,0,0,.9);
      margin: 0 0 8px;
      line-height: 1.25;
      letter-spacing: -0.02em;
    }

    .jd-li-subline {
      font-size: 14px;
      color: rgba(0,0,0,.6);
      margin: 0 0 4px;
      line-height: 1.5;
    }
    .jd-li-subline a, .jd-li-company-link {
      color: #0a66c2;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font-size: inherit;
      font-family: inherit;
    }
    .jd-li-company-link:hover { text-decoration: underline; }

    .jd-li-status {
      font-size: 14px;
      font-weight: 600;
      color: #057642;
      margin: 8px 0 20px;
    }

    .jd-li-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .jd-li-btn-apply {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 24px;
      border-radius: 24px;
      border: none;
      background: #0a66c2;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: background .15s;
    }
    .jd-li-btn-apply:hover:not(:disabled) { background: #004182; }
    .jd-li-btn-apply:disabled {
      background: #e0e0e0;
      color: #666;
      cursor: not-allowed;
    }

    .jd-li-btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      border-radius: 24px;
      border: 1.5px solid #0a66c2;
      background: #fff;
      color: #0a66c2;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: background .15s, border-color .15s;
    }
    .jd-li-btn-outline:hover {
      background: #ebf3f8;
      border-color: #004182;
      color: #004182;
    }

    .jd-li-meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px 24px;
    }
    .jd-li-meta-item label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: rgba(0,0,0,.9);
      margin-bottom: 4px;
    }
    .jd-li-meta-item span {
      font-size: 14px;
      color: rgba(0,0,0,.6);
      line-height: 1.4;
    }

    .jd-li-section-title {
      font-size: 20px;
      font-weight: 600;
      color: rgba(0,0,0,.9);
      margin: 0 0 16px;
    }

    .jd-li-description {
      font-size: 14px;
      color: rgba(0,0,0,.75);
      line-height: 1.6;
      white-space: pre-wrap;
      margin: 0;
    }

    .jd-li-show-more {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 12px;
      border: none;
      background: none;
      color: rgba(0,0,0,.6);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      font-family: inherit;
    }
    .jd-li-show-more:hover { color: #0a66c2; }

    .jd-li-req-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .jd-li-req-list li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 14px;
      color: rgba(0,0,0,.75);
      line-height: 1.5;
    }
    .jd-li-req-list li::before {
      content: '•';
      color: #0a66c2;
      font-weight: bold;
      flex-shrink: 0;
    }

    /* Company sidebar card */
    .jd-li-company-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .jd-li-company-header h3 {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0,0,0,.9);
      margin: 0;
    }

    .jd-li-company-row {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .jd-li-company-logo {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      flex-shrink: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .jd-li-company-name {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0,0,0,.9);
      margin: 0 0 4px;
    }
    .jd-li-company-meta {
      font-size: 12px;
      color: rgba(0,0,0,.6);
      margin: 0;
      line-height: 1.4;
    }

    .jd-li-company-bio {
      font-size: 14px;
      color: rgba(0,0,0,.75);
      line-height: 1.5;
      margin: 0 0 16px;
    }

    .jd-li-skeleton {
      background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
      background-size: 200% 100%;
      animation: jd-li-shimmer 1.4s ease-in-out infinite;
      border-radius: 6px;
    }
    @keyframes jd-li-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .jd-li-mobile-cta {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 100;
      background: #fff;
      border-top: 1px solid #e0e0e0;
      padding: 12px 16px;
      gap: 8px;
      align-items: center;
      box-shadow: 0 -2px 12px rgba(0,0,0,.08);
    }

    @media (max-width: 900px) {
      .jd-li-layout { flex-direction: column; }
      .jd-li-sidebar {
        width: 100%;
        position: static;
      }
      .jd-li-meta-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .jd-li-root { padding-bottom: 88px; }
      .jd-li-hero { padding: 92px 0 48px; }
      .jd-li-title { font-size: 22px; }
      .jd-li-card { padding: 16px; }
      .jd-li-meta-grid { grid-template-columns: 1fr; }
      .jd-li-desktop-actions { display: none !important; }
      .jd-li-mobile-cta { display: flex !important; }
      .jd-li-actions { flex-direction: column; align-items: stretch; }
      .jd-li-btn-apply, .jd-li-btn-outline { width: 100%; justify-content: center; }
    }
  `;
  document.head.appendChild(s);
}

const getGrad = (ch = 'A') => {
  const gs = [
    'linear-gradient(135deg,#0a66c2,#378fe9)',
    'linear-gradient(135deg,#057642,#10b981)',
    'linear-gradient(135deg,#915907,#f59e0b)',
    'linear-gradient(135deg,#5f3dc4,#818cf8)',
  ];
  return gs[((ch.toUpperCase().charCodeAt(0) - 65) % gs.length + gs.length) % gs.length];
};

const DESC_PREVIEW_LEN = 380;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const JobDetailsSkeleton = () => (
  <div className="jd-li-layout">
    <div className="jd-li-main">
      <motion.div variants={itemVariants} className="jd-li-card">
        <div className="jd-li-skeleton" style={{ width: 48, height: 48, borderRadius: 8, marginBottom: 16 }} />
        <div className="jd-li-skeleton" style={{ width: '70%', height: 28, marginBottom: 10 }} />
        <div className="jd-li-skeleton" style={{ width: '45%', height: 16, marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="jd-li-skeleton" style={{ width: 100, height: 40, borderRadius: 24 }} />
          <div className="jd-li-skeleton" style={{ width: 80, height: 40, borderRadius: 24 }} />
          <div className="jd-li-skeleton" style={{ width: 80, height: 40, borderRadius: 24 }} />
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="jd-li-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <div className="jd-li-skeleton" style={{ width: '60%', height: 12, marginBottom: 6 }} />
              <div className="jd-li-skeleton" style={{ width: '80%', height: 16 }} />
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="jd-li-card">
        <div className="jd-li-skeleton" style={{ width: 140, height: 20, marginBottom: 16 }} />
        <div className="jd-li-skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
        <div className="jd-li-skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
        <div className="jd-li-skeleton" style={{ width: '85%', height: 14 }} />
      </motion.div>
    </div>
    <motion.aside variants={itemVariants} className="jd-li-sidebar">
      <div className="jd-li-card">
        <div className="jd-li-skeleton" style={{ width: 160, height: 18, marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div className="jd-li-skeleton" style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="jd-li-skeleton" style={{ width: '70%', height: 16, marginBottom: 6 }} />
            <div className="jd-li-skeleton" style={{ width: '50%', height: 12 }} />
          </div>
        </div>
        <div className="jd-li-skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
        <div className="jd-li-skeleton" style={{ width: '90%', height: 14, marginBottom: 16 }} />
        <div className="jd-li-skeleton" style={{ width: '100%', height: 40, borderRadius: 24 }} />
      </div>
    </motion.aside>
  </div>
);

const JobDetails = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [shopName, setShopName] = useState('');
  const [descExpanded, setDescExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const user = useSelector((state) => state.user.seekerInfo);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setJob(null);
      setCompany(null);
      setShopName('');
      try {
        const { data } = await userAxiosInstance.get(`/job-details/${id}`, {
          params: { userId: user?.userId },
        });
        setJob(data.jobDetails);
        setCompany(data.employerDetails);

        if (data.jobDetails.companyId) {
          try {
            const { data: companyData } = await userAxiosInstance.get(
              `/shop-details/${data.jobDetails.companyId}`
            );
            setShopName(companyData.shop.companyName);
          } catch (err) {
            console.error('Error fetching shop name:', err);
          }
        }
      } catch (error) {
        toast.warning(error.response?.data?.message || 'An error occurred');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, user?.userId]);

  const handleApplyJob = () => {
    navigate(`/job-application/${id}`, {
      state: {
        jobTitle: job?.name,
        companyName: company?.name,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: company?.employerId,
      },
    });
  };

  const displayCompany = shopName || company?.name;
  const locationLine = job ? formatJobLocation(job) : '';
  const heroSubtitle = loading
    ? 'Fetching role details, requirements, and company info…'
    : [displayCompany, locationLine].filter(Boolean).join(' · ');

  if (!loading && (!job || !company)) return null;

  const salaryText = !job ? '' : formatSalary({ salary: job.salary, salaryDisplay: job.salaryDisplay, salaryRange: job.salary });

  const companyInitial = (shopName || company?.name)?.charAt(0) || 'C';
  const postedAgo = job?.postedAt
    ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })
    : '';
  const isLongDesc = (job?.description || '').length > DESC_PREVIEW_LEN;
  const descriptionText = !job
    ? ''
    : isLongDesc && !descExpanded
      ? `${job.description.slice(0, DESC_PREVIEW_LEN).trim()}…`
      : job.description;

  return (
    <motion.div
      className="jd-li-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero banner — matches All Jobs page */}
      <div className="jd-li-hero">
        <div className="jd-li-hero-glow-1" />
        <div className="jd-li-hero-glow-2" />
        <div className="jd-li-hero-inner">
          <button type="button" className="jd-li-hero-back" onClick={() => navigate("/all-jobs")}>
            <ArrowLeft size={16} /> Back to jobs
          </button>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="jd-li-hero-label">Job opportunity</p>
            {loading ? (
              <>
                <div className="jd-li-skeleton" style={{ width: 'min(480px, 85%)', height: 32, marginBottom: 10, opacity: 0.35 }} />
                <p className="jd-li-hero-sub">{heroSubtitle}</p>
              </>
            ) : (
              <>
                <h1 className="jd-li-hero-title">{job.name}</h1>
                <p className="jd-li-hero-sub">{heroSubtitle}</p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <div className="jd-li-container jd-li-main-wrap">
        {loading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <JobDetailsSkeleton />
          </motion.div>
        ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="jd-li-layout"
        >
          {/* ── Main column ── */}
          <motion.div variants={itemVariants} className="jd-li-main">
            {/* Header card */}
            <div className="jd-li-card">
              <div className="jd-li-icon-box">
                <Briefcase size={24} />
              </div>

              <h1 className="jd-li-title">{job.name}</h1>

              <p className="jd-li-subline">
                <button
                  type="button"
                  className="jd-li-company-link"
                  onClick={() => job.companyId && navigate(`/shop-details/${job.companyId}`)}
                >
                  {displayCompany}
                </button>
                {locationLine && (
                  <>
                    {' · '}
                    {locationLine}
                  </>
                )}
                {postedAgo && <> · {postedAgo}</>}
              </p>

              {job.status === 'open' && (
                <p className="jd-li-status">Actively hiring</p>
              )}

              <div className="jd-li-actions jd-li-desktop-actions">
                <button
                  type="button"
                  className="jd-li-btn-apply"
                  onClick={!job.applied ? handleApplyJob : undefined}
                  disabled={job.applied}
                >
                  {job.applied ? (
                    <>
                      <CheckCircle2 size={18} /> Applied
                    </>
                  ) : (
                    <>
                      Apply
                      <ExternalLink size={16} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="jd-li-btn-outline"
                  onClick={() => setSaved((s) => !s)}
                >
                  <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save'}
                </button>
                <JobShareButton
                  job={{ ...job, jobTitle: job.name, companyName: displayCompany }}
                  jobId={id}
                  label="Share"
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="jd-li-card">
              <div className="jd-li-meta-grid">
                <div className="jd-li-meta-item">
                  <label>Experience</label>
                  <span>
                    {job.experience?.[0]}–{job.experience?.[job.experience?.length - 1]} years
                  </span>
                </div>
                <div className="jd-li-meta-item">
                  <label>Employment type</label>
                  <span>Full-time</span>
                </div>
                <div className="jd-li-meta-item">
                  <label>Salary</label>
                  <span>{salaryText}</span>
                </div>
                <div className="jd-li-meta-item">
                  <label>Job function</label>
                  <span>{job.requirements?.slice(0, 2).join(', ') || 'Mobile Repair'}</span>
                </div>
                <div className="jd-li-meta-item">
                  <label>Location</label>
                  <span>{locationLine || job.country}</span>
                </div>
                <div className="jd-li-meta-item">
                  <label>Status</label>
                  <span>{job.status === 'open' ? 'Open' : 'Closed'}</span>
                </div>
                {job.workingTime && (
                  <div className="jd-li-meta-item">
                    <label>Working time</label>
                    <span>{job.workingTime}</span>
                  </div>
                )}
                {job.workingDays && (
                  <div className="jd-li-meta-item">
                    <label>Working days</label>
                    <span>{job.workingDays}</span>
                  </div>
                )}
                {job.holiday && (
                  <div className="jd-li-meta-item">
                    <label>Holiday</label>
                    <span>{job.holiday}</span>
                  </div>
                )}
                {job.roomAvailable && (
                  <div className="jd-li-meta-item">
                    <label>Room available</label>
                    <span>{job.roomAvailable}</span>
                  </div>
                )}
                {job.foodAvailable && (
                  <div className="jd-li-meta-item">
                    <label>Food available</label>
                    <span>{job.foodAvailable}</span>
                  </div>
                )}
                {job.incentive && (
                  <div className="jd-li-meta-item">
                    <label>Incentive</label>
                    <span>{job.incentive}</span>
                  </div>
                )}
                {job.probationPeriod && (
                  <div className="jd-li-meta-item">
                    <label>Probation</label>
                    <span>{job.probationPeriod}</span>
                  </div>
                )}
              </div>
            </div>

            {/* About the job */}
            {job.description && (
              <div className="jd-li-card">
                <h2 className="jd-li-section-title">About the job</h2>
                <p className="jd-li-description">{descriptionText}</p>
                {isLongDesc && (
                  <button
                    type="button"
                    className="jd-li-show-more"
                    onClick={() => setDescExpanded((e) => !e)}
                  >
                    {descExpanded ? (
                      <>
                        Show less <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="jd-li-card">
                <h2 className="jd-li-section-title">Requirements</h2>
                <ul className="jd-li-req-list">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shop location */}
            {job.shopLocation?.address && (
              <div className="jd-li-card">
                <h2 className="jd-li-section-title">Shop location</h2>
                {job.shopLocation.companyName && (
                  <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 6px', color: 'rgba(0,0,0,.9)' }}>
                    {job.shopLocation.companyName}
                  </p>
                )}
                <p className="jd-li-description" style={{ marginBottom: 12 }}>
                  <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4, color: '#0a66c2' }} />
                  {job.shopLocation.address}
                </p>
                {job.companyId && (
                  <button
                    type="button"
                    className="jd-li-btn-outline"
                    style={{ fontSize: 14, padding: '8px 16px' }}
                    onClick={() => navigate(`/shop-details/${job.companyId}`)}
                  >
                    View shop <ExternalLink size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Contact phone + WhatsApp (job post contact only — no employer email) */}
            {job.phone && buildTelHref(job.phone, job.countryCode) && (
              <div className="jd-li-card">
                <h2 className="jd-li-section-title">Contact</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                  <a
                    href={buildTelHref(job.phone, job.countryCode)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0a66c2', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}
                  >
                    <Phone size={16} />
                    {formatPhoneDisplay(job.phone, job.countryCode)}
                  </a>
                  <JobWhatsAppButton
                    phone={job.phone}
                    countryCode={job.countryCode}
                    jobTitle={job.name}
                    companyName={displayCompany}
                    size={38}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Right sidebar: About the company ── */}
          <motion.aside variants={itemVariants} className="jd-li-sidebar">
            <div className="jd-li-card">
              <div className="jd-li-company-header">
                <h3>About the company</h3>
              </div>

              <div className="jd-li-company-row">
                <div
                  className="jd-li-company-logo"
                  style={{ background: getGrad(companyInitial) }}
                >
                  {companyInitial}
                </div>
                <div>
                  <p className="jd-li-company-name">{displayCompany}</p>
                  <p className="jd-li-company-meta">
                    Mobile Repair &amp; Service
                    <br />
                    {locationLine}
                  </p>
                </div>
              </div>

              <p className="jd-li-company-bio">
                {displayCompany} is hiring for this role in {job.city || 'your area'}.
                {job.shopLocation?.address
                  ? ` Shop located at ${job.shopLocation.address}.`
                  : ''}
              </p>

              {company.phone && buildTelHref(company.phone, job.countryCode) && (
                <p className="jd-li-company-meta" style={{ marginBottom: 12 }}>
                  <Phone size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  <a
                    href={buildTelHref(company.phone, job.countryCode)}
                    style={{ color: '#0a66c2', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {formatPhoneDisplay(company.phone, job.countryCode)}
                  </a>
                </p>
              )}

              {job.companyId && (
                <button
                  type="button"
                  className="jd-li-btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate(`/shop-details/${job.companyId}`)}
                >
                  Visit shop <ExternalLink size={14} />
                </button>
              )}
            </div>
          </motion.aside>
        </motion.div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      {!loading && (
      <div className="jd-li-mobile-cta">
        <JobShareButton
          job={{ ...job, jobTitle: job.name, companyName: displayCompany }}
          jobId={id}
          compact
          iconOnly
        />
        <button
          type="button"
          className="jd-li-btn-apply"
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={!job.applied ? handleApplyJob : undefined}
          disabled={job.applied}
        >
          {job.applied ? (
            <>
              <CheckCircle2 size={16} /> Applied
            </>
          ) : (
            <>
              Apply <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
      )}
    </motion.div>
  );
};

export default JobDetails;
