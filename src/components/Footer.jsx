import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const { t } = useSettings();

  return (
    <footer
      className="w-full py-6 mt-auto text-center bg-[rgba(53,39,24,0.65)] dark:bg-[rgba(17,24,39,0.9)] backdrop-blur-[8px] text-white dark:text-gray-200 transition-colors duration-300"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <p className="text-sm">
        &copy; {new Date().getFullYear()} RumboLibre. {t.footer_rights}
      </p>

      <p className="text-xs mt-1 text-[rgba(255,249,242,0.8)] dark:text-gray-400">
        <Link
          to="/terminos-condiciones"
          className="underline cursor-pointer hover:text-white dark:hover:text-gray-200 transition-colors"
        >
          {t.footer_terms}
        </Link>

        {" | "}

        <Link
          to="/politica-privacidad"
          className="underline cursor-pointer hover:text-white dark:hover:text-gray-200 transition-colors"
        >
          {t.footer_privacy}
        </Link>
      </p>
    </footer>
  );
}