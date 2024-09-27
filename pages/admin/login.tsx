import { FC } from "react";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import useAdminLogin from "@/hooks/admin/useAdminLogin";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { contact } from "@/constants/data";
import { TextField, Typography, Box, Paper } from "@mui/material";

const AdminLoginPage: FC = () => {
  const { state, actions } = useAdminLogin();

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <Paper elevation={2} className="max-w-md w-full p-6 rounded-md shadow-sm">
        <Typography variant="h5" className="text-center text-gray-800 ">
          {contact.company} Admin
        </Typography>

        <form onSubmit={actions.handleSubmit} className="flex flex-col gap-4 mt-8">
          <TextField
            name="username"
            onChange={actions.handleChange}
            value={state.formData.username}
            error={Boolean(state.errors.username)}
            label="Username"
            helperText={state.errors.username}
            variant="outlined"
            required
            className="rounded-md"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            error={Boolean(state.errors.password)}
            onChange={actions.handleChange}
            value={state.formData.password}
            helperText={state.errors.password}
            variant="outlined"
            required
            className="rounded-md"
          />

          <Box className="flex justify-end mt-4">
            <ButtonPrimary
              disabled={state.loading}
              title="Login"
              type="submit"
              className="bg-blue-600 text-white rounded-md w-full"
            />
          </Box>
        </form>
      </Paper>
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
