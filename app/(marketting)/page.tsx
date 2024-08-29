import { Hero, Unlock, WhatWeOffer, WhatWeProvide } from "./_components";

export default function Component() {
  return (
    <div className="flex flex-col min-h-dvh ">
      <main className="flex-1">
        <Hero />
        <WhatWeProvide />
        <Unlock />
        <WhatWeOffer />
        <Unlock variant />
      </main>
    </div>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
