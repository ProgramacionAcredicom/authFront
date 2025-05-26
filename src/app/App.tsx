import Providers from "@/app/Providers";
import { RouterApp } from "@/routes/Router";

export default function App() {
  return (
    <Providers>
      <RouterApp />
    </Providers>
  );
}
