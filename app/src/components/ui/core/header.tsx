import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "@/lib/contexts";
import { deleteAuthCookieAction } from "@/lib/serverActions";
import { useRouter } from "next/navigation";

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
      <a className="flex items-center justify-center" href="#">
        <ShoppingCart className="h-6 w-6" />
        <span className="sr-only">E-Commerce Store</span>
      </a>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <a
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
        >
          Products
        </a>
        <a
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
        >
          Categories
        </a>
        {auth?.isAuthenticated ? (
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
            onClick={() => {
              deleteAuthCookieAction();
              router.refresh();
            }}
          >
            Signout
          </a>
        ) : (
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
            onClick={onSignUpClick}
          >
            Sign Up
          </a>
        )}
      </nav>
    </motion.header>
  );
}
