import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { capturePayment } from "@/store/shop/order-slice";
import { clearCartItems, fetchCartItems, clearCart } from "@/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import OrderSuccessDialog from "./order-success-dialog";

function StripeCheckout({ clientSecret, orderId, paymentIntentId, onPaymentSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "4242 4242 4242 4242", // Demo card number
    expiry: "12/25",
    cvc: "123",
    name: "Demo User"
  });
  
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call backend to capture payment
      const result = await dispatch(capturePayment({
        paymentIntentId,
        orderId
      }));
      
      if (result.payload.success) {
        // Store order data for the success dialog
        setOrderData({
          orderId: orderId,
          orderStatus: result.payload.orderStatus || "confirmed"
        });

        // Clear cart items after successful payment
        if (user?.id) {
          // First clear on server side (already done in capturePayment)
          // Then refresh the cart data to reflect empty state
          await dispatch(fetchCartItems(user.id));
          
          // Also trigger clearCart action to immediately update UI
          dispatch(clearCart());
        }
        
        // Clear session storage
        sessionStorage.removeItem("currentOrderId");
        sessionStorage.removeItem("currentPaymentIntentId");
        
        // Show success dialog instead of navigating immediately
        setShowSuccessDialog(true);
        
        toast({
          title: "Payment successful!",
          description: "Your order has been confirmed and your cart has been cleared.",
          variant: "success"
        });
      } else {
        throw new Error(result.payload.message || "Payment failed");
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    // Navigate to success page after dialog is closed
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>
            Enter your payment details to complete your order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={paymentForm.cardNumber}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry</Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={paymentForm.expiry}
                onChange={handleInputChange}
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                name="cvc"
                placeholder="123"
                value={paymentForm.cvc}
                onChange={handleInputChange}
                disabled={isProcessing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={paymentForm.name}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
          </div>
          
          <Button 
            onClick={handlePayment} 
            className="w-full mt-6" 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing Payment..." : "Pay Now"}
          </Button>
          
          <p className="text-sm text-gray-500 text-center mt-2">
            This is a demo payment form. Use the pre-filled card details for testing.
          </p>
        </CardContent>
      </Card>

      {/* Order Success Dialog */}
      <OrderSuccessDialog 
        isOpen={showSuccessDialog}
        onClose={handleCloseSuccessDialog}
        orderData={orderData}
      />
    </>
  );
}

export default StripeCheckout;