import { Suspense } from "react";
import { RouterApp } from "./routes/Router";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterApp />
    </Suspense>
  );
}

export default App;
