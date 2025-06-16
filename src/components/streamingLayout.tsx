import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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
  let content = data.content;
  const cardRef = useRef(null);
  const heroRef = useRef(null);

  let [currentBackdrop, setCurrentBackdrop] = useState(0);

  useGSAP(() => {
    gsap.fromTo(heroRef.current, { x: -200 }, { x: 0 });
  }, [currentBackdrop]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackdrop((prev) => (prev + 1) % content.length);
    }, 5000);
  }, [content.length]);

  const currentContent = content[currentBackdrop];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-100 mb-8">
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
  );
}
