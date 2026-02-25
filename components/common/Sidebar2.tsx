/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronRight, MessageSquare, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

// Types matching API response
interface SubCategory {
  id: number;
  subcategoryName: string;
  slug: string;
  category_id: string;
  image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: string;
  subcategories: SubCategory[];
}

// Helper function to get image URL
const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "/placeholder-product.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${process.env.NEXT_PUBLIC_IMG_URL}/${imagePath}`;
};


// Footer Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Footer = ({ settings, contact }: { settings: any; contact: any }) => (
  <div className="px-3 py-6 border-t border-border mt-4">
    <div className="grid grid-cols-3 gap-1">
      <Link
        href={settings?.data?.messenger}
        target="_blank"
        className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13"
          />
        </svg>
        <span className="text-xs font-medium">Messenger</span>
      </Link>

      <Link
        href={`https://wa.me/+88${contact?.data?.phone}`}
        target="_blank"
        className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs font-medium">Chat</span>
      </Link>

      <Link
        href="/account/support"
        className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <Headphones className="w-5 h-5" />
        <span className="text-xs font-medium">Support</span>
      </Link>
    </div>
  </div>
);

interface Sidebar2Props {
  settings?: any;
  contact?: any;
  initialCategories?: any; // Server-fetched categories to avoid loading flash
  onCategoryClick?: (categoryId: string) => void;
  onSubCategoryClick?: (categoryId: string, subCategoryId: string) => void;
  /** When true, render inline (e.g. inside Sheet) instead of fixed */
  embedded?: boolean;
  /** Call when link is clicked (e.g. close mobile sheet) */
  onClose?: () => void;
}

export default function Sidebar2({
  settings,
  contact,
  initialCategories,
  onCategoryClick,
  onSubCategoryClick,
  embedded = false,
  onClose,
}: Sidebar2Props) {
  const pathname = usePathname();
  // Initialize with server-fetched categories if available
  const getInitialCategories = (): Category[] => {
    const data = initialCategories?.data;
    if (Array.isArray(data)) {
      return data.filter((cat: Category) => cat?.status === "1");
    }
    return [];
  };

  const [categories] = useState<Category[]>(getInitialCategories);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  // Auto-expand category and highlight based on current route
  useEffect(() => {
    if (!categories.length) return;

    // Check if current route matches any category
    categories.forEach((category) => {
      if (pathname === `/category/${category.slug}`) {
        setOpenCategoryId(String(category.id));
        setSelectedSubCategoryId(null);
      }
    });

    // Check if current route matches any subcategory
    categories.forEach((category) => {
      const subCategories = category.subcategories || [];
      subCategories.forEach((subCategory) => {
        if (pathname === `/category/${category.slug}/subcategory/${subCategory.slug}`) {
          setOpenCategoryId(String(category.id));
          setSelectedSubCategoryId(String(subCategory.id));
        }
      });
    });
  }, [pathname, categories]);


  const handleCategoryClick = (categoryId: string) => {
    // If clicking the same category, close it
    if (openCategoryId === categoryId) {
      setOpenCategoryId(null);
      setSelectedSubCategoryId(null);
      return;
    }

    // Close previous category and open new one
    setOpenCategoryId(categoryId);
    setSelectedSubCategoryId(null);

    // Call custom handler if provided
    onCategoryClick?.(categoryId);
  };

  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    setSelectedSubCategoryId(subCategoryId);

    // Call custom handler if provided
    onSubCategoryClick?.(categoryId, subCategoryId);
  };

  const Wrapper = embedded ? "div" : "nav";
  const wrapperClass = embedded
    ? "h-full w-full bg-[#FFFFFF] text-foreground flex flex-col overflow-y-auto"
    : "fixed top-0 left-0 h-full w-56 bg-[#FFFFFF] border-r border-gray-200 text-foreground flex flex-col z-50";

  return (
    <Wrapper className={wrapperClass}>
      {/* Scrollable Categories Section - Hidden scrollbar but scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {categories.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">No categories found</div>
          </div>
        ) : (
          <ul className="mt-4 space-y-1">
            {categories.map((category) => {
              const isOpen = openCategoryId === String(category.id);
              const subCategories = category.subcategories || [];
              const isCategoryActive = pathname === `/category/${category.slug}`;
              const categoryImageUrl = getImageUrl(category.image);

              return (
                <li key={category.id}>
                  {/* Main Category - Linkable */}
                  <div className="flex items-center">
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={() => {
                        setOpenCategoryId(String(category.id));
                        setSelectedSubCategoryId(null);
                        onClose?.();
                      }}
                      className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative w-5 h-5 shrink-0">
                        <Image
                          src={categoryImageUrl}
                          alt={category.name}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isCategoryActive
                            ? "text-teal-700 font-semibold"
                            : "text-gray-900"
                        )}
                      >
                        {category.name}
                      </span>
                    </Link>
                    {subCategories.length > 0 && (
                      <button
                        onClick={() => handleCategoryClick(String(category.id))}
                        className="px-2 py-3 hover:bg-gray-50 transition-colors"
                        aria-label={isOpen ? `Collapse ${category.name} subcategories` : `Expand ${category.name} subcategories`}
                      >
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 text-gray-400 transition-transform",
                            isOpen && "transform rotate-90"
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {/* Sub-categories */}
                  {isOpen && subCategories.length > 0 && (
                    <div className="relative">
                      {/* Vertical connecting line */}
                      <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />

                      <ul className="pl-8 pb-2">
                        {subCategories
                          .filter((sub) => sub.status === "1")
                          .map((subCategory) => {
                            const isSelected =
                              selectedSubCategoryId === String(subCategory.id);
                            const isSubCategoryActive =
                              pathname === `/category/${category.slug}/subcategory/${subCategory.slug}`;
                            return (
                              <li key={subCategory.id}>
                                <Link
                                  href={`/category/${category.slug}/subcategory/${subCategory.slug}`}
                                  onClick={() => {
                                    handleSubCategoryClick(
                                      String(category.id),
                                      String(subCategory.id)
                                    );
                                    onClose?.();
                                  }}
                                  className={cn(
                                    "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 block",
                                    (isSelected || isSubCategoryActive)
                                      ? "text-teal-600 font-semibold"
                                      : "text-gray-900"
                                  )}
                                >
                                  {subCategory.subcategoryName}
                                </Link>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Fixed Footer */}
      {settings && contact && <Footer contact={contact} settings={settings} />}
    </Wrapper>
  );
}
