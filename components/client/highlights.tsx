import { unbounded } from "@/constants/font";
import React, { FC, ReactNode } from "react";
import { FaHandHoldingHeart, FaStar, FaUserCheck } from "react-icons/fa6";
import Container from "./container";
import { t } from "i18next";

interface HighlightItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const HighlightItem: FC<HighlightItemProps> = (props) => {
  return (
    <div className="flex items-start gap-x-5 md:gap-x-3 lg:gap-x-5">
      <div>{props.icon}</div>
      <div className={unbounded.className}>
        <h1 className="lg:text-xl text-lg text-white font-medium">{props.title}</h1>
        <p className="text-sm text-white font-light mt-2 leading-6">
          {props.description}
        </p>
      </div>
    </div>
  );
};

const Highlights = () => {
  return (
    <div className="w-full bg-primary py-12 lg:p-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <HighlightItem
            title={t("home.highlights.review.title")}
            description={t("home.highlights.review.desc")}
            icon={<FaStar className="text-yellow-400 text-3xl" />}
          />
          <HighlightItem
            title={t("home.highlights.cancelation.title")}
            description={t("home.highlights.cancelation.desc")}
            icon={<FaHandHoldingHeart className="text-yellow-400 text-3xl" />}
          />
          <HighlightItem
            title={t("home.highlights.expert.title")}
            description={t("home.highlights.expert.desc")}
            icon={<FaUserCheck className="text-yellow-400 text-3xl" />}
          />
        </div>
      </Container>
    </div>
  );
};

export default Highlights;
