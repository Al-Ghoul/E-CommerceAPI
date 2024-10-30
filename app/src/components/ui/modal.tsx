import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignInInputClientSchemaType,
  SignUpInputClientSchema,
  SignUpInputSchema,
  type SignUpInputClientSchemaType,
} from "@/zodTypes";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export function SignUpModal({
  isOpen,
  setIsOpenFN,
}: {
  isOpen: boolean;
  setIsOpenFN: Dispatch<SetStateAction<boolean>>;
}) {
  const [activeTab, setActiveTab] = useState("signup-tab");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "AuthRequired") {
      setActiveTab("signin-tab");
      new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
        toast.error("Please login to continue"),
      );
    }
  }, [error]);

  return (
    <div
      className={
        "fixed z-50 left-0 top-0 w-full h-full bg-black bg-opacity-50" +
        (isOpen || error === "AuthRequired" ? "" : " hidden")
      }
      onClick={() => setIsOpenFN(false)}
    >
      <div
        className="w-full bg-white max-w-md rounded mx-auto mt-16"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="relative flex justify-between pb-2">
          <button
            className={`flex-1 text-center py-2 ${activeTab === "signup-tab" ? "text-blue-500" : "text-gray-500"
              }`}
            onClick={() => setActiveTab("signup-tab")}
          >
            SignUp
          </button>
          <button
            className={`flex-1 text-center py-2 ${activeTab === "signin-tab" ? "text-blue-500" : "text-gray-500"
              }`}
            onClick={() => setActiveTab("signin-tab")}
          >
            SignIn
          </button>

          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded"
            animate={{ x: activeTab === "signup-tab" ? "5%" : "95%" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{ width: "50%" }}
          />
        </div>

        <div className="bg-white">
          {activeTab === "signup-tab" && (
            <SignUpInput setActiveTab={setActiveTab} />
          )}

          {activeTab === "signin-tab" && (
            <SignInInput setIsOpenFN={setIsOpenFN} />
          )}
        </div>
      </div>
    </div>
  );
}

function SignUpInput({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<string>>;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setSignUpError,
  } = useForm<SignUpInputClientSchemaType>({
    values: {
      email: "Abdo.AlGhouul@gmail.com",
      password: "12345678",
      confirmPassword: "12345678",
    },
    resolver: zodResolver(SignUpInputClientSchema),
  });
  const mutation = useMutation({
    mutationFn: async (data: SignUpInputClientSchemaType) => {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return Promise.reject(await response.json());
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setActiveTab("signin-tab");
    },
    onError: (error) => {
      if ("data" in error) {
        Object.entries(error.data as { [key: string]: Array<string> }).forEach(
          ([key, value]) => {
            setSignUpError(key as SignUpInputClientSchemaType & "root", {
              type: "custom",
              message: value[0],
            });
          },
        );
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <div
      className="bg-white p-8 pt-2 rounded-lg shadow-lg"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form
        onSubmit={handleSubmit((data) => {
          mutation.mutate(data);
        })}
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-400 p-2 rounded-lg"
                required
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="email"
          />
          {errors.email ? (
            <p className="text-red-500 mb-4 text-center">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-400 p-2 rounded-lg"
                required
                minLength={8}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="password"
          />
          {errors.password ? (
            <p className="text-red-500 mb-4 text-center">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            Confirm Password
          </label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full border border-gray-400 p-2 rounded-lg"
                required
                minLength={8}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="confirmPassword"
          />
          {errors.confirmPassword ? (
            <p className="text-red-500 mb-4 text-center">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-teal-50 text-white font-bold py-2 px-4 rounded"
          disabled={mutation.isPending}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

function SignInInput({
  setIsOpenFN,
}: {
  setIsOpenFN: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setSignUpError,
  } = useForm<SignInInputClientSchemaType>({
    values: {
      email: "Abdo.AlGhouul@gmail.com",
      password: "12345678",
    },
    resolver: zodResolver(SignUpInputSchema),
  });
  const router = useRouter();
  // const pathSegments = usePathname().split("/");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const mutation = useMutation({
    mutationFn: async (data: SignInInputClientSchemaType) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return Promise.reject(await response.json());
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setIsOpenFN(false);
      if (error === "AuthRequired") {
        router.replace("/");
      }
      router.refresh();
    },
    onError: (error) => {
      if ("data" in error) {
        Object.entries(error.data as { [key: string]: Array<string> }).forEach(
          ([key, value]) => {
            setSignUpError(key as SignInInputClientSchemaType & "root", {
              type: "custom",
              message: value[0],
            });
          },
        );
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <div
      className="bg-white p-8 pt-2 rounded-lg shadow-lg"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form
        onSubmit={handleSubmit((data) => {
          mutation.mutate(data);
        })}
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-400 p-2 rounded-lg"
                required
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="email"
          />
          {errors.email ? (
            <p className="text-red-500 mb-4 text-center">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-400 p-2 rounded-lg"
                required
                minLength={8}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="password"
          />
          {errors.password ? (
            <p className="text-red-500 mb-4 text-center">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-teal-50 text-white font-bold py-2 px-4 rounded"
          disabled={mutation.isPending}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
