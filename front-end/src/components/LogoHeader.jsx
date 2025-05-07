export default function LogoHeader() {
  return (
    <div className="flex justify-center items-center gap-2 mb-4 sm:mt-8 sm:mb-6">
      <img
        src="/Unisabana-logo.png"
        alt="Logo Universidad de La Sabana"
        className="w-8 h-8 sm:w-10 sm:h-10"
      />
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
        Comida Sabana
      </h2>
    </div>
  );
}