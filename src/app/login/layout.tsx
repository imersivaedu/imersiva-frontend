import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Imersiva",
  description: "Faça login no sistema educacional Imersiva",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
