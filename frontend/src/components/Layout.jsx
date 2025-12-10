import { useEffect } from "react";
export default function Layout({ children }) {
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".iconBar");
      const back = document.querySelector(".backButton");
      const search =document.querySelector(".floatingSearchBtn");
      if (window.scrollY > 48) {
        nav?.classList.add("scrolled");
        back?.classList.add("scrolled");
        search?.classList.add("scrolled");
      } else {
        nav?.classList.remove("scrolled");
        back?.classList.remove("scrolled");
        search?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <>{children}</>;
}
