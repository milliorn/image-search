import type { ReactNode } from "react";

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href}>{children}</a>
);

export default Link;
