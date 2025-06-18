import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ContentModal from "./basicComponents";
import { userInteraction } from "@/lib/content";

interface StreamingLayoutProps {
  data: any;
  config: {
    name: string;
  };
}

export default function StreamingLayout({
  data,
  config,
}: StreamingLayoutProps) {
  let content = data?.content || data?.results || [];
  let cl = content?.length || 0;

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

  const cardRef = useRef(null);
  const heroRef = useRef(null);

  let [currentBackdrop, setCurrentBackdrop] = useState(0);

  useGSAP(() => {
    gsap.fromTo(heroRef.current, { x: -200 }, { x: 0 });
  }, [currentBackdrop]);

  useEffect(() => {
    if (cl == 0) return;
    const interval = setInterval(() => {
      let sett = currentBackdrop + 1;
      let finalSet = sett % cl;
      setCurrentBackdrop(finalSet);
    }, 5000);
    return () => clearInterval(interval);
  }, [cl, currentBackdrop]);

  const currentContent = content[Math.max(0, currentBackdrop)];
  if (content.length == 0) {
    return (
      <div className="bg-black flex min-h-screen w-full items-center justify-center">
        <Image
          src={"./FIRE-TV-2024.svg"}
          alt="fireTV"
          width={300}
          height={300}
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <div
          className="relative h-100 mb-8 cursor-pointer"
          onClick={() => handleCardClick(currentContent)}
        >
          <Image
            src={currentContent.backdrop_url}
            alt={currentContent.title}
            ref={heroRef}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 p-4">
            <h1 className="text-white font-inter font-bold text-2xl mb-6">
              {config.name}
            </h1>
          </div>
          <div className="absolute bottom-0 p-4 z-1">
            <h1 className="text-white font-inter font-bold text-2xl mb-6">
              {content[currentBackdrop].title}
            </h1>
            <p className="font-inter text-white text-sm overflow-auto max-w-1/2">
              {content[currentBackdrop].overview}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30" />
        </div>
        <div className="px-8 pb-8">
          <h2 className="font-inter text-xl font-bold text-background">
            Popular on {config.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {content.map((c) => (
              <div
                key={c.id}
                ref={cardRef}
                className="relative cursor-pointer aspect-2/3 overflow-hidden"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.1 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1 });
                }}
                onClick={() => handleCardClick(c)}
              >
                <Image
                  src={c.poster_url}
                  alt={c.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <ContentModal
        content={selectedContent}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />
    </>
  );
}
