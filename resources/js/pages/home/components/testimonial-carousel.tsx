import AutoScroll from "embla-carousel-auto-scroll";
import { useRef, useState } from "react";
import { Button, Link } from "react-aria-components";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { IconChevronLeft, IconChevronRight } from "@intentui/icons";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Avatar } from "@/components/ui/avatar";

interface TestimonyItem {
  id: number;
  name: string;
  occupation: string;
  message: string;
}
export default function TestimonialCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const plugin = useRef(
    AutoScroll({
      speed: 1,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );
  const Testimonial: TestimonyItem[] = [
    {
      id: 1,
      name: "John Doe",
      occupation: "Software Engineer",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus nec nisl placerat fringilla.",
    },
    {
      id: 2,
      name: "John Doe",
      occupation: "Software Engineer",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus nec nisl placerat fringilla.",
    },
    {
      id: 3,
      name: "John Doe",
      occupation: "Software Engineer",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus nec nisl placerat fringilla.",
    },
    {
      id: 4,
      name: "John Doe",
      occupation: "Software Engineer",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus nec nisl placerat fringilla.",
    },
    {
      id: 5,
      name: "John Doe",
      occupation: "Software Engineer",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus nec nisl placerat fringilla.",
    },
    {
      id: 6,
      name: "John Doe",
      occupation: "Software Engineer",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus nec nisl placerat fringilla.",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };
  return (
    <div>
      <div className="relative w-full">
        <Carousel
          setApi={setApi}
          className="w-full"
          plugins={[plugin.current as any]}
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {Testimonial.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-2 md:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Card className="border-0 shadow-none">
                  <CardContent
                    className="flex items-center justify-center p-0 rounded-lg
                               aspect-[2/2.3]
                              bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden"
                  >
                    <div className="flex flex-col w-full h-full justify-between p-4 relative z-10">
                      <div className="space-y-2">
                        <p className="font-semibold text-xl lg:text-2xl text-primary">
                          {item.name}
                        </p>
                        <p className="text-sm text-neutral-800 dark:text-neutral-200">
                          {item.occupation}
                        </p>
                      </div>
                      <p className="text-sm lg:text-base text-neutral-800 dark:text-neutral-200">
                        "{item.message}"
                      </p>
                    </div>
                    <div className="absolute right-0 bottom-0 -mb-4 -mr-4">
                      <p className="text-[8rem] lg:text-[14rem] font-bold text-neutral-800/5 dark:text-neutral-200/5 leading-none select-none rotate-12">
                        {getInitials(item.name)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <Button
            onPress={() => api?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                       p-2 text-fg/80 hover:text-fg
                       transition-all duration-200 focus:outline-hidden
                       drop-shadow-lg hover:drop-shadow-xl"
            aria-label="Previous slide"
          >
            <IconChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
          <Button
            onPress={() => api?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                       p-2 text-fg/80 hover:text-fg
                       transition-all duration-200 focus:outline-hidden
                       drop-shadow-lg hover:drop-shadow-xl"
            aria-label="Next slide"
          >
            <IconChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
        </Carousel>
      </div>
      <div className="w-full p-4 lg:rounded-full rounded-lg bg-emerald-800">
        <div className="flex justify-between items-center flex-col gap-y-4 lg:flex-row">
          <div className="flex items-center justify-center gap-x-4">
            <div className="flex items-center justify-center -space-x-2">
              {["SH", "AB", "CN"].map((item) => (
                <Avatar
                  initials={item}
                  key={item}
                  className="size-8 lg:size-12 grid place-content-center bg-neutral-50 text-black ring-2 ring-emerald-800"
                />
              ))}
            </div>
            <p className="text-sm lg:text-base text-neutral-200">
              Join the{" "}
              <span className="font-semibold">1000+ happy customers</span>
            </p>
          </div>
          <Link href="/store">
            <div className="px-4 py-2 text-lg bg-primary text-white rounded-full w-fit font-medium flex gap-x-2 items-center">
              Shop Now
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
