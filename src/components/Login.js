import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./Login.css"


const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      navigate('/');
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/invalid-email':
          setError('正しいメールアドレスの形式で入力してください。');
          break;
        case 'auth/user-not-found':
          setError('メールアドレスかパスワードに誤りがあります。');
          break;
        case 'auth/wrong-password':
          setError('メールアドレスかパスワードに誤りがあります。');
          break;
        default:
          setError('メールアドレスかパスワードに誤りがあります。');
          break;
      }
    });
  }; 

  return (
    <div>
      <div className="login-form">
        <div className="login-header">
          ログイン
        </div>
        <div className="login-form-contents">

          <form onSubmit={handleSubmit}>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div className="input-email-area">
              <div className="input-email-label">
                <label htmlFor="email">メールアドレス</label>
              </div>
              <div className="input-email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email"
                />
              </div>
            </div>
            <div className="input-password-area">
              <div className="input-password-label">
                <label htmlFor="password">パスワード</label>
              </div>
              <div className="input-password">
                <input 
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                />
              </div>
            </div>
            <div className="login-button">
              <button>ログイン</button>
            </div>
            <div className="link-to-signup-area">
              ユーザー登録は<Link to={'/signup'} className="link-to-signup">  こちら  </Link>から
            </div>
          </form>
        </div>

      </div>
    </div>
  )
};

export default Login;