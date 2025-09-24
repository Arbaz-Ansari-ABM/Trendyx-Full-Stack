import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { useSelector } from "react-redux";

function QuantityButton({
  product,
  handleAddtoCart,
  handleUpdateQuantity,
  className = "w-full"
}) {
  const { cartItems } = useSelector((state) => state.shopCart);
  
  // Check if product is already in cart
  const cartItem = cartItems?.items?.find(item => item.productId === product._id);
  const currentQuantity = cartItem?.quantity || 0;
  
  const handleIncrease = () => {
    if (currentQuantity === 0) {
      // First time adding to cart
      handleAddtoCart(product._id, product.totalStock);
    } else if (currentQuantity < product.totalStock) {
      // Increase quantity
      handleUpdateQuantity(product._id, currentQuantity + 1);
    }
  };
  
  const handleDecrease = () => {
    if (currentQuantity > 1) {
      // Decrease quantity
      handleUpdateQuantity(product._id, currentQuantity - 1);
    } else if (currentQuantity === 1) {
      // Remove from cart completely
      handleUpdateQuantity(product._id, 0);
    }
  };
  
  // If product is out of stock
  if (product.totalStock === 0) {
    return (
      <Button className={`${className} opacity-60 cursor-not-allowed`}>
        Out Of Stock
      </Button>
    );
  }
  
  // If item is not in cart, show "Add to Cart" button
  if (currentQuantity === 0) {
    return (
      <Button
        onClick={handleIncrease}
        className={className}
      >
        Add to cart
      </Button>
    );
  }
  
  // If item is in cart, show quantity controls
  return (
    <div className={`flex items-center justify-center ${className.includes('w-full') ? 'w-full' : className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrease}
        className="h-8 w-8 rounded-full p-0"
        disabled={currentQuantity <= 0}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <span className="mx-3 min-w-[2rem] text-center font-semibold text-base">
        {currentQuantity}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrease}
        className="h-8 w-8 rounded-full p-0"
        disabled={currentQuantity >= product.totalStock}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default QuantityButton;