import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatusCardsProps {
  pending: number;
  processing: number;
  completed: number;
  rightSlot?: ReactNode;
}

function CircularProgress({ value, total }: { value: number; total: number }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  const size = 70;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E8E8"
          strokeWidth={strokeWidth}
        />
        {percent > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#167389"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-300"
          />
        )}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {percent}%
      </span>
    </div>
  );
}

export default function StatusCards({
  pending,
  processing,
  completed,
  rightSlot,
}: StatusCardsProps) {
  const total = pending + processing + completed;
  const items = [
    { label: 'Pending', value: pending },
    { label: 'Processing', value: processing },
    { label: 'Completed', value: completed },
  ] as const;

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-5 sm:gap-6 items-stretch">
        {/* Left section: status cards – full width, own shadow */}
        <div className="rounded bg-white p-5 sm:p-6 shadow min-w-0 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full">
            {items.map(({ label, value }) => (
              <Card
                key={label}
                className="bg-gray-50 flex flex-row items-center justify-between gap-4 rounded-md shadow-none p-5 sm:p-6 min-w-0 w-full "
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="text-base font-medium text-[#333333] mb-1"
                    style={{ fontSize: '16px' }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-2xl font-bold text-[#333333]"
                    style={{ fontSize: '24px' }}
                  >
                    {value}
                  </p>
                </div>
                <div className="shrink-0 ml-auto">
                  <CircularProgress value={value} total={total} />
                </div>
              </Card>
            ))}
          </div>
        </div>
        {/* Right section: support – own shadow */}
        {rightSlot ? (
          <div className="rounded bg-white p-5 sm:p-6 shadow min-w-0 lg:w-72 shrink-0 w-full">
            {rightSlot}
          </div>
        ) : null}
      </div>
    </div>
  );
}
