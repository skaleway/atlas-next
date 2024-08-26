import Link from "next/link";
import React from "react";

const WhatWeProvide = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container space-y-12 px-4 md:px-6">
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
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Personalized Learning</h3>
            <p className="text-sm text-muted-foreground">
              Adaptive tools and customizable interfaces empower learners to
              engage with content in their preferred ways.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Inclusive Assessments</h3>
            <p className="text-sm text-muted-foreground">
              Accessible assessment options ensure all students can demonstrate
              their knowledge and skills.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Collaborative Tools</h3>
            <p className="text-sm text-muted-foreground">
              Seamless communication and collaboration features foster inclusive
              learning environments.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Data-Driven Insights</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive analytics and reporting help educators understand
              student progress and needs.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Accessible Content</h3>
            <p className="text-sm text-muted-foreground">
              Integrated tools ensure educational materials are accessible to
              learners with diverse needs.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Flexible Integration</h3>
            <p className="text-sm text-muted-foreground">
              ATLAS seamlessly integrates with existing learning management
              systems and workflows.
            </p>
          </div>
        </div>
        <div className="flex justify-center flex-col sm:flex-row items-start gap-4">
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Sign Up as Student
          </Link>
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Sign Up as Teacher
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatWeProvide;
