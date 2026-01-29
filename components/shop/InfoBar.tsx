import { Button } from "@/components/ui/button";
import InfoBarBack from "@/components/common/InfoBarBack";
import { Filter } from "lucide-react";
import { FilterSidebarSheet } from "../common/FilterSidebarSheet";
import { decodeSlug } from "@/lib/decodeSlug";

function InfoBar({ slug }: { slug: string }) {
  const title = decodeSlug(slug);
  return (
    <div className="flex items-center justify-between border shadow-sm p-3 bg-white w-full mt-[-7px]">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <InfoBarBack />
        <div>
          <h1 className="text-xl font-semibold text-primary">{title}</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex items-center gap-3">
        <FilterSidebarSheet>
          <Button>
            <Filter /> Filter
          </Button>
        </FilterSidebarSheet>
      </div>
    </div>
  );
}

export default InfoBar;
