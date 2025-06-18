"use client";
import gsap from "gsap";
import { Earth, Theater, Timer } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

const ContentModal = ({ content, isOpen, onClose }) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.set(modalRef.current, { display: "flex" });
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { scale: 0.8, opacity: 0, y: 50 });

      const tl = gsap.timeline();
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
      }).to(contentRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
      });
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(modalRef.current, { display: "none" });
        },
      });
      tl.to(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
      }).to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target == e.currentTarget) {
      onClose();
    }
  };
  const formatRuntime = (minutes: number) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  return (
    <div
      ref={modalRef}
      className="fixed min-h-screen inset-0 z-50 flex items-center justify-center"
      style={{ display: "none" }}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-lg"
        onClick={handleBackdropClick}
      />
      <div ref={contentRef} className="w-1/2 h-1/2 rounded ">
        {content && (
          <div className="flex w-full h-full">
            <div className="relative w-1/3 h-full aspect-2/3 border">
              <Image
                src={content.poster_url}
                alt={content.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="w-2/3 h-full flex flex-col">
              <div className="w-full h-3/4 p-4 flex flex-col space-y-2">
                <h1 className="font-inter text-white text-2xl font-bold ">
                  {content.title} ({content.release_date.slice(0, 4)})
                </h1>
                <div className="flex flex-col space-y-2 font-bold">
                  <div className="flex space-x-4 items-end">
                    <div className="flex space-x-2 items-center">
                      <Image
                        src={"./star.svg"}
                        alt={"ok"}
                        width={20}
                        height={20}
                      />
                      <p className="flex space-x-4 font-inter text-white">
                        {content.rating}/10
                      </p>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <Earth color="#ffffff" size={20} />
                      <p className="font-inter text-white capitalize">
                        {content.genres[0]}
                      </p>
                    </div>

                    <div className="flex space-x-2 items-center">
                      <Timer color="#ffffff" size={20} />
                      <p className="font-inter text-white">
                        {formatRuntime(content.runtime)}
                      </p>
                    </div>

                    <div className="flex space-x-2 items-center">
                      <Theater size={20} color="#ffffff" />
                      <p className="font-inter text-white capitalize">
                        {content.platform}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="pt-2 font-inter font-inter text-white text-ellipis">
                  {content.overview}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModal;
