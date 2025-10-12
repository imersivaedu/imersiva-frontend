import Image from "next/image";

interface FruitIconProps {
  fruitName: string;
  amount: number;
  size?: number;
}

export function FruitIcon({ fruitName, amount, size = 32 }: FruitIconProps) {
  // Map fruit names to image paths
  const fruitImageMap: Record<string, string> = {
    apple: "/fruits/apple.png",
    banana: "/fruits/banana.png",
    cashew: "/fruits/cashew.png",
    orange: "/fruits/orange.png",
    pear: "/fruits/pear.png",
    pineapple: "/fruits/pineapple.png",
    watermelon: "/fruits/watermelon.png",
  };

  const imagePath = fruitImageMap[fruitName.toLowerCase()];

  if (!imagePath) {
    // Fallback for unknown fruits
    return (
      <div className="flex items-center space-x-1">
        <div
          className="bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium"
          style={{ width: size, height: size }}
        >
          ?
        </div>
        <span className="text-xs font-medium">{amount}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      <Image
        src={imagePath}
        alt={fruitName}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
      <div className="bg-white border border-gray-300 rounded-full px-2 py-1 min-w-[24px] flex items-center justify-center">
        <span className="text-xs font-bold text-black">{amount}</span>
      </div>
    </div>
  );
}
