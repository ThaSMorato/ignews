import { ReactElement, cloneElement } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

interface AtiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export const ActiveLink = ({ children, activeClassName, ...props }: AtiveLinkProps) => {
  const { asPath } = useRouter();

  const className = asPath === props.href ? activeClassName : "";

  return <Link {...props}>{cloneElement(children, { className })}</Link>;
};
