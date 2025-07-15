import { useState } from "react";

import {
  Banknote,
  HandCoins,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  User,
  Users,
} from "lucide-react";

import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import Profile from "@/Components/Profile";
import { Link } from "@inertiajs/react";

import FlashMessage from "./FlashMessage";

function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}) {
  const LINKS = [
    {
      href: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      isVisible: true,
    },
    {
      href: "user.index",
      name: "Anggota",
      icon: <Users size={18} />,
      isVisible: true,
    },
    {
      href: "transaction.index",
      name: "Transaksi",
      icon: <Banknote size={18} />,

      isVisible: true,
    },
    {
      href: "saving.index",
      name: "Simpanan",
      icon: <PiggyBank size={18} />,
      isVisible: true,
    },
    {
      href: "loan.index",
      name: "Pinjaman",
      icon: <HandCoins size={18} />,
      isVisible: true,
    },
  ];

  return (
    <aside
      className={`z-20 fixed top-0 left-0 h-full w-48 bg-white border-r border-gray-200 p-4 transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-700">Koperasi</span>
        </Link>
        <button
          className="sm:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✖
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {LINKS.map(
          (link, i) =>
            link?.isVisible && (
              <NavLink
                key={i}
                href={route(link.href)}
                active={route().current(link.href)}
                className="flex items-center gap-3 p-3 text-sm transition hover:bg-gray-100"
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            )
        )}
      </nav>
    </aside>
  );
}

function Header({
  header,
  user,
  setIsSidebarOpen,
}: {
  header: React.ReactNode;
  user: any;
  setIsSidebarOpen: (value: boolean) => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 h-16 pl-52 pr-6 flex items-center justify-between">
      <button
        className="sm:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      <div className="text-lg font-semibold">{header}</div>

      <div className="flex items-center gap-4 ms-auto">
        <Dropdown>
          <Dropdown.Trigger>
            <button className="font-secondary inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
              <Profile user={user} />
              <svg
                className="ms-2 -me-0.5 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Link
              href={route("profile.edit")}
              as="button"
              className="flex items-center gap-2"
            >
              <User size={14} /> Profile
            </Dropdown.Link>
            <Dropdown.Link
              href={route("logout")}
              method="post"
              as="button"
              className="text-red-500 font-semibold flex items-center gap-2"
            >
              <LogOut size={14} /> Log Out
            </Dropdown.Link>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </header>
  );
}

export default function Authenticated({
  user,
  children,
  header,
}: {
  user: any;
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <Header header={header} user={user} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col pt-8 pl-52 pr-4">
        <FlashMessage />
        <main className="flex-1 50 py-12 pr-10">{children}</main>
      </div>
    </div>
  );
}
