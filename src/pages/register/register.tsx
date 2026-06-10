import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { registerUser } from '@slices/userSlice';
import { selectUserError } from '@selectors/userSelectors';

import { useDispatch, useSelector } from '../../services/store';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorText = useSelector(selectUserError);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(registerUser({ name: userName, email, password })).then(
      (result) => {
        if (registerUser.fulfilled.match(result)) {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      }
    );
  };

  return (
    <RegisterUI
      errorText={errorText || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
