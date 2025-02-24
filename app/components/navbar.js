"use client";

import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { useSession, signOut } from "next-auth/react";
import ContactForm from "./ContactForm";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-4 left-4 right-4 backdrop-blur-md p-4 bg-background-light/75 text-light rounded-3xl border z-50 flex justify-between items-center">
      <a href="/" className="text-2xl font-extrabold tracking-wide">
        Appify
      </a>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex space-x-6 text-lg font-medium sm:mr-10">
        <button
          // onClick={() => setIsOpen(true)}
          className="bg-indigo-500 text-white px-2 py-1 rounded-xl text-sm hover:bg-indigo-600 transition"
        >
          List
        </button>
        <a href="#" className="hover:text-indigo-500 transition">
          Games
        </a>
        <a href="#" className="hover:text-indigo-500 transition">
          Apps
        </a>
        {status === "authenticated" ? (
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-2 py-1 rounded-xl text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <a
            href="/auth"
            className="bg-indigo-500 text-white px-2 py-1 rounded-xl text-sm hover:bg-indigo-600 transition"
          >
            Login
          </a>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="sm:hidden text-3xl focus:outline-none"
      >
        {mobileMenuOpen ? <IoClose /> : <GiHamburgerMenu />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-background-light/95 backdrop-blur-md shadow-xl transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out sm:hidden flex flex-col gap-6 p-6`}
      >
        <a href="#" className="hover:text-indigo-500 transition">
          Games
        </a>
        <a href="#" className="hover:text-indigo-500 transition">
          Apps
        </a>
        <button
          onClick={() => {
            setIsOpen(true);
            setMobileMenuOpen(false);
          }}
          className="bg-indigo-500 text-white px-2 py-1 rounded-xl text-sm hover:bg-indigo-600 transition"
        >
          List
        </button>
        {status === "authenticated" ? (
          <button
            onClick={() => {
              signOut();
              setMobileMenuOpen(false);
            }}
            className="bg-red-500 text-white px-2 py-1 rounded-xl text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <a
            href="/auth"
            className="bg-indigo-500 text-white px-2 py-1 rounded-xl text-sm hover:bg-indigo-600 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </a>
        )}
      </div>

      {/* Contact Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
            >
              <IoClose />
            </button>
            <ContactForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
