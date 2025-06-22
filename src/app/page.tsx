"use client";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";
import HomeContentCards from "@/components/home_content_cards";
import { useEffect, useRef, useState } from "react";
import {
  getContentHotstar,
  getContentNetflix,
  getContentPrime,
  getContentRecommended,
} from "@/lib/content";
import JoinModal from "@/components/join_modal";

export default function Home() {
  const [content, setContent] = useState({
    netflix: [],
    prime: [],
    hotstar: [],
    recommendation: [],
  });
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroRef = useRef(null);

  const handleJoinRoom = () => {
    setShowJoinModal(true);
  };

  const imageRef = useRef(null);
  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.inOut",
        },
      );
    }
  }, [heroIndex]);

  useEffect(() => {
    async function fetchAllContent() {
      try {
        setLoading(true);
        const [netflixContent, primeContent, hotstarContent, recommendations] =
          await Promise.all([
            getContentNetflix(),
            getContentPrime(),
            getContentHotstar(),
            getContentRecommended(),
          ]);

        setContent({
          netflix: netflixContent,
          prime: primeContent,
          hotstar: hotstarContent,
	  recommendation: recommendations
        });
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllContent();
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
        },
      );
    }
  }, [heroIndex]);

  useEffect(() => {
    if (content.netflix.content?.length === 0) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % content.netflix.content.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [content.netflix]);

  let netflixContent = content.netflix.content || [];
  let hotstarContent = content.hotstar.content || [];
  let primeContent = content.prime.content || [];
  let recommendations = content.recommendation.content || [];
  // let moreRecommendations = content.recommendation.content?.slice(6) || [];

  if (loading) {
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
    <div className="flex flex-col min-h-screen bg-black space-y-4">
      <div
        ref={heroRef}
        className="relative inset-0 aspect-16/6 transition-opacity duration-1000 ease-in-out"
      >
        <div className="absolute z-10 p-8">
          <Image
            src={"./FIRE-TV-2024.svg"}
            alt="fireTV"
            width={100}
            height={100}
          />
        </div>
        {netflixContent[heroIndex] && (
          <>
            <Image
              ref={imageRef}
              src={netflixContent[heroIndex].backdrop_url}
              alt={netflixContent[heroIndex].title}
              fill
              className="object-cover transition-opacity duration-2000 ease-in-out"
            />
            <div className="absolute bottom-0 p-4 px-8 z-10">
              <h1 className="text-white font-inter font-bold text-2xl mb-6">
                {netflixContent[heroIndex].title}
              </h1>
              <p className="font-inter text-white text-sm overflow-auto max-w-1/2">
                {netflixContent[heroIndex].overview}
              </p>
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
      </div>

      <div className="flex justify-between items-center px-8">
        <div className="flex space-x-4">
          <button
            onClick={handleJoinRoom}
            className="font-inter text-[#D8DCFF] text-lg font-bold border rounded p-2 cursor-pointer hover:underline"
          >
            <span>Join Room</span>
          </button>
        </div>

        <div className="flex grow items-center gap-4 justify-end">
          <Link href="/netflix" className="relative w-30 h-20 cursor-pointer">
            <Image
              src={"/netflix.png"}
              alt="netflix"
              fill
              className="object-contain bg-white p-1 rounded border-[#db0000] border-3"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
              }}
            />
          </Link>
          <Link
            href="/prime"
            className="relative w-30 h-20 rounded cursor-pointer"
          >
            <Image
              src={"/prime.webp"}
              alt="prime"
              fill
              className="object-contain rounded p-2 border-[#1998FF] border-3"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { scale: 1.1 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1 });
              }}
            />
          </Link>
          <Link href="/hotstar" className="relative w-30 h-20 cursor-pointer">
            <Image
              src={"/hotstar.webp"}
              alt="hotstar"
              fill
              className="object-contain bg-white p-3 rounded border-[#0B6879] border-3"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { scale: 1.1 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1 });
              }}
            />
          </Link>
        </div>
      </div>
      {recommendations.length != 0 && (
        <div>
          <HomeContentCards title="Recommendations" content={recommendations} />
        </div>
      )}
      <HomeContentCards title="Popular on Netflix" content={netflixContent} />
      <HomeContentCards title="Popular on PrimeVideo" content={primeContent} />
      <HomeContentCards title="Popular on Hotstar" content={hotstarContent} />
      <JoinModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  );
}
