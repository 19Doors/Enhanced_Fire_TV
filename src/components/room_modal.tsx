"use client";
import { userInteraction } from "@/lib/content";
import gsap from "gsap";
import {
  Earth,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Theater,
  ThumbsDown,
  ThumbsUp,
  Timer,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";

const RoomModal = ({ content, isOpen, onClose }) => {
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

  useEffect(() => {
    let interval = null;
    if (isPlaying && isSimulating) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          const totalSeconds = (content.runtime || 120) * 60;
          const newProgress = (newTime / totalSeconds) * 100;
          setProgress(Math.min(newProgress, 100));
          return newTime;
        });
      }, 1000); // Update every 100ms for smooth animation
      return () => clearInterval(interval);
    }
  }, [isPlaying, isSimulating]);

  const handleBackdropClick = async (e) => {
    if (e.target == e.currentTarget) {
      if (currentTime > 0) {
        let interaction = {
          type: "watch",
          context_data: content,
          watchProgress: progress,
	  watchTime: currentTime,
        };
        await userInteraction(interaction);
      }
      onClose();
      setCurrentTime(0);
      setIsSimulating(false);
      setIsPlaying(false);
      setProgress(0);
    }
  };
  const formatRuntime = (minutes: number) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const handleLike = async (item) => {
    let interaction = {
      type: "like",
      context_data: item,
    };
    await userInteraction(interaction);
  };
  const handleDislike = async (item) => {
    let interaction = {
      type: "dislike",
      context_data: item,
    };
    await userInteraction(interaction);
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
            {!isSimulating && (
              <div className="w-2/3 h-full flex flex-col">
                <div className="w-full h-full p-4 flex flex-col space-y-2">
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
                <div className="h-1/4 flex">
                  <div
                    className="flex space-x-1 items-center p-4 cursor-pointer"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { scale: 1.0, duration: 0.2 });
                    }}
                    onClick={(e) => {
                      setIsSimulating(true);
                    }}
                  >
                    <Play size={20} color="#ffffff" />
                    <p className="font-bold font-inter text-white capitalize">
                      Simulate Watch
                    </p>
                  </div>
                  <div
                    className="flex space-x-1 items-center p-4 cursor-pointer"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { scale: 1.0, duration: 0.2 });
                    }}
                    onClick={() => handleLike(content)}
                  >
                    <ThumbsUp size={20} color="#ffffff" />
                    <p className="font-bold font-inter text-white capitalize">
                      Like
                    </p>
                  </div>
                  <div
                    className="flex space-x-1 items-center p-4 cursor-pointer"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { scale: 1.0, duration: 0.2 });
                    }}
                    onClick={() => handleDislike(content)}
                  >
                    <ThumbsDown size={20} color="#ffffff" />
                    <p className="font-bold font-inter text-white capitalize">
                      Dislike
                    </p>
                  </div>
                </div>
              </div>
            )}
            {isSimulating && (
              <div className="w-2/3 h-full flex flex-col">
                <div className="w-full h-full p-4 flex flex-col space-y-2">
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
                  <div className="h-full justify-center flex flex-col w-full space-y-4">
                    <div className="w-full border border-white rounded h-2">
                      <div
                        className="bg-white h-2 rounded"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex space-x-4 items-center cursor-pointer flex justify-center">
                      <div
                        onClick={() =>
                          setCurrentTime((prev) => Math.max(0, prev - 10))
                        }
                      >
                        <SkipBack size={28} color="#ffffff" />
                      </div>
                      {!isPlaying && (
                        <div onClick={() => setIsPlaying(true)}>
                          <Play size={28} color="#ffffff" />
                        </div>
                      )}
                      {isPlaying && (
                        <div onClick={() => setIsPlaying(false)}>
                          <Pause size={28} color="#ffffff" />
                        </div>
                      )}

                      <div
                        onClick={() =>
                          setCurrentTime((prev) =>
                            Math.min(prev + 10, content.runtime * 60),
                          )
                        }
                      >
                        <SkipForward size={28} color="#ffffff" />
                      </div>
                    </div>
                    <div className="flex justify-between text-white text-sm mb-4">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatRuntime(content.runtime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomModal;
