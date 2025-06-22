import gsap from "gsap";
import Image from "next/image";
import { useState } from "react";
import ContentModal from "./basicComponents";
import { userInteraction } from "@/lib/content";

const HomeContentCards = ({
  title,
  content,
  itemWidth = "w-71",
  itemHeight = "h-40",
  showGradient = true,
  showTitle = true,
  className = "",
}) => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = async (item) => {
    setSelectedContent(item);
    setIsModalOpen(true);
    let interaction = {
      content_id: item.id,
      context_data: item,
      type: "click"
    }
    await userInteraction(interaction);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };
  function capitalizeFirstLetter(strin: string) {
    if(strin) {
    return strin.charAt(0).toUpperCase() + strin.slice(1);

    }else return "";
  }
  return (
    <>
      <div
        className={`flex flex-col font-inter text-white font-bold px-8 text-xl pb-4 ${className}`}
      >
        <h1 className="mb-4">{title}</h1>
        <div className="flex space-x-2 overflow-x-hidden overflow-y-hidden">
          {content.map((item) => (
            <div
              key={item.id}
              className={`flex-shrink-0 relative cursor-pointer ${itemWidth} ${itemHeight}`}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { scale: 1.1 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1 });
              }}
              onClick={() => handleCardClick(item)}
            >
              {item.backdrop_url && (
		<div>
                <Image
                  src={item.backdrop_url}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                />

	      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />
	      </div>
              )}
              {showGradient && (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />
              )}
              {showTitle && (
                <div className="flex flex-col absolute bottom-2 left-2 right-2">
                  <p className="font-bold font-inter text-sm truncate text-xl">
                    {capitalizeFirstLetter(item.platform)}
                  </p>
                  <p className="font-bold font-inter text-sm truncate">
                    {item.title}
                  </p>
                </div>
              )}
            </div>
          ))}
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
