import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';

export default function OrderSuccess() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('finalizing');

  useEffect(() => {
    const finalizeOrder = async () => {
      const pending = sessionStorage.getItem('pendingOrder');
      if (!pending) return setStatus('done');
      try {
        const orderData = JSON.parse(pending);
        await api.post('/orders', {
          ...orderData,
          paymentInfo: { id: 'stripe_session', status: 'succeeded' },
        });
        sessionStorage.removeItem('pendingOrder');
        dispatch(clearCart());
        setStatus('done');
      } catch {
        setStatus('done');
      }
    };
    finalizeOrder();
  }, [dispatch]);

  return (
    <div className="text-center py-24 max-w-md mx-auto px-4">
      <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
      <h1 className="text-2xl font-bold mb-2">
        {status === 'finalizing' ? 'Finalizing your order...' : 'Order Placed Successfully!'}
      </h1>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase. You'll receive a confirmation email shortly.
      </p>
      <Link to="/products" className="bg-primary text-white px-6 py-2 rounded-md">
        Continue Shopping
      </Link>
    </div>
  );
}
