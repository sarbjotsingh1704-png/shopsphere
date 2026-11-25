import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { removeFromCart, updateQty } from '../redux/slices/cartSlice';

export default function Cart() {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) return navigate('/login?redirect=/checkout');
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="bg-primary text-white px-6 py-2 rounded-md">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
            <img
              src={item.image || 'https://via.placeholder.com/80'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-500">${item.price}</p>
            </div>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.qty}
              onChange={(e) =>
                dispatch(updateQty({ id: item.id, qty: Number(e.target.value) }))
              }
              className="w-16 border rounded-md px-2 py-1"
            />
            <span className="font-semibold w-20 text-right">
              ${(item.price * item.qty).toFixed(2)}
            </span>
            <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="w-full md:w-80 border rounded-lg p-6">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-500 text-sm">
            <span>Shipping & tax calculated at checkout</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-accent text-white py-3 rounded-md font-medium hover:opacity-90"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
