import Image from "next/image";
import primeData from "../../data/prime_video_content.json";
export default function Prime() {
  let content = primeData.content;
  console.log(content);
  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-100 mb-8">
        <Image
          src={content[0].backdrop_url}
          alt={content[0].title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 p-4">
          <h1 className="text-white font-inter font-bold text-2xl mb-6">
            PrimeTV
          </h1>
        </div>
        <div className="absolute bottom-0 p-4 z-1">
          <h1 className="text-white font-inter font-bold text-2xl mb-6">
            {content[0].title}
          </h1>
	  <p className="font-inter text-white text-sm overflow-auto max-w-1/2">
	    {content[0].overview}
	  </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30" />
      </div>
      <div className="px-8 pb-8">
        <h2 className="font-inter text-xl font-bold text-background">
          Popular on PrimeTV
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {content.map((c) => (
            <div
              key={c.id}
              className="relative cursor-pointer aspect-[2/3] overflow-hidden"
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
