import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, LockKeyhole, Eye, EyeOff, Truck, ShieldCheck, Package, ArrowRight } from 'lucide-react';
import { login } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
// import loginModel from '../assets/shopsphere-login-model.webp';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success('Logged in successfully');
      navigate(searchParams.get('redirect') || '/');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  const socialNotice = (provider) => toast.info(`${provider} sign-in is not configured yet.`);

  return (
    <section className="login-page">
      <div className="login-showcase">
        <div className="showcase-copy">
          <p className="eyebrow">YOUR STYLE. YOUR SPHERE.</p>
          <h1>Welcome Back to<br /><span>ShopSphere</span></h1>
          <p className="showcase-description">Login to continue your shopping, track orders, and explore new collections.</p>
          <div className="shopping-perks">
            <div className="perk"><span><Truck /></span><div><strong>Fast Delivery</strong><small>Across India</small></div></div>
            <div className="perk"><span><ShieldCheck /></span><div><strong>Secure Payments</strong><small>100% Safe &amp; Trusted</small></div></div>
            <div className="perk"><span><Package /></span><div><strong>Easy Returns</strong><small>Hassle-free process</small></div></div>
          </div>
        </div>
        <div className="model-glow" />
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <div className="login-heading">
            <h2>Login to <span>ShopSphere</span></h2>
            <p>Access your account and continue shopping</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-input"><Mail size={21} /><input type="email" placeholder="Email address" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="login-input"><LockKeyhole size={21} /><input type={showPassword ? 'text' : 'password'} placeholder="Password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></label>
            <div className="forgot-row"><Link to="/forgot-password" onClick={(e) => { e.preventDefault(); toast.info('Password recovery can be connected to your backend.'); }}>Forgot Password?</Link></div>
            <button disabled={loading} className="login-submit">{loading ? 'Logging in...' : <>Login <ArrowRight size={21} /></>}</button>
          </form>
          <div className="social-divider"><span />Or continue with<span /></div>
          <div className="social-buttons">
            <button type="button" onClick={() => socialNotice('Google')}><b className="google-mark">G</b>Continue with Google</button>
            <button type="button" onClick={() => socialNotice('GitHub')}><b className="github-mark">●</b>Continue with GitHub</button>
          </div>
          <p className="register-prompt">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </section>
  );
}
