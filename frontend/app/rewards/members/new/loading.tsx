export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded mt-4"></div>
      </div>

      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-end mt-6">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

