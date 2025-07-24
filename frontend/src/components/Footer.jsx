import React from "react";
import { FaPenAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-800 text-white shadow-inner shadow-gray-950 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand & Description */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <FaPenAlt /> Chat Application
          </h2>
          <p className="text-gray-300">
            Building real‑time connections—one chat at a time. Stay in touch, collaborate, and share moments.
          </p>
          <div className="flex space-x-4 mt-4">
            {[FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
              >
                <Icon size={16} className="text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Pages</h3>
          <ul className="space-y-2 text-gray-300">
            {[
              { to: "/", label: "Chat App" },
              { to: "/signin", label: "Sign In" },
              { to: "/signup", label: "Sign Up" },
              { to: "/home", label: "Home" },
            ].map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.to}
                  className="hover:text-blue-600 hover:underline transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Resources</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a
                href="#"
                className="hover:text-blue-600 hover:underline transition"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 hover:underline transition"
              >
                FAQs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 hover:underline transition"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 hover:underline transition"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Stay Updated</h3>
          <p className="text-gray-300">
            Subscribe to our newsletter for the latest updates and tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-md text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} Chat Application. All rights reserved.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          <Link className="hover:text-blue-600 transition" to="/terms">
            Terms
          </Link>
          <Link className="hover:text-blue-600 transition" to="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-blue-600 transition" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
