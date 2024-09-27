import { FC } from "react";
import Input from "@/components/admin/elements/input";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import useAdminLogin from "@/hooks/admin/useAdminLogin";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { contact } from "@/constants/data";

const AdminLoginPage: FC = () => {
  const { state, actions } = useAdminLogin();
  return (
    <div className="p-2 md:p-6 w-screen h-screen flex justify-center items-center flex-col">
      <h1 className="text-2xl md:text-3xl mb-6">Admin {contact.company}</h1>

      <form
        onSubmit={actions.handleSubmit}
        className="max-w-xl flex flex-col gap-4 mt-12 w-full p-12"
      >
        <Input
          name="username"
          label="Username"
          type="username"
          onChange={actions.handleChange}
          value={state.formData.username}
          error={state.errors.username}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          onChange={actions.handleChange}
          value={state.formData.password}
          error={state.errors.password}
        />

        <div className="flex justify-end">
          <ButtonPrimary disabled={state.loading} title="Login" type="submit" />
        </div>
      </form>
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
