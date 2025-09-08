// app/layout.jsx
import { Header } from "@/components/Header";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

export const revalidate = 0;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
