"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, MessageSquare, Headphones } from "lucide-react";
import {
  ShoppingBag,
  Gem,
  Footprints,
  Sparkles,
  Shirt,
  ShirtIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  subCategories?: SubCategory[];
}

// Mock data - Replace with actual API call
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Bags",
    slug: "bags",
    icon: <ShoppingBag className="w-5 h-5" />,
    subCategories: [
      { id: "1-1", name: "Handbags", slug: "handbags" },
      { id: "1-2", name: "Backpacks", slug: "backpacks" },
      { id: "1-3", name: "Tote Bags", slug: "tote-bags" },
      { id: "1-4", name: "Clutch Bags", slug: "clutch-bags" },
    ],
  },
  {
    id: "2",
    name: "Jewelry",
    slug: "jewelry",
    icon: <Gem className="w-5 h-5" />,
    subCategories: [
      { id: "2-1", name: "Necklaces", slug: "necklaces" },
      { id: "2-2", name: "Rings", slug: "rings" },
      { id: "2-3", name: "Earrings", slug: "earrings" },
      { id: "2-4", name: "Bracelets", slug: "bracelets" },
    ],
  },
  {
    id: "3",
    name: "Shoes",
    slug: "shoes",
    icon: <Footprints className="w-5 h-5" />,
    subCategories: [
      { id: "3-1", name: "Men Shoes", slug: "men-shoes" },
      { id: "3-2", name: "Men Boot", slug: "men-boot" },
      { id: "3-3", name: "Ladies Shoes", slug: "ladies-shoes" },
      { id: "3-4", name: "Ladies Boot", slug: "ladies-boot" },
      { id: "3-5", name: "High Heels", slug: "high-heels" },
      { id: "3-6", name: "Formal Shoes", slug: "formal-shoes" },
      { id: "3-7", name: "Sandals", slug: "sandals" },
      { id: "3-8", name: "Running Shoes", slug: "running-shoes" },
      { id: "3-9", name: "Casual Shoes", slug: "casual-shoes" },
      { id: "3-10", name: "Loafers", slug: "loafers" },
      { id: "3-11", name: "Sports Shoe", slug: "sports-shoe" },
      { id: "3-12", name: "Baby Shoes", slug: "baby-shoes" },
      { id: "3-13", name: "Low Top Shoe", slug: "low-top-shoe" },
      { id: "3-14", name: "Rain Boot", slug: "rain-boot" },
      { id: "3-15", name: "Football Shoes", slug: "football-shoes" },
      { id: "3-16", name: "Slippers", slug: "slippers" },
    ],
  },
  {
    id: "4",
    name: "Beauty",
    slug: "beauty",
    icon: <Sparkles className="w-5 h-5" />,
    subCategories: [
      { id: "4-1", name: "Makeup", slug: "makeup" },
      { id: "4-2", name: "Skincare", slug: "skincare" },
      { id: "4-3", name: "Fragrances", slug: "fragrances" },
      { id: "4-4", name: "Hair Care", slug: "hair-care" },
    ],
  },
  {
    id: "5",
    name: "Mens Wear",
    slug: "mens-wear",
    icon: <Shirt className="w-5 h-5" />,
    subCategories: [
      { id: "5-1", name: "T-Shirts", slug: "t-shirts" },
      { id: "5-2", name: "Shirts", slug: "shirts" },
      { id: "5-3", name: "Pants", slug: "pants" },
      { id: "5-4", name: "Jeans", slug: "jeans" },
    ],
  },
  {
    id: "6",
    name: "Women Wear",
    slug: "women-wear",
    icon: <ShirtIcon className="w-5 h-5" />,
    subCategories: [
      { id: "6-1", name: "Dresses", slug: "dresses" },
      { id: "6-2", name: "Tops", slug: "tops" },
      { id: "6-3", name: "Skirts", slug: "skirts" },
      { id: "6-4", name: "Blouses", slug: "blouses" },
    ],
  },
];

// Mock API functions
const fetchSubCategories = async (categoryId: string): Promise<SubCategory[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const category = mockCategories.find((cat) => cat.id === categoryId);
  return category?.subCategories || [];
};

const fetchCategoryProducts = async (categoryId: string) => {
  // Mock API call - Replace with actual API endpoint
  console.log(`Fetching products for category ID: ${categoryId}`);
  // In real implementation: await fetcher(`/category-products/${categoryId}`)
  return { data: [], message: `Products fetched for category ${categoryId}` };
};

