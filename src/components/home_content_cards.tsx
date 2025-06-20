import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";
import ContentModal from "./basicComponents";
import { userInteraction } from "@/lib/content";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "tailwind-scrollbar-hide";

const HomeContentCards = ({
  title,
  content,
  itemWidth = "w-72", // standard card width
  itemHeight = "h-40",
  showGradient = true,
  showTitle = true,
  className = "",
}) => {
  const scrollRef = useRef(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleCardClick = async (item) => {
    setSelectedContent(item);
    setIsModalOpen(true);
    let interaction = {
      content_id: item.id,
      context_data: item,
      type: "click",
    };
    await userInteraction(interaction);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  const scrollLeft = () => {
    const container = scrollRef.current;
    container.scrollBy({ left: -container.offsetWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    container.scrollBy({ left: container.offsetWidth, behavior: "smooth" });
  };

  return (
    <>
      <div
        className={`relative group font-inter text-white font-bold px-8 text-xl pb-4 ${className}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <h1 className="mb-4">{title}</h1>
        {/* Scroll Container */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth transition-all duration-300"
          >
            {content.map((item) => (
              <div
                key={item.id}
                className={`flex-shrink-0 relative cursor-pointer ${itemWidth} ${itemHeight}`}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1 })}
                onClick={() => handleCardClick(item)}
              >
                {item.backdrop_url && (
                  <Image
                    src={item.backdrop_url}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                )}
                {showGradient && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />
                )}
                {showTitle && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="font-bold font-inter text-sm truncate">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          {hovering && (
            <button
              onClick={scrollLeft}
              className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Arrow */}
          {hovering && (
            <button
              onClick={scrollRight}
              className="absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      <ContentModal
        content={selectedContent}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />
    </>
  );
};

export default HomeContentCards;
