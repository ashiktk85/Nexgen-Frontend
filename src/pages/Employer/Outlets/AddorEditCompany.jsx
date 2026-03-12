import React, { useState } from "react";
import CompanyForm from "@/components/Employer/CompanyForm";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const AddorEditCompany = () => {
  const { companyId } = useParams();
  const location = useLocation();
  const [company] = useState(location.state?.company || null);
  const isEdit = Boolean(company);

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", padding: "24px", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');`}</style>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .4, ease: "easeOut" }}
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* ── Page heading ── */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", letterSpacing: ".09em", textTransform: "uppercase", margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Employer Dashboard
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#a855f7,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(168,85,247,.28)" }}>
              <Building2 size={17} color="#fff" />
            </div>
            <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {isEdit ? "Edit Shop" : "Add Shop"}
            </h1>
          </div>
        </div>

        {/* ── Form card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .38, delay: .08, ease: "easeOut" }}
          style={{ background: "#fff", border: "1.5px solid #e8edf5", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.04)" }}
        >
          {/* Accent bar */}
          <div style={{ height: 3, background: "linear-gradient(90deg,#a855f7,#c084fc,#e879f9)" }} />
          <div style={{ padding: "28px 28px 32px" }}>
            <CompanyForm company={company} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddorEditCompany;