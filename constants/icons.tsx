import {
  BiRun,
  BiSolidBackpack,
  BiSolidCar,
  BiSolidChart,
  BiSolidDirections,
} from "react-icons/bi";

export const DestinationIcons: Record<string, JSX.Element> = {
  transport: <BiSolidCar />,
  tour: <BiSolidDirections />,
  activity: <BiSolidChart />,
  adventure: <BiSolidBackpack />,
};
