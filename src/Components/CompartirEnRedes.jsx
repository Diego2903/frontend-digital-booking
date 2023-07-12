import { useEffect, useRef, useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

const CompartirEnRedes = () => {
  const [showMenu, setShowMenu] = useState(false);

  const ref = useRef(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
       setShowMenu(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };
  const url = window.location.href;

  return (
    <div className="relative" ref={ref}>
      <button
        className="sharebtn relative flex z-10 bg-white pl-2 opacity-50 hover:opacity-100 focus:outline-none focus:border-gray-700"
        title="click to enable menu"
        onClick={handleShowMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-5 w-6 my-1 text-gray-900"
        >
          <path
            fill="currentColor"
            d="M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841L155.79 180.895C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z"
          ></path>
        </svg>
      </button>
      <div
        className="sharebtn-dropdown absolute left-0 mt-0 w-48 bg-white rounded-sm overflow-hidden shadow-lg z-20 hidden border border-gray-100"
        style={{ display: showMenu ? "block" : undefined }}
      >
        <a
          href="#"
          title="Share on Facebook (NB! does not work in this demo)"
          className="flex px-4 py-2 text-sm text-gray-800 border-b hover:bg-blue-100"
        >
          <FacebookShareButton
            url={url}
            quote="Facebook"
            className="flex  items-center"
          >
            <FacebookIcon size={32} round />{" "}
            <span className="ml-1">Facebook</span>
          </FacebookShareButton>
        </a>
        <a
          href="#"
          title="Share on Twitter (NB! does not work in this demo)"
          className="flex px-4 py-2 text-sm text-gray-800 border-b hover:bg-blue-100"
        >
          <TwitterShareButton
            url={url}
            quote="Facebook"
            className="flex  items-center"
          >
            <TwitterIcon size={32} round />{" "}
            <span className="ml-1">Twitter</span>
          </TwitterShareButton>
        </a>
        <a
          href="#"
          title="Share on LinkedIn (NB! does not work in this demo)"
          className="flex px-4 py-2 text-sm text-gray-800 border-b hover:bg-blue-100"
        >
          <LinkedinShareButton
            url={url}
            quote="Facebook"
            className="flex  items-center"
          >
            <LinkedinIcon size={32} round />{" "}
            <span className="ml-1">Linkedin</span>
          </LinkedinShareButton>
        </a>
      </div>
    </div>
  );
};

export default CompartirEnRedes;
