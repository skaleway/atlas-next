import Image from "next/image";
import React from "react";

const WhatWeOffer = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Assistive Technology
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Empowering Learners, Transforming Education
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              ATLAS is a comprehensive platform that integrates cutting-edge
              assistive technologies to support diverse learners and enhance
              educational experiences.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <Image
            src="/placeholder.svg"
            width={700}
            height={400}
            alt="ATLAS Dashboard"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Personalized Learning</h3>
                  <p className="text-muted-foreground">
                    Adaptive tools and customizable interfaces empower learners
                    to engage with content in their preferred ways.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Inclusive Assessments</h3>
                  <p className="text-muted-foreground">
                    Accessible assessment options ensure all students can
                    demonstrate their knowledge and skills.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Collaborative Tools</h3>
                  <p className="text-muted-foreground">
                    Seamless communication and collaboration features foster
                    inclusive learning environments.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
