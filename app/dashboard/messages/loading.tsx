export default function MessagesLoading() {
  return (
    <div className="bg-gray-50 h-[calc(100vh-64px)] flex animate-pulse">
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="h-6 w-28 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <div className="flex-1 divide-y divide-gray-50">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3.5">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
        <div className="h-16 w-16 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}
