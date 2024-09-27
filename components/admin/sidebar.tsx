import { contact } from "@/constants/data";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { BiLogOut } from "react-icons/bi";
import {
  FaMap,
  FaClipboardList,
  FaBars,
  FaStar,
  FaList,
} from "react-icons/fa6";

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
    { name: "Category", path: "/admin/category", icon: <FaList /> },
    { name: "Destination", path: "/admin/destination", icon: <FaMap /> },
    { name: "Review", path: "/admin/reviews", icon: <FaStar /> },
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
    <>
      <Head>
        <title>
          {pageTitle ?? capitalizeWords(router.pathname.split("/")[2] ?? "")}
        </title>
      </Head>
      <aside
        className={`${
          isCollapsed ? "w-14 p-2" : "w-14 md:w-44 lg:w-64 p-5"
        } bg-gray-800 h-screen transition-all duration-300 fixed inset-y-0 rounded-r-lg shadow-lg`}
      >
        <div
          className={`flex w-full ${
            isCollapsed ? "justify-center" : "justify-between"
          } items-center text-white py-4 px-4`}
        >
          <span
            className={`text-lg font-semibold ${
              isCollapsed ? "hidden" : "hidden md:block"
            }`}
          >
            {contact.company}
          </span>
          <button onClick={toggleSidebar} className="text-white">
            <FaBars className="text-xl" />
          </button>
        </div>
        <nav className="mt-8">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="my-2">
                <Link
                  href={item.path}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-start"
                  } py-3 px-4 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition duration-200 ${
                    router.pathname === item.path ? "bg-gray-600" : ""
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span
                    className={`text-base ${
                      isCollapsed ? "hidden" : "hidden md:block ml-3"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
            <li className="mt-12">
              <button
                onClick={handleLogout}
                className={`flex items-center py-3 px-4 rounded-lg text-white bg-blue-500 w-full transition duration-200 hover:bg-blue-400 ${
                  isCollapsed ? "justify-center" : "justify-start"
                }`}
              >
                <span className="text-lg">
                  <BiLogOut />
                </span>
                <span
                  className={`text-base ${
                    isCollapsed ? "hidden" : "hidden md:block ml-3"
                  }`}
                >
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
