import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center bg-[url(../src/assets/background/bg_incio_sesion.webp)] bg-cover bg-center px-4 sm:px-0">
      <div className="absolute z-10 h-full w-full bg-white/5 backdrop-blur-md"></div>
      <Outlet />
    </section>
  );
}
