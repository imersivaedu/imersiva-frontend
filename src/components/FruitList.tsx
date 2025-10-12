import { FruitIcon } from "./FruitIcon";

interface FruitItem {
  fruit: { name: string };
  amount: number;
}

interface FruitListProps {
  fruitList?: Array<FruitItem>;
  emptyMessage?: string;
  size?: number;
}

export function FruitList({
  fruitList,
  emptyMessage = "Nenhuma",
  size = 32,
}: FruitListProps) {
  if (!fruitList || fruitList.length === 0) {
    return <div className="text-sm text-gray-500 italic">{emptyMessage}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {fruitList.map((item, index) => (
        <FruitIcon
          key={`${item.fruit.name}-${index}`}
          fruitName={item.fruit.name}
          amount={item.amount}
          size={size}
        />
      ))}
    </div>
  );
}
