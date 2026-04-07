import React from 'react';
import Header from '../components/Header';
import SavedRecipes from '../components/Recipes/SavedRecipes';

const RecipesPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-screen-2xl mx-auto px-6 pt-16">
        <SavedRecipes />
      </div>
    </>
  );
};

export default RecipesPage;