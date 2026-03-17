import LoaderOne from "./LoaderOne.jsx";

function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <LoaderOne />
        <p className="text-sm font-medium text-muted-foreground">
          Loading Nexgen, please wait...
        </p>
      </div>
    </div>
  );
}

export default FullPageLoader;

