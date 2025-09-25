import React from 'react';
import Header from '../components/Header';
import MealPlansView from '../components/MealPlansView';
import MealPlans from '../components/MealPlans';

const MealPlansPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-screen-2xl mx-auto px-6 pt-16">
        <MealPlans />
      </div>
    </>
  );
};

export default MealPlansPage;