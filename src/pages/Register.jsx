
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  UserRound, Mail, LockKeyhole, Eye, EyeOff, ArrowRight, Truck, ShieldCheck, Gift } from "lucide-react";
import { register } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
// import loginModel from "../assets/shopsphere-login-model.webp";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    const result = await dispatch(register(form));

    if (register.fulfilled.match(result)) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <section className="register-page">

      {/* Left Section */}
      <div className="register-showcase">

        <div className="register-showcase-copy">
          <h1>
            Find Your Style.
            <br />
            <span>Join ShopSphere.</span>
          </h1>

          <p className="register-showcase-description">
            Create an account to discover fresh collections,
            save your favourites, and enjoy a smoother
            shopping experience.
          </p>

          <div className="register-perks">

            <div className="register-perk">
              <span><Gift /></span>
              <div>
                <strong>Personalised Picks</strong>
                <small>Styles selected for you</small>
              </div>
            </div>

            <div className="register-perk">
              <span><Truck /></span>
              <div>
                <strong>Order Tracking</strong>
                <small>Stay updated every step</small>
              </div>
            </div>

            <div className="register-perk">
              <span><ShieldCheck /></span>
              <div>
                <strong>Safe & Secure</strong>
                <small>Your details stay protected</small>
              </div>
            </div>

          </div>
        </div>

        <div className="register-model-glow"></div>
      </div>

      {/* Right Section */}
      <div className="register-form-side">

        <div className="register-card">

          <div className="register-heading">
            <h2>
              Create your <span>ShopSphere</span> account
            </h2>

            <p>
              Sign up today and make every look count
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="register-form"
          >

            {/* Full Name */}
            <label className="register-input">
              <UserRound size={20} />

              <input
                type="text"
                placeholder="Full name"
                autoComplete="name"
                required
                minLength={2}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </label>

            {/* Email */}
            <label className="register-input">
              <Mail size={20} />

              <input
                type="email"
                placeholder="Email address"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </label>

            {/* Password */}
            <label className="register-input">
              <LockKeyhole size={20} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (minimum 6 characters)"
                autoComplete="new-password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </label>

            {/* Confirm Password */}
            <label className="register-input">
              <LockKeyhole size={20} />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </label>

            {/* Terms */}
            <label className="register-terms">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) =>
                  setAcceptedTerms(e.target.checked)
                }
              />

              <span>
                I agree to the{" "}
                <Link to="/terms">Terms & Conditions</Link>
                {" "}and{" "}
                <Link to="/privacy">Privacy Policy</Link>.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="register-submit"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>

          </form>

          <p className="register-login-prompt">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

          <p className="register-safe-note">
            <ShieldCheck size={15} />
            Your information is protected and secure
          </p>

        </div>
      </div>

    </section>
  );
}
