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
          isCollapsed ? "w-14" : "w-64"
        } bg-gray-900 h-screen transition-all duration-300 fixed inset-y-0`}
      >
        <div className="flex justify-between items-center text-white py-4 px-4">
          <span className={`text-lg ${isCollapsed ? "hidden" : ""}`}>
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
                  className={`flex items-center py-3 px-4 text-white hover:bg-gray-700 transition duration-200 ${
                    router.pathname === item.path ? "bg-gray-700" : ""
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className={`text-base ${isCollapsed ? "hidden" : ""}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
            <li className="mt-12">
              <button
                onClick={handleLogout}
                className="flex items-center py-3 px-4 text-white bg-gray-700 w-full transition duration-200 hover:bg-gray-600"
              >
                <span className="mr-3 text-lg">
                  <BiLogOut />
                </span>
                <span className={`text-base ${isCollapsed ? "hidden" : ""}`}>
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
