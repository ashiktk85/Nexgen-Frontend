import { useEffect } from "react";
import { Link } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";

const APP_NAME = "Techpath";
const SUPPORT_EMAIL = "techpath786@gmail.com";

function TermsOfService() {
  useEffect(() => {
    document.title = `${APP_NAME} | Terms & Conditions`;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white font-rubik text-gray-800">
      <main
        id="main-content"
        className="mx-auto w-full max-w-[800px] flex-1 px-4 pt-24 pb-10 sm:px-6 sm:pt-28 sm:pb-14 lg:px-8"
      >
        <p className="mb-6">
          <Link
            to="/"
            className="text-sm text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            &larr; Back to home
          </Link>
        </p>

        <header className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            {APP_NAME}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last Updated: July 2026</p>
        </header>

        <div className="space-y-8 text-base leading-relaxed text-gray-700">
          <section aria-labelledby="terms-intro">
            <h2 id="terms-intro" className="mb-3 text-xl font-semibold text-gray-900">
              1. Introduction
            </h2>
            <p>
              These Terms &amp; Conditions govern your access to and use of {APP_NAME},
              a job platform that connects job seekers with employers and shop owners.
              By registering, browsing jobs, posting jobs, or applying for positions,
              you agree to these terms. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section aria-labelledby="terms-eligibility">
            <h2 id="terms-eligibility" className="mb-3 text-xl font-semibold text-gray-900">
              2. Eligibility
            </h2>
            <p>
              You must be at least 18 years old and legally able to enter into a binding
              agreement to use {APP_NAME}. Employers and shop owners must provide accurate
              business and contact information when posting jobs.
            </p>
          </section>

          <section aria-labelledby="terms-jobseekers">
            <h2 id="terms-jobseekers" className="mb-3 text-xl font-semibold text-gray-900">
              3. Job Seeker Responsibilities
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide truthful information in your profile and job applications.</li>
              <li>Upload only resumes and documents you are authorized to share.</li>
              <li>Communicate respectfully with employers and shop owners.</li>
              <li>Do not misuse the platform for spam, fraud, or misleading applications.</li>
            </ul>
          </section>

          <section aria-labelledby="terms-employers">
            <h2 id="terms-employers" className="mb-3 text-xl font-semibold text-gray-900">
              4. Employer &amp; Shop Owner Responsibilities
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Post accurate job descriptions, locations, and compensation details.</li>
              <li>Review applications in good faith and contact suitable candidates.</li>
              <li>Comply with applicable employment and labour laws in your jurisdiction.</li>
              <li>Do not discriminate unlawfully or post misleading job listings.</li>
            </ul>
          </section>

          <section aria-labelledby="terms-compliance">
            <h2 id="terms-compliance" className="mb-3 text-xl font-semibold text-gray-900">
              5. Acceptable Use
            </h2>
            <p>
              You must comply with all applicable local, national, and international laws.
              You are responsible for your account activity and for maintaining the security
              of your login credentials. Unauthorized use of another person&apos;s account is prohibited.
            </p>
          </section>

          <section aria-labelledby="terms-as-is">
            <h2 id="terms-as-is" className="mb-3 text-xl font-semibold text-gray-900">
              6. Disclaimer of Warranties
            </h2>
            <p>
              {APP_NAME} is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties
              of any kind. We do not guarantee job placement, hiring outcomes, or uninterrupted
              service. {APP_NAME} is a connection platform and is not a party to employment
              agreements between users and employers.
            </p>
          </section>

          <section aria-labelledby="terms-modifications">
            <h2 id="terms-modifications" className="mb-3 text-xl font-semibold text-gray-900">
              7. Service Changes
            </h2>
            <p>
              We may modify, suspend, or discontinue any part of the platform at any time
              without prior notice. We are not liable for any modification, suspension, or
              discontinuation of the service.
            </p>
          </section>

          <section aria-labelledby="terms-account">
            <h2 id="terms-account" className="mb-3 text-xl font-semibold text-gray-900">
              8. Account Activity
            </h2>
            <p>
              You are solely responsible for all activity under your account. Notify us promptly
              of any unauthorized use or security breach. We may suspend or terminate accounts
              that violate these terms.
            </p>
          </section>

          <section aria-labelledby="terms-updates">
            <h2 id="terms-updates" className="mb-3 text-xl font-semibold text-gray-900">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these Terms &amp; Conditions from time to time. Continued use after
              changes are posted constitutes acceptance of the updated terms. Please review
              this page periodically.
            </p>
          </section>

          <section aria-labelledby="terms-contact">
            <h2 id="terms-contact" className="mb-3 text-xl font-semibold text-gray-900">
              10. Contact Us
            </h2>
            <p>
              For questions about these Terms &amp; Conditions, contact us at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="terms-related">
            <h2 id="terms-related" className="mb-3 text-xl font-semibold text-gray-900">
              Related Documents
            </h2>
            <p>
              Please also review our{" "}
              <Link
                to="/privacy"
                className="text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}

export default TermsOfService;
