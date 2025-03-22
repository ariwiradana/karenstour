import { FC } from "react";
import Image from "next/image";
import { Destination } from "@/constants/types";
import { currencyIDR } from "@/utils/currencyFormatter";
import { montserrat } from "@/constants/font";

export const trip = {
  name: "Best of Waterfalls, Rice Terrace, Swing",
  description:
    "A full-day experience visiting Tukad Cepung Waterfall, Tibumana Waterfall, Tegenungan Waterfall, and the famous Bali Swing. Enjoy stunning views and a delicious scenic lunch.",
  duration: "8 hours",
  price: "$120 per person",
  highlights: [
    "Tukad Cepung Waterfall",
    "Tibumana Waterfall",
    "Tegenungan Waterfall",
    "Bali Swing",
    "Rice Terraces",
    "Scenic Lunch",
  ],
  image: "/images/waterfalls-tour.jpg", // Replace with your image path
};

interface Props {
  destination?: Destination;
}

const TripBrochure: FC<Props> = (props) => {
  if (!props.destination) return <></>;
  return (
    <div className={`${montserrat.className}`}>
      <div className="p-52 bg-white shadow-lg rounded-lg my-6">
        <h1 className={`text-4xl font-bold text-dark`}>
          {props.destination.title}
        </h1>
        <h1 className="text-xl font-semibold text-dark mt-4 mb-4">
          {currencyIDR(props.destination.price)} | {props.destination.duration}
        </h1>
        <div>
          <div className="grid grid-cols-4 gap-1 grid-rows-2 mt-10">
            <div className="relative w-full col-span-2 row-span-2 h-[50vh]">
              <Image
                src={props.destination.images[0]}
                alt="brochure-main"
                fill
                className="rounded object-cover w-full h-full"
              />
            </div>
            {props.destination.images.slice(1, 6).map((image, index) => (
              <div
                key={`brochure-${index + 1}`}
                className="relative w-full col-span-1"
              >
                <Image
                  src={image}
                  alt={`brochure-${index + 1}`}
                  fill
                  className="rounded object-cover w-full h-full"
                />
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-dark mt-10">Description</h2>
          <div
            className="description mt-2 line-clamp-[20] text-xl"
            dangerouslySetInnerHTML={{ __html: props.destination.description }}
          ></div>

          <div className={`mt-4 md:mt-0 ${montserrat.className}`}>
            <div className="mt-6">
              <h2 className="text-3xl font-bold text-dark mt-12">Inclusions</h2>
              <ul className="list-disc list-inside mt-2 text-darkgray text-xl">
                {props.destination.inclusions.map((inclusion, index) => (
                  <li key={index}>{inclusion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripBrochure;
