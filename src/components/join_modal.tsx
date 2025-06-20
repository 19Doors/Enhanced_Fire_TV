"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { createRoom, joinRoom } from "@/lib/room";

const JoinModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);
  const wsRef = useRef(null);

  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [content, setContent] = useState({});
  const [isConnect, setIsConnected] = useState(false);

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
      wsRef.current.close()
      setRoomCode("");
      setIsLoading(false);
      setJoinedRoom(false);
      setContent({});
      onClose();
    }
  };

  const handleJoinRoom = async (e) => {
    if (e.key != "Enter") {
      return null;
    }
    if (!roomCode.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await joinRoom(roomCode);
      if (data.success) {
        setContent(data.room.content);
	connectWebSocket();
      }
    } catch (error) {}
    setIsLoading(false);
    setJoinedRoom(true);
  };

  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:8080/social-viewing/ws/watch/${roomCode}`;
    wsRef.current = new WebSocket(wsUrl);
    console.log("connected!")

    wsRef.current.onopen = () => {
      setIsConnected(true)
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
    }

    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log("disconnected")
    }
  };

  const handleWebSocketMessage = (message) => {
  }

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
      {joinedRoom && (
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

            <div className="w-2/3 h-full flex flex-col">
              <div className="w-full h-full p-4 flex flex-col space-y-2">
                <h1 className="font-inter text-white text-2xl font-bold ">
                  {content.title} ({content.release_date.slice(0, 4)})
                </h1>
                <div className="flex flex-col space-y-2 font-bold"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!joinedRoom && (
        <div
          ref={contentRef}
          className="relative w-1/2 h-1/2 rounded border-white p-4 flex justify-center items-center"
        >
          <input
            type="text"
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Room Code"
            className="text-center font-bold font-inter text-white text-4xl p-2 focus:outline-none"
            onKeyDown={handleJoinRoom}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default JoinModal;
