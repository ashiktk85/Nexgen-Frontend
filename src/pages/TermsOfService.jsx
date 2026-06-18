import { Link } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";

const SUPPORT_EMAIL = "techpath786@gmail.com";

function TermsOfService() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-rubik text-gray-800">
      <main
        id="main-content"
        className="mx-auto w-full max-w-[800px] flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last Updated: June 2026</p>
        </header>

        <div className="space-y-8 text-base leading-relaxed text-gray-700">
          <section aria-labelledby="terms-intro">
            <h2 id="terms-intro" className="mb-3 text-xl font-semibold text-gray-900">
              Introduction
            </h2>
            <p>
              These Terms of Service govern your access to and use of our
              application. By using the service, you agree to be bound by these
              terms. If you do not agree, please do not use the application.
            </p>
          </section>

          <section aria-labelledby="terms-compliance">
            <h2
              id="terms-compliance"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              User Responsibilities
            </h2>
            <p>
              You must comply with all applicable local, national, and
              international laws and regulations when using this service. You are
              responsible for your account activity and for maintaining the
              security of your login credentials.
            </p>
          </section>

          <section aria-labelledby="terms-as-is">
            <h2 id="terms-as-is" className="mb-3 text-xl font-semibold text-gray-900">
              Disclaimer of Warranties
            </h2>
            <p>
              The service is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, whether express
              or implied. We do not guarantee that the service will be
              uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section aria-labelledby="terms-modifications">
            <h2
              id="terms-modifications"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Service Changes
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the
              service, or any part of it, at any time without prior notice. We
              are not liable to you or any third party for any modification,
              suspension, or discontinuation of the service.
            </p>
          </section>

          <section aria-labelledby="terms-account">
            <h2
              id="terms-account"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Account Activity
            </h2>
            <p>
              You are solely responsible for all activity that occurs under
              your account. You agree to notify us promptly of any unauthorized
              use of your account or any other breach of security.
            </p>
          </section>

          <section aria-labelledby="terms-updates">
            <h2
              id="terms-updates"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of the service after changes are posted constitutes your
              acceptance of the updated terms. We encourage you to review these
              terms periodically.
            </p>
          </section>

          <section aria-labelledby="terms-contact">
            <h2
              id="terms-contact"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at{" "}
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
            <h2
              id="terms-related"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
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
