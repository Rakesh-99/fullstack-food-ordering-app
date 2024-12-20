import { Eye, EyeOff, Loader, LockKeyhole, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { loginDataType, userLoginSchema } from "../zod/schema-user/user";
import { useUserStore } from "../store/userStore";




const Login = () => {

  const { isAuthenticated, login, loading } = useUserStore((state) => state);
  const navigate = useNavigate();





  const [formError, setFormError] = useState<Partial<loginDataType>>();

  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const [loginInputData, setLoginInputData] = useState<loginDataType>({
    email: "",
    password: "",
  });

  const inputChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInputData({ ...loginInputData, [name]: value });
  };

  const formSubmitHandle = async (e: FormEvent) => {
    e.preventDefault();

    // Form validation using zod

    const result = userLoginSchema.safeParse(loginInputData);

    if (result.error) {
      const catchErr = result.error.formErrors.fieldErrors;
      setFormError(catchErr as Partial<loginDataType>);
      return false;
    }

    // if user enters the correct info, set the form error to undefined :
    setFormError({
      email: undefined,
      password: undefined
    });

    // Login api implementation : 
    try {
      await login(loginInputData);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect to track the isAuthenticated state changes : 
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated])

  return (
    <>
      <div className="w-full select-none flex-col h-screen flex justify-center items-center">
        <h1 className="text-4xl text-gray-600 font-bold my-10">Welcome back</h1>

        {/* Form  */}
        <form
          onSubmit={formSubmitHandle}
          className="md:border lg:border md:w-2/3 lg:w-1/3 w-full  p-5 rounded-md"
        >
          {/* Username  */}
          <label className="">Enter email</label>
          <div className="mb-4 relative">
            <Input
              name="email"
              value={loginInputData.email}
              className="pl-10 text-lg focus-visible:ring-0"
              type="text"
              placeholder="Email"
              onChange={inputChangeHandle}
            />
            <Mail className="absolute inset-y-2 left-2 text-gray-500 w-5 h-5 pointer-events-none" />
            {formError && (
              <p className="text-xs text-red-500">{formError.email}</p>
            )}
          </div>

          {/* Password  */}
          <label className="">Enter passowrd</label>
          <div className="mb-4 relative">
            <Input
              name="password"
              value={loginInputData.password}
              className="pl-10 text-lg focus-visible:ring-0"
              type={`${hidePassword ? "password" : "text"}`}
              placeholder="Password"
              onChange={inputChangeHandle}
            />
            {/* Show and hide password  */}
            {hidePassword ? (
              <EyeOff
                onClick={() => setHidePassword(!hidePassword)}
                className="absolute inset-y-2 cursor-pointer active:scale-95 text-gray-500 right-5 w-5 h-5"
              />
            ) : (
              <Eye
                onClick={() => setHidePassword(!hidePassword)}
                className="absolute inset-y-2 cursor-pointer w-5 h-5 active:scale-95 text-gray-500 right-5"
              />
            )}

            <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 w-5 h-5 pointer-events-none" />
            {formError && (
              <p className="text-red-500 text-xs">{formError.password}</p>
            )}
          </div>
          <div className="transition-all duration-1000">
            {loading ? (
              <Button
                disabled
                className="w-full py-6 flex gap-2 items-center text-lg bg-dayAccentColor hover:bg-dayAccentColorOnHover"
              >
                <Loader className="animate-spin" />
                Please wait..
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full  py-6 text-lg bg-dayAccentColor hover:bg-dayAccentColorOnHover"
              >
                Login
              </Button>
            )}
          </div>

          {/* Forget password  */}
          <div className="my-3 flex items-center gap-1">

            <p>Forget password ?</p>
            <Link to={'/forget-password'} className="text-blue-500 hover:text-blue-400 transition-all hover:underline">click </Link>
          </div>

          <Separator className="my-5" />

          <p className="flex gap-1">
            Don't have an account ?
            <NavLink
              to="/signup"
              className="transition-all text-blue-600 hover:underline cursor-pointer hover:text-blue-400"
            >
              Signup
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
