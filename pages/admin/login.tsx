import { FC } from "react";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import useAdminLogin from "@/hooks/admin/useAdminLogin";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { contact } from "@/constants/data";
import { montserrat } from "@/constants/font";
import { BiLogIn } from "react-icons/bi";

const AdminLoginPage: FC = () => {
  const { state, actions } = useAdminLogin();

  return (
    <div
      className={`flex justify-center items-center w-screen h-screen bg-[#f9f9f9] p-10 ${montserrat.className}`}
    >
      <div className="max-w-md w-full p-10 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl text-center text-gray-800 mb-4 font-medium font-montserrat">
          {contact.company} Administration Portal
        </h1>

        <p className="text-center text-gray-600 mb-6 font-montserrat">
          Please enter your credentials to access the administrative dashboard.
        </p>

        <form onSubmit={actions.handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 mb-1 font-montserrat"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={actions.handleChange}
              value={state.formData.username}
              className={`w-full p-3 border rounded-lg ${
                state.errors.username ? "border-red-500" : "border-gray-300"
              } font-montserrat`}
              placeholder="Enter your username"
            />
            {state.errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 mb-1 font-montserrat"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={actions.handleChange}
              value={state.formData.password}
              className={`w-full p-3 border rounded-lg ${
                state.errors.password ? "border-red-500" : "border-gray-300"
              } font-montserrat`}
              placeholder="Enter your password"
            />
            {state.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.password}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <ButtonPrimary
              icon={<BiLogIn />}
              disabled={state.loading}
              title="Login"
              type="submit"
              className="bg-blue-500 text-white rounded-lg w-full hover:bg-blue-400 transition font-montserrat"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookie = req.headers.cookie || "";
  const authToken = parse(cookie).authToken;

  if (authToken) {
    res.writeHead(302, { Location: "/admin" });
    res.end();
    return {
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default AdminLoginPage;
