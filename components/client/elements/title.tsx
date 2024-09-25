import { montserrat, unbounded } from "@/constants/font";
import React, { FC } from "react";
import ButtonText from "./button.text";
import Link from "next/link";
import { t } from "i18next";

interface TitleProps {
  title: string;
  description?: string;
  action: boolean;
  actionTitle?: string;
  path?: string;
  center?: boolean;
}

const Title: FC<TitleProps> = (props) => {
  return (
    <div
      className={`flex flex-col md:flex-row gap-4 ${
        props.center ? "justify-center" : "justify-between"
      } w-full`}
    >
      <div className={props.center ? "text-center" : "text-left"}>
        <h2
          className={`text-xl md:text-2xl lg:text-3xl font-bold text-dark mb-2 ${unbounded.className}`}
        >
          {props.title}
        </h2>
        <p
          className={`text-darkgray text-lg ${
            !props.center ? "lg:max-w-[70dvw]" : ""
          } ${montserrat.className}`}
        >
          {props.description}
        </p>
      </div>
      {props.action && (
        <Link href={props.path || "/"}>
          <ButtonText
            title={props.actionTitle ? props.actionTitle : t("more")}
          />
        </Link>
      )}
    </div>
  );
};

export default Title;
