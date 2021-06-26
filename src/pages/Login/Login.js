import React, { useState } from 'react';
import Container from '../../components/common/Container';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { Link, Redirect } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { loginUser } from '../../services/authService';
import { loginSchema, validate } from '../../utility/validation';

const Login = () => {
  const { setAuthInfo, isAuthenticated } = useAuthContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const onInputChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (apiError) setApiError('');
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    try {
      const isValid = await validate({ schema: loginSchema, formData, setErrors });
      if (!isValid) {
        return;
      }

      setIsLoading(true);
      const { data, error } = await loginUser(formData);

      if (error) {
        const errorMessage =
          error?.response?.data?.message || 'Something went wrong!';

        throw new Error(errorMessage);
      }

      const userInfo = {
        id: data.data.id,
        email: data.data.email,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
      };

      setLoginSuccess(true);
      setTimeout(() => {
        setAuthInfo({ token: data.data.token, userInfo });
      }, 800);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated()) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="bg-light-grey">
      <Container>
        <div className="font-work grid place-items-center w-full h-screen mt-56 xl:mt-0">
          <div className="bg-light-default h-full w-full py-32 px-16 xl:p-32 xl:w-400 xl:h-auto xl:shadow-card xl:rounded-4">
            <h2 className="font-epilogue text-24 font-bold">
              Connect<span className="text-primary-default">Em</span>
            </h2>
            <p className="mb-16">Login</p>
            <form onSubmit={onFormSubmit}>
              <div className="mb-16">
                <Input
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={onInputChange}
                  error={errors['email']}
                />
              </div>
              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={onInputChange}
                  error={errors['password']}
                />
              </div>
              <div className="mt-16">
                {isLoading && (
                  <Alert displayType="info">Logging in, please wait...</Alert>
                )}
                {apiError && <Alert displayType="danger">{apiError}</Alert>}
                {loginSuccess && <Alert displayType="success">Login success!</Alert>}
              </div>
              <div className="mt-16">
                <Button displayType="primary" type="submit">
                  Login
                </Button>
              </div>
              <p className="text-center mt-16">OR,</p>
              <div className="mt-16">
                <Link to="/register">
                  <Button displayType="secondary" type="submit" className="w-full">
                    Create an account
                  </Button>
                </Link>
              </div>
              <p className="mt-16 text-12 text-center">Your info is safe with us.</p>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
