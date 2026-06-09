import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '@slices/userSlice';
import { ProfileMenuUI } from '@ui';

import { useDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login', { replace: true });
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
