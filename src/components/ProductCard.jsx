import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, ShoppingCart } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ id: product._id, name: product.name, price: product.discountPrice || product.price, image: product.images?.[0]?.url || '', qty: 1, stock: product.stock }));
    toast.success(`${product.name} added to cart`);
  };
  return (
    <Link to={`/products/${product._id}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-64">
        <img src={product.images?.[0]?.url || 'https://placehold.co/600x700?text=ShopSphere'} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
        {product.discountPrice && <span className="absolute left-3 top-3 rounded-full bg-purple-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Sale</span>}
      </div>
      <div className="p-3 sm:p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-purple-600">{product.category || 'Collection'}</p>
        <h3 className="truncate text-sm font-semibold text-slate-800 sm:text-base">{product.name}</h3>
        <div className="my-2 flex items-center gap-1 text-xs text-amber-500"><Star size={13} fill="currentColor"/><span className="font-semibold">{product.ratings?.toFixed(1) || 'New'}</span><span className="text-slate-400">({product.numReviews || 0})</span></div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2"><span className="font-bold text-slate-900">₹{(product.discountPrice || product.price || 0).toLocaleString('en-IN')}</span>{product.discountPrice && <span className="text-xs text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>}</div>
          <button onClick={handleAddToCart} disabled={product.stock === 0} aria-label="Add to cart" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-white transition hover:bg-purple-600 disabled:opacity-40"><ShoppingCart size={16}/></button>
        </div>
      </div>
    </Link>
  );
}
