import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import BrowseRecipes from '@/components/pages/BrowseRecipes';
import RecipeDetail from '@/components/pages/RecipeDetail';
import MyRecipes from '@/components/pages/MyRecipes';
import GroceryList from '@/components/pages/GroceryList';
import CreateRecipe from '@/components/pages/CreateRecipe';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<BrowseRecipes />} />
          <Route path="/browse" element={<BrowseRecipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/grocery-list" element={<GroceryList />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="z-[9999]"
      />
    </Router>
  );
}

export default App;