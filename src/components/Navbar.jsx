import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, ShoppingCart, UserRound, Search, LogOut, LayoutDashboard, Menu } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQty } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="shop-header">
      <nav className="shop-nav">
        <Link to="/" className="shop-brand" aria-label="ShopSphere home">
          <span className="brand-icon"><ShoppingBag size={27} strokeWidth={1.9} /></span>
          <span>Shop<span>Sphere</span></span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">New Arrivals</Link>
          <Link to="/products?category=Men">Men <span className="nav-chevron">⌄</span></Link>
          <Link to="/products?category=Women">Women <span className="nav-chevron">⌄</span></Link>
          <Link to="/products?category=Accessories">Accessories</Link>
          <Link to="/products?category=Sale" className="sale-link">Sale</Link>
          <Link to="/products">Blog</Link>
        </div>

        <div className="nav-actions">
          <button aria-label="Search products" onClick={() => navigate('/products')}><Search size={23} /></button>
          <Link to="/cart" className="nav-cart" aria-label="Shopping cart">
            <ShoppingCart size={23} />
            {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
          </Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && <Link to="/admin/dashboard" aria-label="Admin dashboard"><LayoutDashboard size={22} /></Link>}
              <span className="nav-user-name">Hi, {user?.name?.split(' ')[0]}</span>
              <button aria-label="Logout" onClick={handleLogout}><LogOut size={21} /></button>
            </>
          ) : <Link to="/login" aria-label="Account"><UserRound size={23} /></Link>}
          <button className="mobile-menu" aria-label="Open menu" onClick={() => navigate('/products')}><Menu size={24} /></button>
        </div>
      </nav>
    </header>
  );
}
