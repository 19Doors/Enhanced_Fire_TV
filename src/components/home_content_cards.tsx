import gsap from "gsap";
import Image from "next/image";

const HomeContentCards = ({
  title,
  content,
  itemWidth = "w-71",
  itemHeight = "h-40",
  showGradient = true,
  showTitle = true,
  className = "",
}) => {
  return (
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
          >
            {item.backdrop_url && (
              <Image
                src={item.backdrop_url}
                alt={item.title}
                fill
                className="object-cover rounded"
              />
            )}
            {showGradient && (
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />
            )}
            {showTitle && (
              <div className="absolute bottom-2 left-2 right-2">
                <p className="font-bold font-inter text-sm truncate">
                  {item.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeContentCards;
