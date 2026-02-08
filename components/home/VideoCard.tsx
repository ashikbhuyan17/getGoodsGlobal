import { Play } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

function VideoCard({ 
  image, 
  video, 
  title, 
  date 
}: { 
  image: string; 
  video?: string;
  title?: string;
  date?: string;
}) {
  // Format date from ISO string to DD/MM/YYYY
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer w-full">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
            <Image
              alt={title || "Video thumbnail"}
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
              width={1200}
              height={675}
              className="w-full h-full object-cover rounded-xl"
            />
            <span className="bg-cyan-500 p-1.5 rounded-full absolute bottom-2 right-2 z-10">
              <Play fill="#fff" className="text-white w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2">
            <h2 className="font-semibold text-sm line-clamp-2">
              {title || "Video Title"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(date)}</p>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[65vw] max-w-[70vw] w-full h-[80vh] py-10 px-14 overflow-hidden">
        {video ? (
          <iframe
            className="w-full h-full rounded-sm"
            src={`https://www.youtube.com/embed/${video}?autoplay=1&controls=0`}
            title="Guangzhou Shipment Loading From SkyBuy China Warehouse (10/11/2025)"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        ) : (
          <Image
            alt=""
            src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
            width={1200}
            height={1200}
            className="w-full h-full rounded-sm"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default VideoCard;
