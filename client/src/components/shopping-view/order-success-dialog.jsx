import { CheckCircle, Package, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function OrderSuccessDialog({ isOpen, onClose, orderData }) {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate("/shop/account");
    onClose();
  };

  const handleContinueShopping = () => {
    navigate("/shop/home");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl text-green-600">
            Order Placed Successfully! 🎉
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </DialogDescription>
        </DialogHeader>
        
        {orderData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-sm">Order ID:</span>
              <span className="text-sm text-gray-600">#{orderData.orderId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-sm">Status:</span>
              <span className="text-sm text-gray-600 capitalize">{orderData.orderStatus || 'Processing'}</span>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Button 
            onClick={handleViewOrders}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            View My Orders
          </Button>
          <Button 
            onClick={handleContinueShopping}
            variant="outline"
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            You will receive a confirmation email shortly with order details.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderSuccessDialog;