"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RatingMetric {
  label: string;
  score: number;
  maxScore: number;
}

export default function SellerRatingCard() {
  const ratingMetrics: RatingMetric[] = [
    { label: "Product", score: 5, maxScore: 5 },
    { label: "Level", score: 5, maxScore: 5 },
    { label: "Service", score: 5, maxScore: 5 },
    { label: "Delivery", score: 3.5, maxScore: 5 },
  ];

  const overallRating = 93;

  const renderStars = (score: number, maxScore: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: maxScore }).map((_, i) => {
          const filled = i < Math.floor(score);
          const isHalf =
            !filled && score - Math.floor(score) > 0 && i === Math.floor(score);

          return (
            <div key={i} className="relative">
              {/* Background star (unfilled) */}
              <Star size={20} className="text-gray-300 fill-gray-300" />
              {/* Filled/Half star overlay */}
              <div
                className={`absolute top-0 left-0 overflow-hidden ${
                  isHalf ? "w-1/2" : filled ? "w-full" : "w-0"
                }`}
              >
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 p-6 mt-4">
      <div className="flex items-center gap-8">
        {/* Left Section - Seller Info & Progress Circle */}
        <div className="flex flex-col items-center gap-4">
          {/* Circular Progress Indicator */}
          <div className="relative w-32 h-32">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 120 120"
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle with gradient */}
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#86efac" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeDasharray={`${(overallRating / 100) * 345.575} 345.575`}
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {overallRating}%
              </span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">
              Seller: BBBNVn5K8nwhz_5JE6TQK-8tQ
            </p>
            <Button className="px-4 py-2 text-sm font-medium rounded">
              Visit Seller Store
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-48 bg-gray-200" />

        {/* Right Section - Rating Metrics */}
        <div className="flex flex-1 gap-6 md:gap-8 flex-wrap justify-around">
          {ratingMetrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col items-center gap-2 flex-1 min-w-32"
            >
              <p className="text-sm font-semibold text-gray-900">
                {metric.label} {metric.score}/{metric.maxScore}
              </p>
              {renderStars(metric.score, metric.maxScore)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
