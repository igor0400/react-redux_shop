import { useMemo } from 'react';

import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import ProductsItem from './ProductsItem';

import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../../../slices/apiSlice';

import { getProductsWithActiveFilters } from '../../../utils/fliters';
import { returnArrfromObj } from '../../../utils/supportFunctions';

import small404 from '../../../images/small404.gif';

const Products = () => {
   const {
      data: productsData = {},
      isFetching,
      isLoading,
      isError,
   } = useGetProductsQuery();

   const products = returnArrfromObj(productsData);

   const { activeFilterBar, activeFilters, filterPrice, sortedBy } =
      useSelector((state) => state.filters);
   const { productsItemMode } = useSelector((state) => state.filters);

   const filteredProducts = useMemo(() => {
      let finishedProducts = products.slice();

      if (activeFilterBar !== 'all') {
         finishedProducts = finishedProducts.filter(
            (item) => item.category === activeFilterBar
         );
      }

      if (activeFilters.length > 0) {
         finishedProducts = getProductsWithActiveFilters(
            finishedProducts,
            activeFilters
         );
      }

      if (filterPrice.from > 0 || filterPrice.to > 0) {
         finishedProducts = finishedProducts.filter(
            (item) =>
               item.price >= filterPrice.from && item.price <= filterPrice.to
         );
      }

      if (sortedBy) {
         switch (sortedBy) {
            case 'To lowest price':
               finishedProducts = finishedProducts
                  .sort((a, b) => a.price - b.price)
                  .reverse();
               break;
            case 'To highest price':
               finishedProducts = finishedProducts.sort(
                  (a, b) => a.price - b.price
               );
               break;
            case 'To lowest rating':
               finishedProducts = finishedProducts
                  .sort((a, b) => a.rating - b.rating)
                  .reverse();
               break;
            case 'To highest rating':
               finishedProducts = finishedProducts.sort(
                  (a, b) => a.rating - b.rating
               );
               break;
         }
      }

      return finishedProducts;
   }, [productsData, activeFilterBar, activeFilters, filterPrice, sortedBy]);

   const renderProducts = () => {
      if (isLoading || isFetching) {
         return (
            <CenteredWrapper>
               <CircularProgress />
            </CenteredWrapper>
         );
      } else if (isError) {
         return (
            <CenteredWrapper>
               <img
                  src={small404}
                  alt="error"
                  style={{ width: '150px', height: '150px' }}
               />
               <Typography variant="h5">Loading error</Typography>
            </CenteredWrapper>
         );
      } else {
         if (filteredProducts.length === 0) {
            return (
               <CenteredWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                     Not active products
                  </Typography>
               </CenteredWrapper>
            );
         } else {
            return (
               <Grid
                  container
                  spacing={2}
                  columns={
                     productsItemMode === 'small'
                        ? { xs: 2, sm: 8, md: 12 }
                        : { xs: 2, sm: 8, md: 9 }
                  }
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

   return <>{renderProducts()}</>;
};

const CenteredWrapper = ({ children }) => {
   return (
      <Box
         sx={{
            display: 'flex',
            margin: 'auto 0',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '55vh',
         }}
      >
         {children}
      </Box>
   );
};

export default Products;
