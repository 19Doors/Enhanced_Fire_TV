"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { createRoom } from "@/lib/room";

const RoomModal = ({ isOpen, onClose, mode, content }) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      gsap.set(modalRef.current, { display: "flex" });
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { scale: 0.8, opacity: 0, y: 50 });

      const tl = gsap.timeline();
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      }).to(contentRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(modalRef.current, { display: "none" });
          setRoomName("");
          setRoomCode("");
        },
      });
      tl.to(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: "power2.in",
      }).to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateRoom = async (e) => {
    if(e.key != "Enter") {
      return null;
    }
    if (!roomName.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await createRoom(roomName,content.id,content);
      setRoomCode(data.room_id);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
      <div
        ref={contentRef}
        className="relative w-1/2 h-1/2 rounded border-white p-4"
      >
        <div className="flex w-full h-full">
          <div className="relative w-1/3 h-full aspect-2/3 border">
            <Image
              src={content.poster_url}
              alt={content.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grow">
	  <div className="flex flex-col">
            <input
              type="text"
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
              className="font-bold font-inter text-white text-xl p-2 focus:outline-none"
	      onKeyDown={handleCreateRoom}
              disabled={isLoading}
            />
	    <p className="font-inter text-white p-2">Room Code: <b>{roomCode}</b></p>
	    </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
