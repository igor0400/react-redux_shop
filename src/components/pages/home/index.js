import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import ProductsItem from './ProductsItem';
import Grid from '@mui/material/Grid';

import FiltersBar from './FiltersBar';
import FiltersAccordion from './FiltersAccordion';

import data from '../../../data.json';

const Home = () => {
   return (
      <Container maxWidth="xl">
         <FiltersBar />
         <div className="main" style={{ padding: '40px 0', display: 'flex' }}>
            <div className="filters">
               <FiltersAccordion />
            </div>
            <Paper
               elevation={2}
               className="products"
               style={{ padding: '20px 10px', marginLeft: '50px' }}
            >
               <div className="products__filters"></div>
               <Grid container spacing={2} sx={{padding: '0 10px'}}>
                  {data.products.map((item) => (
                     <Grid item xs={3} key={item.id}>
                        <ProductsItem {...item} />
                     </Grid>
                  ))}
               </Grid>
            </Paper>
         </div>
      </Container>
   );
};

export default Home;