const fetchSubCategoryProducts = async (
  categoryId: string,
  subCategoryId: string
) => {
  // Mock API call - Replace with actual API endpoint
  console.log(
    `Fetching products for category ID: ${categoryId}, subcategory ID: ${subCategoryId}`
  );
  // In real implementation: await fetcher(`/subcategory-products/${subCategoryId}`)
  return {
    data: [],
    message: `Products fetched for category ${categoryId}, subcategory ${subCategoryId}`,
  };
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
  categories?: Category[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contact?: any;
  onCategoryClick?: (categoryId: string) => void;
  onSubCategoryClick?: (categoryId: string, subCategoryId: string) => void;
}

export default function Sidebar2({
  categories = mockCategories,
  settings,
  contact,
  onCategoryClick,
  onSubCategoryClick,
}: Sidebar2Props) {
  const pathname = usePathname();
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
    null
  );
  const [subCategoriesMap, setSubCategoriesMap] = useState<
    Record<string, SubCategory[]>
  >({});
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  // Auto-expand category and highlight based on current route
  useEffect(() => {
    // Check if current route matches any category
    categories.forEach((category) => {
      if (pathname === `/category/${category.slug}`) {
        setOpenCategoryId(category.id);
        setSelectedSubCategoryId(null);
      }
    });

    // Check if current route matches any subcategory
    categories.forEach((category) => {
      const subCategories =
        subCategoriesMap[category.id] || category.subCategories || [];
      subCategories.forEach((subCategory) => {
        if (pathname === `/subcategory/${subCategory.slug}`) {
          setOpenCategoryId(category.id);
          setSelectedSubCategoryId(subCategory.id);
        }
      });
    });
  }, [pathname, categories, subCategoriesMap]);

  // Fetch subcategories when a category is opened
  useEffect(() => {
    if (openCategoryId) {
      const loadSubCategories = async () => {
        setLoadingCategoryId(openCategoryId);
        try {
          // Check if subcategories are already loaded
          if (!subCategoriesMap[openCategoryId]) {
            const subCats = await fetchSubCategories(openCategoryId);
            setSubCategoriesMap((prev) => ({
              ...prev,
              [openCategoryId]: subCats,
            }));
          }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        } finally {
          setLoadingCategoryId(null);
        }
      };

      loadSubCategories();
    }
  }, [openCategoryId, subCategoriesMap]);

  const handleCategoryClick = async (categoryId: string) => {
    // If clicking the same category, close it
    if (openCategoryId === categoryId) {
      setOpenCategoryId(null);
      setSelectedSubCategoryId(null);
      return;
    }

    // Close previous category and open new one
    setOpenCategoryId(categoryId);
    setSelectedSubCategoryId(null);

    // Trigger API call for category products
    try {
      await fetchCategoryProducts(categoryId);
      // Call custom handler if provided
      onCategoryClick?.(categoryId);
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };

  const handleSubCategoryClick = async (
    categoryId: string,
    subCategoryId: string
  ) => {
    setSelectedSubCategoryId(subCategoryId);

    // Trigger API call for subcategory products
    try {
      await fetchSubCategoryProducts(categoryId, subCategoryId);
      // Call custom handler if provided
      onSubCategoryClick?.(categoryId, subCategoryId);
    } catch (error) {
      console.error("Error fetching subcategory products:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 text-foreground flex flex-col z-50">
      {/* Scrollable Categories Section - Hidden scrollbar but scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <ul className="mt-4 space-y-1">
          {categories.map((category) => {
            const isOpen = openCategoryId === category.id;
            const isLoading = loadingCategoryId === category.id;
            const subCategories =
              subCategoriesMap[category.id] || category.subCategories || [];

            const isCategoryActive = pathname === `/category/${category.slug}`;

            return (
              <li key={category.id}>
                {/* Main Category - Linkable */}
                <div className="flex items-center">
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={() => {
                      setOpenCategoryId(category.id);
                      setSelectedSubCategoryId(null);
                    }}
                    className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span
                      className={cn(
                        "text-teal-600",
                        isCategoryActive && "text-teal-700"
                      )}
                    >
                      {category.icon}
                    </span>
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
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className="px-2 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-gray-400 transition-transform",
                        isOpen && "transform rotate-90"
                      )}
                    />
                  </button>
                </div>

                {/* Sub-categories */}
                {isOpen && (
                  <div className="relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />

                    <ul className="pl-8 pb-2">
                      {isLoading ? (
                        <li className="px-4 py-2 text-xs text-gray-500">
                          Loading...
                        </li>
                      ) : (
                        subCategories.map((subCategory) => {
                          const isSelected =
                            selectedSubCategoryId === subCategory.id;
                          const isSubCategoryActive =
                            pathname === `/subcategory/${subCategory.slug}`;
                          return (
                            <li key={subCategory.id}>
                              <Link
                                href={`/subcategory/${subCategory.slug}`}
                                onClick={() =>
                                  handleSubCategoryClick(
                                    category.id,
                                    subCategory.id
                                  )
                                }
                                className={cn(
                                  "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 block",
                                  (isSelected || isSubCategoryActive)
                                    ? "text-teal-600 font-semibold"
                                    : "text-gray-900"
                                )}
                              >
                                {subCategory.name}
                              </Link>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Fixed Footer */}
      {settings && contact && <Footer contact={contact} settings={settings} />}
    </nav>
  );
}
