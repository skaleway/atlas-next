import Link from "next/link";
import React from "react";

interface LogoProps {
  link: string;
  text?: boolean;
}

const Logo = ({ link, text }: LogoProps) => {
  return <Link href={link}>Atlas</Link>;
};

export default Logo;
