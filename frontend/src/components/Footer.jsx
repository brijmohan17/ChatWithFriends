import React from "react";
import { FaPenAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full glass text-white shadow-lg py-12 px-6 mt-8 border-t border-slate-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand & Description */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <FaPenAlt className="text-blue-400" /> <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Chat Application</span>
          </h2>
          <p className="text-gray-300">
            Building real‑time connections—one chat at a time. Stay in touch, collaborate, and share moments.
          </p>
          <div className="flex space-x-4 mt-4">
            {[FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full shadow-md hover:scale-110 hover:from-blue-600 hover:to-cyan-500 transition-all"
              >
                <Icon size={18} className="text-white" />
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
                  className="hover:text-cyan-400 hover:underline transition-all font-medium"
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
                className="hover:text-cyan-400 hover:underline transition-all font-medium"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-cyan-400 hover:underline transition-all font-medium"
              >
                FAQs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-cyan-400 hover:underline transition-all font-medium"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-cyan-400 hover:underline transition-all font-medium"
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
              className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none shadow-md border border-slate-200"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-cyan-500 transition-all"
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
          <Link className="hover:text-cyan-400 transition-all font-medium" to="/terms">
            Terms
          </Link>
          <Link className="hover:text-cyan-400 transition-all font-medium" to="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-cyan-400 transition-all font-medium" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
