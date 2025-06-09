"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaStar, FaHome, FaFileAlt, FaRocket } from "react-icons/fa";
import { useMemo } from "react";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: FaHome },
  { label: "Spotlights", href: "/admin/spotlights", icon: FaStar },
  { label: "Agreements", href: "/admin/agreements", icon: FaFileAlt },
  { label: "Startups", href: "/admin/startups", icon: FaRocket },
];

const Sidebar = () => {
  const pathname = usePathname();
  const activeIndex = useMemo(
    () => navItems.findIndex((item) => item.href === pathname),
    [pathname]
  );

  const router = useRouter();

  const handleRoute = () => {
    router.push("/");
  };

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-100 shadow-md flex flex-col justify-between z-10">
      <div>
        {/* Logo */}
        <div className="px-14 pt-4 ">
          <Image
            src="/nifo.svg"
            alt="Nifo Logo"
            width={100}
            height={100}
            className="w-36 cursor-pointer"
            onClick={handleRoute}
          />
        </div>

        {/* Nav Section */}
        <div className="relative mt-3">
          {/* Animated Highlight */}
          <div
            className="absolute w-[220px] h-12 bg-primary left-5 rounded-lg transition-transform duration-[650ms] ease-in-out"
            style={{
              transform: `translateY(${activeIndex * 52}px)`,
            }}
          />

          <nav className="flex flex-col relative z-10 gap-1 px-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-3 pl-10 px-6 h-12 font-medium rounded-full transition-all duration-300 ease-in-out
                    ${isActive ? "text-white scale-105 " : "text-gray-700 hover:scale-[1.02] hover:text-primary "}
                  `}
                >
                  <Icon
                    className={`text-base transition-colors  duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-primary"
                    }`}
                  />
                  <span className="text-sm">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 py-4 border-t">
        © 2025 Nifo Admin
      </div>
    </aside>
  );
};

export default Sidebar;
