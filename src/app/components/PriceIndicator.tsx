'use client';

interface PriceIndicatorProps {
  price: number;
}

export default function PriceIndicator({ price }: PriceIndicatorProps) {
  const getPriceLevel = (price: number) => {
    if (price <= 30) return 1;
    if (price <= 60) return 2;
    if (price <= 100) return 3;
    return 4;
  };

  const level = getPriceLevel(price);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="font-medium">Price Range:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`${
              i <= level ? "text-green-600" : "text-gray-300"
            } font-bold`}
          >
            $
          </span>
        ))}
      </div>
      <span className="ml-2 text-gray-500">({price}$)</span>
    </div>
  );
} 