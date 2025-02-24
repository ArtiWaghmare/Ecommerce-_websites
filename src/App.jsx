import { Suspense, lazy } from "react";
import "./App.css";

const Cards = lazy(() => import("./components/Cards"));

const App = () => {
  return (
    <div>
      <h1 className="text-center mt-4">Shoping Cart</h1>
      <Suspense fallback={<p className="text-center">Loading Cards...</p>}>
        <Cards />
      </Suspense>
    </div>
  );
};

export default App;
