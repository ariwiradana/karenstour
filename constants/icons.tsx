import {
  BiSolidBackpack,
  BiSolidCar,
  BiSolidChart,
  BiSolidDirections,
} from "react-icons/bi";

export const DestinationIcons: Record<string, JSX.Element> = {
  transfer: <BiSolidCar />,
  tour: <BiSolidDirections />,
  activity: <BiSolidChart />,
  adventure: <BiSolidBackpack />,
};
