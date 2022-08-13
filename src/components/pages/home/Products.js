import { useEffect } from 'react';
import axios from 'axios';
import { createSelector } from 'reselect';

import ProductsItem from './ProductsItem';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import { useDispatch, useSelector } from 'react-redux';
import {
   productsFetching,
   productsFetched,
   productsFetchingError,
} from '../../../actions';

const Products = () => {
   const filteredProductsSelector = createSelector(
      (state) => state.filters.activeFilterBar,
      (state) => state.products.products,
      (filter, products) => {
         if (filter === 'all') {
            return products;
         } else {
            return products.filter((item) => item.filtersType === filter);
         }
      }
   );

   const filteredProducts = useSelector(filteredProductsSelector);
   const { productsLoadingStatus } = useSelector((state) => state.products);
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(productsFetching());
      axios
         .get('http://localhost:3100/products')
         .then((res) => dispatch(productsFetched(res.data)))
         .catch(() => dispatch(productsFetchingError()));
   }, []);

   const renderProducts = (status) => {
      if (status === 'loading') {
         return (
            <CircularProgress
               sx={{
                  display: 'flex',
                  width: '100%',
                  margin: '50px auto',
               }}
            />
         );
      } else if (status === 'error') {
         return <h3>loading error</h3>;
      } else {
         if (filteredProducts.length === 0) {
            return <h3>Not active products</h3>;
         } else {
            return (
               <Grid
                  container
                  spacing={2}
                  columns={{ xs: 2, sm: 8, md: 12 }}
                  sx={{ padding: '0 10px' }}
               >
                  {filteredProducts.map((item) => (
                     <Grid item xs={3} key={item.id}>
                        <ProductsItem {...item} />
                     </Grid>
                  ))}
               </Grid>
            );
         }
      }
   };

   return <>{renderProducts(productsLoadingStatus)}</>;
};

export default Products;