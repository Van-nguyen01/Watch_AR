import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { CreditCard, Check } from "lucide-react";

export default function Checkout() {
  const [, navigate] = useLocation();
  
  // This would normally come from a cart context/state
  const cartTotal = 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment
    navigate("/order-success");
  };
  
  // Empty cart or no items
  if (cartTotal <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        <Header />
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">No Items to Checkout</h1>
            <p className="text-gray-600 mb-8">
              Your cart is empty. Add some items before proceeding to checkout.
            </p>
            <Link href="/shop">
              <Button size="lg">
                Browse Watches
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
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <Input placeholder="Enter your first name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <Input placeholder="Enter your last name" required />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input type="email" placeholder="Enter your email" required />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input type="tel" placeholder="Enter your phone number" required />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input placeholder="Enter your street address" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input placeholder="City" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State/Province</label>
                    <Input placeholder="State/Province" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <Input placeholder="Postal code" required />
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiration Date</label>
                    <Input placeholder="MM/YY" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <Input placeholder="123" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zip/Postal Code</label>
                    <Input placeholder="Postal code" required />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="save-card" />
                  <label
                    htmlFor="save-card"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Save card for future purchases
                  </label>
                </div>
              </div>
              
              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                    <input 
                      type="radio" 
                      id="standard" 
                      name="shipping" 
                      value="standard"
                      defaultChecked
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="standard" className="flex-grow">
                      <div className="font-medium">Standard Shipping</div>
                      <div className="text-sm text-gray-500">Delivery in 3-5 business days</div>
                    </label>
                    <div className="font-medium">Free</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                    <input 
                      type="radio" 
                      id="express" 
                      name="shipping" 
                      value="express"
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="express" className="flex-grow">
                      <div className="font-medium">Express Shipping</div>
                      <div className="text-sm text-gray-500">Delivery in 1-2 business days</div>
                    </label>
                    <div className="font-medium">$12.99</div>
                  </div>
                </div>
              </div>
              
              <Button type="submit" size="lg" className="w-full">
                Complete Purchase
              </Button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal (1 item)</span>
                  <span>$199.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>$12.00</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>$211.99</span>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Secure payment processing</span>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                By completing your purchase, you agree to our{" "}
                <Link href="/terms">
                  <a className="text-primary hover:underline">Terms of Service</a>
                </Link>{" "}
                and{" "}
                <Link href="/privacy">
                  <a className="text-primary hover:underline">Privacy Policy</a>
                </Link>.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}