import { Link } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";

const SUPPORT_EMAIL = "techpath786@gmail.com";

function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last Updated: June 2026</p>
        </header>

        <div className="space-y-8 text-base leading-relaxed text-gray-700">
          <section aria-labelledby="privacy-intro">
            <h2 id="privacy-intro" className="mb-3 text-xl font-semibold text-gray-900">
              Introduction
            </h2>
            <p>
              This Privacy Policy describes how we collect, use, and protect your
              information when you use our application. We are committed to
              handling your personal data responsibly and transparently.
            </p>
          </section>

          <section aria-labelledby="privacy-authentication">
            <h2
              id="privacy-authentication"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Authentication
            </h2>
            <p>
              The application uses Google Sign-In for authentication. When you
              sign in with Google, we receive information from your Google
              account as permitted by you during the sign-in process.
            </p>
          </section>

          <section aria-labelledby="privacy-collection">
            <h2
              id="privacy-collection"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Information We Collect
            </h2>
            <p className="mb-3">
              We may collect the following information provided by Google:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Profile information associated with your Google account</li>
            </ul>
          </section>

          <section aria-labelledby="privacy-use">
            <h2 id="privacy-use" className="mb-3 text-xl font-semibold text-gray-900">
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect only for authentication and
              providing access to the application. We do not use your personal
              information for unrelated purposes without your consent.
            </p>
          </section>

          <section aria-labelledby="privacy-sharing">
            <h2
              id="privacy-sharing"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Information Sharing
            </h2>
            <p className="mb-3">
              We do not sell your personal information. Your data may be
              disclosed only when required by law, such as in response to a
              valid legal request or to comply with applicable regulations.
            </p>
            <p>
              We do not share your information with third parties for marketing
              or advertising purposes.
            </p>
          </section>

          <section aria-labelledby="privacy-contact">
            <h2
              id="privacy-contact"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy or how
              we handle your data, please contact us at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="privacy-related">
            <h2
              id="privacy-related"
              className="mb-3 text-xl font-semibold text-gray-900"
            >
              Related Documents
            </h2>
            <p>
              Please also review our{" "}
              <Link
                to="/terms"
                className="text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Terms of Service
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

export default PrivacyPolicy;
