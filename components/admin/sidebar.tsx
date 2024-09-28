import { montserrat } from "@/constants/font";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import {
  BiCategory,
  BiClipboard,
  BiLogOut,
  BiMap,
  BiMenu,
  BiStar,
} from "react-icons/bi";
import ButtonPrimaryIcon from "./elements/button.primary.icon";
import ButtonPrimary from "./elements/button.primary";
import ImageShimmer from "../client/elements/image.shimmer";

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
}: {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) => {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { name: "Booking", path: "/admin/booking", icon: <BiClipboard /> },
    { name: "Category", path: "/admin/category", icon: <BiCategory /> },
    { name: "Destination", path: "/admin/destination", icon: <BiMap /> },
    { name: "Review", path: "/admin/reviews", icon: <BiStar /> },
  ];

  const pageTitle = menuItems.find(
    (menu) => menu.path === router.pathname
  )?.name;

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Successfully logged out");
        router.push("/admin/login");
      } else {
        const result = await response.json();
        console.error(result.message || "Logout failed.");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div className={montserrat.className}>
      <Head>
        <title>
          {pageTitle ?? capitalizeWords(router.pathname.split("/")[2] ?? "")}
        </title>
      </Head>
      <aside
        className={`${
          isCollapsed
            ? "w-auto p-2"
            : "w-auto md:w-56 lg:w-72 p-2 md:p-3 lg:p-5"
        } bg-white h-screen transition-all duration-300 ease-in-out fixed inset-y-0 shadow-lg divide-y`}
      >
        <nav
          className={`flex items-center py-3 md:pb-5 gap-3 ${
            isCollapsed
              ? "flex-col-reverse justify-between"
              : "md:gap-x-6 justify-center md:justify-between"
          }`}
        >
          <div className="flex gap-x-4 items-center">
            <div
              className={`rounded-full overflow-hidden relative flex justify-center items-center aspect-square ${
                isCollapsed ? "w-10" : "w-10 md:w-14"
              }`}
            >
              <ImageShimmer
                priority
                sizes="100px"
                alt="user-image"
                fill
                className="object-cover h-full w-full rounded-full overflow-hidden"
                src="https://avatar.iran.liara.run/public/2"
              />
            </div>
            <div className={isCollapsed ? "hidden" : "hidden md:block"}>
              <h4 className="font-semibold text-admin-dark">Admin</h4>
              <p className="text-xs text-darkgray">Session ends in 9m 5s</p>
            </div>
          </div>
          <button className="hidden md:block" onClick={toggleSidebar}>
            <BiMenu className="text-xl text-admin-dark" />
          </button>
        </nav>
        <nav className="py-3 md:py-5">
          <ul className="flex flex-col gap-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center ${
                    isCollapsed
                      ? "justify-center p-3 aspect-square"
                      : "justify-center md:justify-start py-3 px-4"
                  } transition duration-200 rounded-lg ${
                    router.pathname.split("/").includes(item.path.split("/")[2])
                      ? "shadow-sm shadow-slate-100 border border-gray-100"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg text-admin-dark">{item.icon}</span>
                  <span
                    className={`text-base text-admin-hover-dark ${
                      isCollapsed ? "hidden" : "hidden md:block ml-3"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="pt-3 md:pt-5">
          {isCollapsed ? (
            <ButtonPrimaryIcon
              size="medium"
              onClick={handleLogout}
              title="Logout"
              icon={<BiLogOut />}
            />
          ) : (
            <div>
              <ButtonPrimaryIcon
                className="md:hidden"
                size="medium"
                onClick={handleLogout}
                title="Logout"
                icon={<BiLogOut />}
              />
              <ButtonPrimary
                className="hidden md:flex w-full"
                size="medium"
                onClick={handleLogout}
                title="Logout"
                icon={<BiLogOut />}
              />
            </div>
          )}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
