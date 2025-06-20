"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import gsap from "gsap";
import Image from "next/image";
import { createRoom, joinRoom } from "@/lib/room";
import { toast } from "./toast";
import { backend_social, ws_social } from "@/lib/urls";

const JoinModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);
  const wsRef = useRef(null);

  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [content, setContent] = useState({});
  const [isConnect, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

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

  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "playback_sync",
          is_playing: isPlaying,
          currentTime: currentTime,
        }),
      );
      console.log("sent");
    }
  }, [isPlaying]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
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
  }, [isPlaying]);

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      wsRef.current.close();
      setRoomCode("");
      setIsLoading(false);
      setJoinedRoom(false);
      setContent({});
      onClose();
      setCurrentTime(0);
      setIsPlaying(false);
      setProgress(0);
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
        setRoomName(data.room.room_name);
        connectWebSocket();
      }
    } catch (error) {}
    setIsLoading(false);
    setJoinedRoom(true);
  };

  const updateTime = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "playback_sync",
          is_playing: isPlaying,
          currentTime: currentTime,
        }),
      );
      console.log("sent");
    }
  };

  const connectWebSocket = () => {
    // const wsUrl = `ws://127.0.0.1:8000/ws/watch/${roomCode}`;
    // const wsUrl = `ws://35.244.41.155:3002/ws/watch/${room_id}`;
    // const wsUrl = `ws://35.244.41.155:3002/ws/watch/${room_id}`;
    // const wsUrl = `ws://34.47.135.240:3002/ws/watch/${room_id}`;
    const wsUrl = `ws://${ws_social}/ws/watch/${roomCode}`;
    wsRef.current = new WebSocket(wsUrl);
    console.log("connected!");

    wsRef.current.onopen = () => {
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type == "playback_sync") {
        setIsPlaying(message.is_playing);
        setCurrentTime(message.current_time);
      }
      if (message.type == "user_joined") {
        toast({
          title: "Someone Connected",
        });
      }
      if (message.type == "user_left") {
        toast({
          title: "Someone left",
        });
      }
      console.log(message);
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log("disconnected");
    };
  };

  const handleWebSocketMessage = (message) => {};

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

            <div className="w-full h-full flex flex-col">
              <div className="w-full h-full p-4 flex flex-col space-y-2">
                <h1 className="font-inter text-white text-2xl font-bold ">
                  Party: {roomName}
                </h1>
                <h1 className="font-inter text-white text-xl font-bold ">
                  {content.title}
                </h1>
                <div className="flex flex-col space-y-2 font-bold"></div>
              </div>
              <div className="h-full justify-center flex flex-col w-full space-y-4 p-4">
                <div className="w-full border border-white rounded h-2">
                  <div
                    className="bg-white h-2 rounded"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex space-x-4 items-center cursor-pointer flex justify-center">
                  <div
                    onClick={() => {
                      setCurrentTime((prev) => Math.max(0, prev - 10));
                      updateTime();
                    }}
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
                    onClick={() => {
                      setCurrentTime((prev) =>
                        Math.min(prev + 10, content.runtime * 60),
                      );
                      updateTime();
                    }}
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
