import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const dispatch = useDispatch();
  const { products, totalProducts, loading } = useSelector((state) => state.product);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const resultsPerPage = 12;

  useEffect(() => {
    dispatch(fetchProducts({ keyword, sort, page, limit: resultsPerPage }));
  }, [dispatch, keyword, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ keyword });
  };

  const totalPages = Math.ceil(totalProducts / resultsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            className="border rounded-md px-4 py-2 flex-1"
          />
          <button className="bg-primary text-white px-4 py-2 rounded-md">Search</button>
        </form>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-ratings">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-9 h-9 rounded-md ${
                    page === num ? 'bg-accent text-white' : 'bg-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
