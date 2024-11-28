import { FC } from "react";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import useAdminLogin from "@/hooks/admin/useAdminLogin";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { contact } from "@/constants/data";
import { montserrat } from "@/constants/font";
import { BiLogIn } from "react-icons/bi";
import Input from "@/components/admin/elements/input";

const AdminLoginPage: FC = () => {
  const { state, actions } = useAdminLogin();

  return (
    <div
      className={`flex justify-center items-center w-screen h-screen bg-white md:bg-[#f9f9f9] md:p-10 ${montserrat.className}`}
    >
      <div className="max-w-md w-full p-10 bg-white rounded-2xl md:shadow-lg">
        <h1 className="text-3xl text-center text-gray-800 mb-4 font-medium font-montserrat">
          {contact.company} Administration Portal
        </h1>

        <p className="text-center text-gray-600 mb-6 font-montserrat">
          Please enter your credentials to access the administrative dashboard.
        </p>

        <form onSubmit={actions.handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Username"
            id="username"
            name="username"
            onChange={actions.handleChange}
            value={state.formData.username}
            placeholder="Enter your username"
            error={state.errors.username}
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            onChange={actions.handleChange}
            value={state.formData.password}
            placeholder="Enter your password"
            error={state.errors.password}
          />

          <div className="flex justify-end">
            <ButtonPrimary
              icon={<BiLogIn />}
              disabled={state.loading}
              title="Login"
              type="submit"
              className="flex justify-center"
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
