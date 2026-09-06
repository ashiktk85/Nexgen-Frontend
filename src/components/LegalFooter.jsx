import { Link } from "react-router-dom";
import { TECHPATH_CONTACT_PHONE_DISPLAY, TECHPATH_WHATSAPP_URL } from "@/constants/contact";

function LegalFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-6 mt-auto">
      <div className="mx-auto flex max-w-[800px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Techpath. All rights reserved.
        </p>
        <nav aria-label="Legal and contact">
          <ul className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <li>
              <a
                href={TECHPATH_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Contact: {TECHPATH_CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li aria-hidden="true" className="text-gray-300">
              |
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-gray-600 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Privacy Policy
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300">
              |
            </li>
            <li>
              <Link
                to="/terms"
                className="text-gray-600 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default LegalFooter;
