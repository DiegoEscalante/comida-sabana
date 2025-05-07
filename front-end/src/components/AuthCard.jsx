export default function AuthCard({ title, children }) {
  return (
    <div className="w-full max-w-sm bg-gray-200 rounded-lg shadow-md px-4 sm:px-6 py-3 sm:py-4 min-h-[350px] sm:min-h-[460px] md:min-h-[440px] flex flex-col justify-center gap-3 sm:gap-4 mb-6">
      
      <div className="mb-2">
        <h3 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mt-0 mb-2 sm:mb-3">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}