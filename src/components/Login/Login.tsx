import Link from "next/link";
import img1 from "../../../public/home/4.jpg";

export default function Login() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${img1.src})`,
      }}
    >
      {/* Overlay with #5569B2 and 40% opacity */}
      <div className="absolute inset-0 bg-[#5569B2] opacity-60"></div>

      {/* Form Container */}
      <div className="relative bg-[#5569B2] text-white p-12 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
        <form>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#40528a] focus:border-[#40528a] sm:text-base text-black"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#40528a] focus:border-[#40528a] sm:text-base text-black"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-[#5569B2] py-3 px-5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#40528a] focus:ring-offset-2 font-bold text-lg"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-base text-center text-white">
          Don't have an account?{" "}
          <Link href="/register" className="text-gray-200 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
