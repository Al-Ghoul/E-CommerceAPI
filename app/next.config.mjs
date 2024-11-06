/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  ...(process.env.OUTPUT_STANDALONE && { output: "standalone" }),
};

export default nextConfig;
