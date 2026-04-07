import React from 'react';
import RecipeSuggestions from '../components/RecipeSuggestions';
import Header from '../components/Header';

const RecipeSuggestionsPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-screen-2xl mx-auto px-6 pt-16">
        <RecipeSuggestions />
      </div>
    </>
  );
};

export default RecipeSuggestionsPage;