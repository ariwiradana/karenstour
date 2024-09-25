import { capitalizeWords } from "@/utils/capitalizeWords";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaMap, FaClipboardList, FaBars, FaStar } from "react-icons/fa6";

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
    { name: "Booking", path: "/admin/booking", icon: <FaClipboardList /> },
    {
      name: "Destination",
      path: "/admin/destination",
      icon: <FaMap />,
    },
    {
      name: "Review",
      path: "/admin/reviews",
      icon: <FaStar />,
    },
  ];

  const pageTitle = menuItems.find(
    (menu) => menu.path === router.pathname
  )?.name;

  return (
    <>
      <Head>
        <title>
          {pageTitle ?? capitalizeWords(router.pathname.split("/")[2] ?? "")}
        </title>
      </Head>
      <aside
        className={`${
          isCollapsed ? "w-10 md:w-14" : "w-10 md:w-64"
        } bg-gray-800 h-screen transition-all duration-300 fixed inset-y-0`}
      >
        <div className="flex justify-between items-center text-white py-4 px-[9px] md:px-4 text-xl gap-x-4">
          <span
            className={`${
              isCollapsed ? "hidden" : "hidden md:block"
            } text-base lg:text-xl`}
          >
            Admin Panel
          </span>
          <button onClick={toggleSidebar} className="text-white outline-none">
            <FaBars className="text-lg md:text-xl" />
          </button>
        </div>
        <nav className="mt-10">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="my-2">
                <Link
                  href={item.path}
                  className={`flex items-center py-2 px-3 md:px-4 text-white hover:bg-gray-700 ${
                    router.pathname === item.path ? "bg-gray-700" : ""
                  }`}
                >
                  <span className="mr-3 text-sm md:text-lg">{item.icon}</span>
                  <span
                    className={`${
                      isCollapsed ? "hidden" : "hidden md:block"
                    } text-sm md:text-base`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
