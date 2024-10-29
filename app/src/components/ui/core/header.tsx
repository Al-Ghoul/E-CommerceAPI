import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "@/lib/contexts";
import { deleteAuthCookieAction } from "@/lib/serverActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Header({ onSignUpClick }: { onSignUpClick: () => void }) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  return (
    <motion.header
      className="px-4 lg:px-6 h-14 flex items-center"
      initial={{
        opacity: 0,
        y: -50,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0,
        duration: 0.7,
      }}
    >
      <Link className="flex items-center justify-center" href="/">
        <ShoppingCart className="h-6 w-6" />
        <span className="sr-only">E-Commerce Store</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/"
        >
          Home
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/products"
        >
          Products
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/categories"
        >
          Categories
        </Link>
        {auth?.isAuthenticated ? (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
            onClick={async () => {
              await deleteAuthCookieAction();
              router.refresh();
            }}
          >
            Signout
          </Link>
        ) : (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
            onClick={onSignUpClick}
          >
            Sign Up
          </Link>
        )}
      </nav>
    </motion.header>
  );
}
