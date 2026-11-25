import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => { dispatch(fetchProducts({ limit: 8 })); }, [dispatch]);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#171827] text-white">
        <div className="absolute -right-24 -top-32 h-[520px] w-[520px] rounded-full bg-purple-600/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[.22em] text-purple-300"><Sparkles size={16}/> The new season is here</p>
            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">Find your style.<br/><span className="text-purple-400">Own your sphere.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">Discover everyday essentials, standout pieces, and accessories picked to move with you.</p>
            <Link to="/products" className="mt-9 inline-flex items-center gap-3 rounded-xl bg-purple-600 px-7 py-4 font-semibold text-white transition hover:bg-purple-500">Explore collection <ArrowRight size={19}/></Link>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-5 rounded-[38%] bg-gradient-to-br from-purple-500 to-fuchsia-300 blur-2xl opacity-40"/>
            <img className="relative h-[390px] w-full rounded-3xl object-cover shadow-2xl md:h-[450px]" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85" alt="ShopSphere new season fashion collection"/>
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-5 py-3 text-slate-900 shadow-lg"><p className="text-xs text-slate-500">Curated for you</p><p className="font-bold">New season essentials</p></div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-purple-600">Handpicked for you</p><h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Featured products</h2></div>
          <Link to="/products" className="hidden items-center gap-2 text-sm font-semibold text-purple-700 sm:flex">View all <ArrowRight size={17}/></Link>
        </div>
        {loading ? <div className="py-16 text-center text-slate-500">Loading products...</div> : products.length ? <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">{products.map((p) => <ProductCard key={p._id} product={p}/>)}</div> : <p className="py-12 text-center text-slate-500">No products available yet.</p>}
      </section>
    </div>
  );
}
