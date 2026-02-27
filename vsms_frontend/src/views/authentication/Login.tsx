'use client';

import { useState } from 'react';

// next
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import { APP_DEFAULT_PATH } from 'config';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E9F0FF',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        padding: '32px'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .login-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          width: 100%;
          max-width: 1200px;
          height: 660px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
        }

        .login-left {
          flex: 1;
          padding: 56px 64px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .login-right {
          width: 500px;
          flex-shrink: 0;
          position: relative;
          overflow: visible;
          background-image: url('/assets/images/login/login01.JPG');
          background-size: cover;
          background-position: center;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #4680FF;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .login-heading {
          margin-top: 48px;
          font-size: 42px;
          font-weight: 800;
          line-height: 1.2;
          color: #1D2630;
          letter-spacing: -0.5px;
        }

        .login-heading span { color: #4680FF; }

        .login-form {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
        }

        .login-field { margin-bottom: 18px; }

        .login-field label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: #1D2630;
          margin-bottom: 7px;
          letter-spacing: 0.01em;
        }

        .login-input-wrap { position: relative; }

        .login-input-wrap input {
          width: 100%;
          height: 48px;
          background: #f0f2f3;
          border: 1.5px solid transparent;
          border-radius: 10px;
          padding: 0 16px;
          font-size: 14px;
          font-family: inherit;
          color: #1D2630;
          outline: none;
          transition: border-color 0.2s;
        }

        .login-input-wrap input.has-error {
          border-color: #d32f2f;
          background: #fff5f5;
        }

        .login-input-wrap input::placeholder { color: #8996A4; }

        .login-input-wrap input:focus {
          border-color: #4680FF;
          background: #fff;
        }

        .login-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #8996A4;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .login-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #5B6B79;
          cursor: pointer;
          user-select: none;
        }

        .login-custom-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #4680FF;
          background: #4680FF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .login-custom-checkbox.unchecked { background: transparent; }

        .login-forgot {
          font-size: 13px;
          color: #4680FF;
          text-decoration: none;
          font-weight: 500;
        }

        .login-forgot:hover { text-decoration: underline; }

        .login-btn {
          width: 160px;
          height: 52px;
          background: linear-gradient(135deg, #4680FF 0%, #2F63FF 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }

        .login-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-error-text {
          font-size: 12px;
          color: #d32f2f;
          margin-top: 4px;
        }

        .login-submit-error {
          font-size: 13px;
          color: #d32f2f;
          margin-bottom: 16px;
          padding: 10px 14px;
          background: #fff5f5;
          border-radius: 8px;
          border: 1px solid #ffcdd2;
        }

        @media (max-width: 720px) {
          .login-right { display: none; }
          .login-card { max-width: 480px; }
          .login-left { padding: 36px 28px; }
          .login-heading { font-size: 28px; }
        }
      `}</style>

      <div className="login-card">
        {/* Left Panel */}
        <div className="login-left">
          {/* Logo */}
          <div className="login-logo">
            MOTO ERP
          </div>

          {/* Heading + Form */}
          <div>
            <h1 className="login-heading">
              Enter Your <span>Email &amp;</span>
              <br />
              <span>Password</span>
            </h1>

            <Formik
              initialValues={{ email: '', password: '', submit: null }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                password: Yup.string()
                  .required('Password is required')
                  .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (v) => v === v?.trim())
              })}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                  const result = await signIn('login', {
                    redirect: false,
                    email: values.email.trim(),
                    password: values.password
                  });
                  if (result?.error) {
                    setStatus({ success: false });
                    setErrors({ submit: result.error } as any);
                  } else {
                    setStatus({ success: true });
                    router.push(APP_DEFAULT_PATH);
                  }
                } catch (err: any) {
                  setStatus({ success: false });
                  setErrors({ submit: err.message } as any);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, status }) => (
                <form className="login-form" noValidate onSubmit={handleSubmit}>
                  {(errors as any).submit && (
                    <div className="login-submit-error">{(errors as any).submit}</div>
                  )}

                  <div className="login-field">
                    <label htmlFor="email">Email Address</label>
                    <div className="login-input-wrap">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="email"
                        className={touched.email && errors.email ? 'has-error' : ''}
                      />
                    </div>
                    {touched.email && errors.email && (
                      <div className="login-error-text">{errors.email}</div>
                    )}
                  </div>

                  <div className="login-field">
                    <label htmlFor="password">Password</label>
                    <div className="login-input-wrap">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••••••••••"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="current-password"
                        style={{ paddingRight: '44px' }}
                        className={touched.password && errors.password ? 'has-error' : ''}
                      />
                      <button
                        type="button"
                        className="login-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <div className="login-error-text">{errors.password}</div>
                    )}
                  </div>

                  <div className="login-row">
                    <label className="login-checkbox-label" onClick={() => setKeepLoggedIn(!keepLoggedIn)}>
                      <div className={`login-custom-checkbox${keepLoggedIn ? '' : ' unchecked'}`}>
                        {keepLoggedIn && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      Keep me logged in
                    </label>
                    <a href="/forgot-password" className="login-forgot">Forgot Password?</a>
                  </div>

                  <button type="submit" className="login-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in…' : 'Login'}
                  </button>
                </form>
              )}
            </Formik>
          </div>

          <div />
        </div>

        {/* Right Panel - showroom bg via CSS, vehicle PNG overlaid */}
        <div className="login-right">
          {/* Vehicle PNG: 2× size, bottom edge at 25% from panel bottom, 1/8 bleeds left */}
          <div style={{
            position: 'absolute',
            bottom: '-8%',
            left: '-90px',
            width: '600px',
            zIndex: 2,
            pointerEvents: 'none'
          }}>
            <img
              src="/assets/images/login/login02.png"
              alt="Vehicle showcase"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.55))'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
