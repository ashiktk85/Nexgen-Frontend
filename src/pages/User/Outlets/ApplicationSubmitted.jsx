import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"
// import Navbar from "../components/User/Navbar";


export default function ApplicationConfirmation() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <Navbar/> */}

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto py-12 px-4">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Your Application Has Been
            </h1>
            <p className="text-2xl font-semibold text-primary">Submitted!</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center text-sm">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
              <p>
                You will get an email confirmation at{" "}
                <span className="font-medium">Philip.Mayo@gmail.com</span>
              </p>
            </div>

            <div className="flex items-center gap-2 justify-center text-sm">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
              <p>
                This employer typically responds to applications within 1 day
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-semibold">
              Keep track of your applications
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You will receive a status update in an email from Jobber within a
              few weeks of submitting your application. In the meantime, you can
              view and track all your applications in the Jobber My jobs section
              at any time.
            </p>
          </div>
          <button
            type="button"
            class="text-white mt-6 bg-[#000080] hover:bg-[#001F3F] focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-10 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Link to="/all-jobs">Return to job search</Link>
          </button>
        </div>
      </main>
    </div>
  );
}
