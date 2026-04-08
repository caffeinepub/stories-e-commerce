import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import AdminPage from "@/pages/AdminPage";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import QuizPage from "@/pages/QuizPage";
import SurveyPage from "@/pages/SurveyPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <Outlet />
      <Toaster position="bottom-right" />
    </CartProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizPage,
});

const surveyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/survey",
  component: SurveyPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  productRoute,
  quizRoute,
  surveyRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
