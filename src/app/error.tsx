"use client"

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-white">

      <h1 className="text-2xl font-bold mb-4">
        Something went wrong
      </h1>

      <p className="text-slate-400 mb-6">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-indigo-600 rounded-xl"
      >
        Try again
      </button>

    </div>
  )
}