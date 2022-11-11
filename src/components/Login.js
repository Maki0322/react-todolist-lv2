import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";


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
      <h1>ログイン</h1>

      <form onSubmit={handleSubmit}>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email"
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input 
            id="password"
            name="password"
            type="password"
            placeholder="password"
          />
        </div>
        <div>
          <button>ログイン</button>
        </div>
        <div>
          ユーザー登録は<Link to={'/signup'}>こちら</Link>から
        </div>
      </form>
    </div>
  )
};

export default Login;