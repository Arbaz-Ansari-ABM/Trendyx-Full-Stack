import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Package, Home } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl text-green-600">
            Payment Successful! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you for your purchase! Your order has been confirmed and your cart has been cleared.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Package className="w-4 h-4" />
            <span>Order confirmation sent to your email</span>
          </div>
          
          <div className="space-y-3 pt-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={() => navigate("/shop/account")}
            >
              <Package className="w-4 h-4 mr-2" />
              View My Orders
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/shop/home")}
            >
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
