"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface AdminNavProps {
  userEmail: string | null | undefined;
}

export default function AdminNav({ userEmail }: AdminNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Desktop Links */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link href="/admin/dashboard" className="text-lg sm:text-xl font-bold hover:text-accent">
              Panel Admin
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/admin/restaurants/new" className="hover:text-accent">
                Nuevo Restaurante
              </Link>
              <Link href="/" target="_blank" className="hover:text-accent">
                Ver Sitio
              </Link>
            </div>
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="bg-secondary hover:bg-secondary-dark px-4 py-2 rounded transition text-sm"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-primary-dark rounded"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary-dark space-y-3">
            <Link
              href="/admin/restaurants/new"
              className="block py-2 px-3 hover:bg-primary-dark rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nuevo Restaurante
            </Link>
            <Link
              href="/"
              target="_blank"
              className="block py-2 px-3 hover:bg-primary-dark rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ver Sitio
            </Link>
            <div className="pt-2 border-t border-primary-dark">
              <p className="text-sm text-gray-300 px-3 mb-2">{userEmail}</p>
              <button
                onClick={handleSignOut}
                className="w-full bg-secondary hover:bg-secondary-dark px-3 py-2 rounded transition text-left"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
