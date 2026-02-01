import { Card, CardContent } from "@/components/ui/card";

const ProductStatistic = () => {
  const StatData: StatisticItemProps[] = [
    {
      title: "Decorative Plants",
      imageUrl: "/assets/images/decorative-plants.svg",
    },
    {
      title: "Fertilizer and Soils",
      imageUrl: "/assets/images/fertilizers.svg",
    },
    {
      title: "Gardening Tools",
      imageUrl: "/assets/images/gardening-tools.svg",
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {StatData.map((item, index) => (
        <StatisticItem
          key={index}
          title={item.title}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
};

export default ProductStatistic;

interface StatisticItemProps {
  title: string;
  imageUrl: string;
}
const StatisticItem = (props: StatisticItemProps) => {
  const { title, imageUrl } = props;
  return (
    <Card className="max-w-lg relative overflow-hidden border-0 shadow-none aspect-video bg-gradient-to-br from-emerald-600 to-emerald-800">
      <img
        src={imageUrl}
        alt="Monthly Report"
        className="absolute right-0 top-0 h-full object-contain select-none"
      />

      <CardContent className="absolute inset-0 bg-black/10 text-white flex flex-col justify-center p-6">
        <div className="w-1/2 flex h-full flex-col justify-center gap-y-4">
          <p className="text-lg lg:text-3xl font-semibold text-balance text-white max-w-[140px]">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
