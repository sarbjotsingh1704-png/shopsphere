import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading || !product) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images?.[0]?.url || '',
        qty,
        stock: product.stock,
      })
    );
    toast.success('Added to cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.info('Please login to leave a review');
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted');
      dispatch(fetchProductById(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images?.[activeImage]?.url || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded border-2 overflow-hidden ${
                  activeImage === idx ? 'border-accent' : 'border-transparent'
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-1 text-yellow-500 mb-4">
            <Star size={16} fill="currentColor" />
            <span>{product.ratings?.toFixed(1)}</span>
            <span className="text-gray-400">({product.numReviews} reviews)</span>
          </div>

          <div className="mb-4">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-accent">${product.discountPrice}</span>
                <span className="text-gray-400 line-through ml-3">${product.price}</span>
              </>
            ) : (
              <span className="text-3xl font-bold">${product.price}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <p className={`mb-4 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(Math.min(product.stock, Math.max(1, Number(e.target.value))))}
                className="w-20 border rounded-md px-3 py-2"
              />
              <button
                onClick={handleAddToCart}
                className="bg-primary text-white px-8 py-2 rounded-md hover:bg-accent transition"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews?.length === 0 && <p className="text-gray-500 mb-4">No reviews yet.</p>}
        <div className="space-y-4 mb-8">
          {product.reviews?.map((r, idx) => (
            <div key={idx} className="border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">{r.name}</span>
                <span className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-gray-600 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submitReview} className="space-y-3">
          <select
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
            className="border rounded-md px-3 py-2"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} Stars</option>
            ))}
          </select>
          <textarea
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            placeholder="Write your review..."
            className="w-full border rounded-md px-3 py-2"
            rows={3}
          />
          <button className="bg-primary text-white px-6 py-2 rounded-md">Submit Review</button>
        </form>
      </div>
    </div>
  );
}
