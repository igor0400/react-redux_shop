import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuth = ({ children }) => {
   const { userAuth } = useSelector((state) => state.user);
   const location = useLocation();

   if (!userAuth) {
      return <Navigate to="/login" state={{ from: location }} />;
   }

   return children;
};

export default RequireAuth;
