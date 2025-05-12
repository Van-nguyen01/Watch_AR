// import { Switch, Route } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import NotFound from "@/pages/not-found";
// import Home from "@/pages/Home";
// import Shop from "@/pages/Shop";
// import ProductDetail from "@/pages/ProductDetail";
// import ProductAssets from "@/pages/ProductAssets";
// import TryOn from "@/pages/TryOn";
// import Cart from "@/pages/Cart";
// import Login from "@/pages/Login";
// import Register from "@/pages/Register";
// import Checkout from "@/pages/Checkout";
// import OrderSuccess from "@/pages/OrderSuccess";
// import Admin from "@/pages/Admin";

// function Router() {
//   return (
//     <Switch>
//       <Route path="/" component={Home} />
//       <Route path="/shop" component={Shop} />
//       <Route path="/product/:id" component={ProductDetail} />
//       <Route path="/product/:id/assets" component={ProductAssets} />
//       <Route path="/try-on/:id" component={TryOn} />
//       <Route path="/cart" component={Cart} />
//       <Route path="/login" component={Login} />
//       <Route path="/register" component={Register} />
//       <Route path="/checkout" component={Checkout} />
//       <Route path="/order-success" component={OrderSuccess} />
//       <Route path="/admin" component={Admin} />
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router />
//       <Toaster />
//     </QueryClientProvider>
//   );
// }

// export default App;

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import ProductAssets from "@/pages/ProductAssets";
import TryOn from "@/pages/TryOn";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Admin from "@/pages/Admin";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id/assets" element={<ProductAssets />} />
          <Route path="/try-on/:id" element={<TryOn />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

