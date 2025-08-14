// src/Components/Login.jsx

import logo from "../assets/logo.png";

const Login = () => {
  return (
    <section className="h-full">
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src={logo}
          alt="Your Company"
          class="mx-auto h-50 w-auto"
        />
        <h2 class="text-center text-2xl/9 font-bold tracking-tight text-black">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm/6 font-medium text-gray-800"
            >
              Email address
            </label>
            <div class="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                required
                autocomplete="email"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-800 outline-1 -outline-offset-1 outline-gray-800 placeholder:text-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm/6 font-medium text-gray-800"
              >
                Password
              </label>
              <div class="text-sm">
                <a
                  href="#"
                  class="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div class="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                required
                autocomplete="current-password"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-800 outline-1 -outline-offset-1 outline-gray-800 placeholder:text-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <a className="hover:cursor-pointer">
          <p class="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?
          </p>
        </a>
      </div>
    </div>
    </section>
  );
};

export default Login;
