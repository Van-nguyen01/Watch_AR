import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";

// This would normally come from a cart context/state
const initialCartItems: CartItem[] = [
  // Empty array to simulate an empty cart initially
  // In a real app, this would be populated from localStorage or API
];

type CartItem = {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0; // Free shipping over $100 could be implemented here
  const total = subtotal + shipping;
  
  // Update quantity handler
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // Remove item handler
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  
  // Empty cart UI
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        <Header />
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any watches to your cart yet.
              Browse our collection to find the perfect timepiece for you.
            </p>
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto">
                Start Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center">
                  {/* Product */}
                  <div className="col-span-6 flex gap-3 items-center">
                    <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="col-span-2 text-center">
                    <div className="sm:hidden text-sm text-gray-500 mb-1">Price</div>
                    ${item.price.toFixed(2)}
                  </div>
                  
                  {/* Quantity */}
                  <div className="col-span-2 text-center">
                    <div className="sm:hidden text-sm text-gray-500 mb-1">Quantity</div>
                    <div className="flex items-center justify-center border border-gray-300 rounded inline-flex">
                      <button 
                        className="px-2 py-1 border-r border-gray-300"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 border-l border-gray-300"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="col-span-2 text-center flex justify-between sm:justify-center items-center">
                    <div className="sm:hidden text-sm text-gray-500">Total</div>
                    <div className="flex items-center gap-3">
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Continue Shopping button */}
            <div className="mt-6">
              <Link href="/shop">
                <Button variant="ghost">
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link href="/checkout">
                <Button className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <div className="mt-6 text-sm text-gray-500">
                <p className="mb-2">We accept:</p>
                <div className="flex gap-2">
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}