import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section className="w-full pt-12 md:pt-24 lg:pt-32">
      <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
        <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              Unlock the Power of Assistive Technology
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              ATLAS is a cutting-edge platform that empowers learners and
              educators with innovative assistive technologies.
            </p>
            <div className="space-x-4 mt-6">
              <Link
                href="/auth/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Sign Up as Student
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Sign Up as Teacher
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              src="/placeholder.svg"
              width="700"
              height="400"
              alt="ATLAS Dashboard"
              className="mx-auto aspect-[7/4] overflow-hidden rounded-xl object-cover object-center sm:w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
