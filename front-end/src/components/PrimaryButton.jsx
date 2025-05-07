export default function PrimaryButton({ children, onClick }) {
    return (
      <button
        type="submit"
        onClick={onClick}
        className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition-colors"
      >
        {children}
      </button>
    );
  }