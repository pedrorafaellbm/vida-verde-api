import { Outlet } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import { Footer } from "./Footer.jsx";


export default function Layout() {
  return (
    <>
      <NavBar />
      <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: "30vh" }}>
        <Outlet /> {/* Aqui entram as páginas */}
      </main>
      <Footer />
    </>
  );
}
