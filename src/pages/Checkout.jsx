import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function Checkout() {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [address, setAddress] = useState({
    address: '', city: '', state: '', postalCode: '', country: '', phone: '',
  });
  const [processing, setProcessing] = useState(false);

  const shippingPrice = totalPrice > 100 ? 0 : 9.99;
  const taxPrice = Number((totalPrice * 0.08).toFixed(2));
  const grandTotal = (totalPrice + shippingPrice + taxPrice).toFixed(2);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.id, name: i.name, qty: i.qty, price: i.price, image: i.image,
      }));

      // Create a Stripe checkout session; on success Stripe redirects back
      const { data } = await api.post('/orders/create-checkout-session', { orderItems });

      // Store pending order info so it can be finalized after redirect (simplified flow)
      sessionStorage.setItem(
        'pendingOrder',
        JSON.stringify({ orderItems, shippingAddress: address, itemsPrice: totalPrice, taxPrice, shippingPrice, totalPrice: grandTotal })
      );

      window.location.href = data.url; // redirect to Stripe Checkout
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <form onSubmit={handleCheckout} className="space-y-4">
        <h1 className="text-xl font-bold mb-2">Shipping Address</h1>
        {['address', 'city', 'state', 'postalCode', 'country', 'phone'].map((field) => (
          <input
            key={field}
            required={field !== 'phone'}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={address[field]}
            onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
            className="w-full border rounded-md px-4 py-2"
          />
        ))}
        <button
          disabled={processing}
          className="w-full bg-accent text-white py-3 rounded-md font-medium disabled:opacity-50"
        >
          {processing ? 'Redirecting to payment...' : 'Pay Now'}
        </button>
      </form>

      <div className="border rounded-lg p-6 h-fit">
        <h2 className="font-bold mb-4">Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span>{item.name} x {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <hr className="my-3" />
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice}`}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span>Tax</span><span>${taxPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span><span>${grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
