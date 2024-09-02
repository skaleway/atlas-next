// /** @type {import('next').NextConfig} */
const nextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: process.env.CODESPACES
  //         ? [
  //             {
  //               key: "X-Forwarded-Host",
  //               value: `${process.env.CODESPACE_NAME}-3000.github.dev`,
  //             },
  //             {
  //               key: "Access-Control-Allow-Origin",
  //               value: `https://${process.env.CODESPACE_NAME}-3000.github.dev`,
  //             },
  //           ]
  //         : [],
  //     },
  //   ];
  // },
};

export default nextConfig;
