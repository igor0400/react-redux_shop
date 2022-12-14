import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import {
   useGetUserCartQuery,
   useDeleteUserCartMutation,
   useDeleteOneUserCartMutation,
} from '../../slices/firebaseSlice';
import {
   removeFromDontAuthCart,
   clearDontAuthCart,
} from '../../slices/userSlice';
import { changePayedCart } from '../../slices/payOrderSlice';

import {
   Container,
   Box,
   Paper,
   Typography,
   Stack,
   Divider,
   Button,
} from '@mui/material';
import RequirePage from '../../hoc/RequirePage';

import CartProduct from './CartProduct';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { returnArrfromObj } from '../../utils/supportFunctions';
import { toast } from 'react-toastify';

const Cart = () => {
   const [subTotal, setSubTotal] = useState(0);
   const [cartProducts, setCartProducts] = useState([]);
   const [cartProductsLoaded, setCartProductsLoaded] = useState(false);
   const { user, userAuth, dontAuthCart } = useSelector((state) => state.user);

   const userId = user ? user.localId : null;

   const {
      data: userCart = {},
      isLoading: isCartLoading,
      isError: isCartError,
   } = useGetUserCartQuery(userId);

   const dispatch = useDispatch();
   const location = useLocation();
   const navigate = useNavigate();

   const [
      deleteOneUserCart,
      {
         isError: isDeleteOneCartError,
         isLoading: isDeleteOneCartLoading,
         isSuccess: isDeleteOneCartSuccess,
      },
   ] = useDeleteOneUserCartMutation();
   const [
      deleteUserCart,
      {
         isError: isDeleteCartError,
         isLoading: isDeleteCartLoading,
         isSuccess: isDeleteCartSuccess,
      },
   ] = useDeleteUserCartMutation();

   useEffect(() => {
      if (isDeleteOneCartSuccess) {
         if (cartProducts.length === 1) setCartProducts([]);
         setCartProductsLoaded(false);
      }
      if (isDeleteOneCartError) toast.error('Delete error, try again later');

      if (isDeleteCartSuccess) setCartProducts([]);
      if (isDeleteCartError) toast.error('Delete error, try again later');
   }, [
      isDeleteOneCartSuccess,
      isDeleteOneCartError,
      isDeleteCartSuccess,
      isDeleteCartError,
   ]);

   useEffect(() => {
      if (userAuth) {
         if (userCart && !isCartLoading && !isCartError) {
            setCartProducts(returnArrfromObj(userCart));
         }
      } else {
         if (!cartProductsLoaded) {
            setCartProducts(returnArrfromObj(dontAuthCart));
            setCartProductsLoaded(true);
         }
      }
   }, [userCart, dontAuthCart]);

   useEffect(() => {
      let sum = 0;
      cartProducts.forEach((item) => (sum += item.price));
      if (sum !== 0) {
         setSubTotal(sum.toFixed(2));
      }
   }, [cartProducts]);

   const deleteCartItem = useCallback((value) => {
      deleteOneUserCart(value);
   }, []);
   const deleteCart = useCallback((value) => {
      deleteUserCart(value);
   }, []);

   const handleRemoveFromCart = (id) => {
      if (userAuth) {
         deleteCartItem({ userId, itemId: id });
      } else {
         dispatch(removeFromDontAuthCart(id));
         if (cartProducts.length === 1) setCartProducts([]);
         setCartProductsLoaded(false);
      }
   };

   const handleClearCart = () => {
      if (userAuth) {
         deleteCart({ userId, data: {} });
      } else {
         dispatch(clearDontAuthCart());
         setCartProducts([]);
      }
   };

   const checkoutCart = () => {
      if (userAuth) {
         dispatch(changePayedCart({ cart: userCart, subTotal: +subTotal }));
         navigate('/payorder', { state: { from: location } });
      } else {
         navigate('/login', { state: { from: location } });
      }
   };

   return (
      <RequirePage loading={isCartLoading} error={isCartError}>
         {cartProducts.length > 0 ? (
            <Container maxWidth="lg">
               <Stack direction="row" spacing={2}>
                  <Box sx={{ width: '70%' }}>
                     <PaperWrapper>
                        <Stack
                           direction="row"
                           sx={{ justifyContent: 'space-between' }}
                        >
                           <Typography variant="h5" sx={{ fontWeight: '700' }}>
                              Cart
                           </Typography>
                           <Button
                              variant="outlined"
                              onClick={handleClearCart}
                              disabled={isDeleteCartLoading}
                           >
                              Clear cart
                           </Button>
                        </Stack>
                     </PaperWrapper>
                     <PaperWrapper sx={{ margin: '20px 0' }}>
                        <Stack spacing={3}>
                           {cartProducts.map((item, i) => (
                              <React.Fragment key={i}>
                                 <CartProduct
                                    {...item}
                                    removeItem={handleRemoveFromCart}
                                    isDeleteOneCartLoading={
                                       isDeleteOneCartLoading
                                    }
                                 />
                                 {i + 1 === cartProducts.length ? null : (
                                    <Divider />
                                 )}
                              </React.Fragment>
                           ))}
                        </Stack>
                     </PaperWrapper>
                     <PaperWrapper>
                        <Stack
                           direction="row"
                           sx={{ justifyContent: 'space-between' }}
                        >
                           <Typography variant="h6" sx={{ fontWeight: '500' }}>
                              Items: {cartProducts.length}
                           </Typography>
                           <Typography variant="h6" sx={{ fontWeight: '500' }}>
                              Sub-total: ${subTotal}
                           </Typography>
                        </Stack>
                     </PaperWrapper>
                  </Box>
                  <Box sx={{ width: '30%' }}>
                     <PaperWrapper>
                        <Typography
                           variant="h5"
                           sx={{ fontWeight: '700', paddingBottom: '20px' }}
                        >
                           Total
                        </Typography>
                        <Divider />
                        <Typography
                           variant="h6"
                           sx={{
                              fontWeight: '700',
                              paddingTop: '20px',
                              display: 'flex',
                              justifyContent: 'space-between',
                           }}
                        >
                           Sub-total: <span>${subTotal}</span>
                        </Typography>
                        <Typography
                           variant="h6"
                           sx={{
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                           }}
                        >
                           Delivery{' '}
                           <InfoIcon
                              fontSize="small"
                              color="disabled"
                              sx={{ cursor: 'pointer' }}
                           />
                        </Typography>
                        <Button
                           variant="contained"
                           color="success"
                           size="large"
                           sx={{ width: '100%', marginTop: '30px' }}
                           onClick={checkoutCart}
                        >
                           Checkout
                        </Button>
                     </PaperWrapper>
                  </Box>
               </Stack>
            </Container>
         ) : (
            <Container maxWidth="sm">
               <Stack
                  sx={{
                     justifyContent: 'center',
                     alignItems: 'center',
                     height: '80vh',
                  }}
               >
                  <ShoppingCartIcon
                     sx={{ fontSize: 40, paddingBottom: '20px' }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 500 }}>
                     Cart is clear
                  </Typography>
               </Stack>
            </Container>
         )}
      </RequirePage>
   );
};

const PaperWrapper = ({ children, sx }) => {
   return (
      <Paper elevation={2} sx={sx}>
         <Box
            sx={{
               p: 3,
               maxWidth: { xs: 400, lg: 800 },
               '& > *': {
                  flexGrow: 1,
                  flexBasis: '50%',
               },
            }}
         >
            {children}
         </Box>
      </Paper>
   );
};

export default Cart;
