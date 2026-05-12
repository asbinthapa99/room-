export default function DashboardLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-8 w-36 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-100 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-card p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gray-200" />
              <div className="space-y-2">
                <div className="h-6 w-8 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 h-16 bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
