// pro-app/src/components/Testimonials.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { toast } from "react-toastify";
import { FaPlus, FaCommentAlt } from "react-icons/fa";
import { getPublicTestimonials } from "../services/testimonialService.js";
import TestimonialCard from "./testimonials/TestimonialCard.jsx";
import TestimonialModal from "./testimonials/TestimonialModal.jsx";

export default function Testimonials() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchTestimonials = async () => {
      try {
        const list = await getPublicTestimonials();
        if (mounted) setTestimonials(list);
      } catch {
        console.debug("Testimonials: failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  const handleOpenModal = () => {
    if (!user) {
      toast.info("Please log in to share your story.");
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-400 text-xs animate-pulse">
        Loading testimonials...
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto py-10 px-2 sm:px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
        <div className="w-full">
          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight bg-linear-to-r from-amber-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent wrap-break-word">
            What Members Say
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 leading-relaxed wrap-break-word">
            Real stories from members inspiring kindness.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="w-full sm:w-auto px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl text-[11px] sm:text-xs transition shadow-md flex items-center justify-center gap-1.5 shrink-0"
        >
          <FaPlus /> Share Story
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12 px-3 bg-gray-900/65 backdrop-blur-md rounded-2xl border border-dashed border-gray-800 w-full">
          <FaCommentAlt className="text-3xl text-amber-400/60 mx-auto mb-2" />
          <p className="text-gray-400 text-[11px] sm:text-xs mb-3 wrap-break-word">
            No testimonials yet — be the first to share!
          </p>
          <button
            onClick={handleOpenModal}
            className="px-3 py-1.5 bg-purple-600 text-white text-[11px] font-semibold rounded-lg hover:bg-purple-500 transition"
          >
            Submit Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {testimonials.map((t) => (
            <TestimonialCard key={t._id} testimonial={t} />
          ))}
        </div>
      )}

      <TestimonialModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
