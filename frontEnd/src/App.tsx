import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Authorisation from "./assets/Layouts/Authorisation";
import Reset from "./pages/Authorization/Reset";
import ResetPasswordPage from "./pages/Authorization/ResetPasswordPage";
import Pageoulet from "./assets/Layouts/Pageoulet";

// Lazy-loaded component
const Login = lazy(() => import("./pages/Authorization/Login"));
 
// Fallback component
const FallBack: React.FC = () => <div>🍷 Please wait ...</div>;

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/login" element={<Authorisation />} >
        <Route index element={<Login />} />
        <Route path="reset" element={<Reset />} />
        <Route path="otp/:reg" element={<ResetPasswordPage />} />
      </Route>

      <Route path="/" element={<Pageoulet />}>
        {/* <Route index element={<Home />} /> */}
      </Route>
      </>
    
    )
  );

  return (
    <Suspense fallback={<FallBack />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
