import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow container py-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase! Your order has been received and is being processed.
            You will receive a confirmation email with your order details shortly.
          </p>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium">#WA12345</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">Credit Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Method</span>
                <span className="font-medium">Standard Shipping</span>
              </div>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>$211.99</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="flex-1">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/account/orders">
              <Button size="lg" className="flex-1">
                View Orders
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}