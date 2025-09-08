import React from 'react';
import Header from '../components/Header';
import MealPlansView from '../components/MealPlansView';

const MealPlansPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-screen-2xl mx-auto px-6 pt-16">
        <MealPlansView />
      </div>
    </>
  );
};

export default MealPlansPage;