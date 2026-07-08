import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ApplicationConfirmation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-background pt-20 sm:pt-24 px-4"
    >
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-2xl mx-auto py-10 sm:py-12"
      >
        <div className="space-y-8 text-center">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-center">
              <FaCheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 leading-relaxed max-w-lg mx-auto">
              Your application has been submitted successfully. The shop owner will contact you shortly if your profile matches the job requirements.
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3 pt-2">
            <h2 className="text-lg font-semibold">What happens next?</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              You can track all your applications anytime from your job application history.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              to="/job-application-history"
              className="inline-flex items-center justify-center text-white bg-primary hover:bg-[#07407d] font-medium rounded-full text-sm px-8 py-2.5 transition-colors"
            >
              View my applications
            </Link>
            <Link
              to="/all-jobs"
              className="inline-flex items-center justify-center border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-full text-sm px-8 py-2.5 transition-colors"
            >
              Browse more jobs
            </Link>
          </motion.div>
        </div>
      </motion.main>
    </motion.div>
  );
}
