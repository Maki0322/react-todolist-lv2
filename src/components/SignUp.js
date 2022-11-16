import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./SignUp.css"

const SignUp = () => {
  const navigate = useNavigate('');
  const [error, setError] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case 'auth/invalid-email':
            setError('正しいメールアドレスの形式で入力してください。');
            break;
            case 'auth/weak-password':
              setError('パスワードは6文字以上を設定する必要があります。');
              break;
          case 'auth/email-already-in-use':
            setError('そのメールアドレスは登録済みです。');
            break;
          default:
            setError('メールアドレスかパスワードに誤りがあります。');
            break;
        }
      })
  };

  return (
    <div>
      <div className='signup-form'>
        <div className='user-register-header'>ユーザー登録</div>
        <div className='user-register-contents'>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='register-email-area'>
              <div className='register-email-label'>
                <label htmlFor="email">メールアドレス</label>
              </div>
              <div className='register-email'>
                <input id="email" name="email" type="email" placeholder="email" />
              </div>
            </div>
            <div className='register-password-area'>
              <div className='register-password-label'>
                <label htmlFor="password">パスワード</label>
              </div>
              <div className='register-password'>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="password"
                />
              </div>
            </div>
            <div className="register-button">
              <button>登録</button>
            </div>
            <div className="link-to-login-area">
              ユーザー登録済の場合は<Link to={'/login'} className="link-to-login"> こちら </Link>から
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SignUp;