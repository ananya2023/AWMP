import React from 'react';
import Header from '../components/Header';
import Pantry from '../components/Pantry';

const PantryPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-screen-2xl mx-auto px-6 pt-16 pb-8">
        <Pantry />
      </div>
    </>
  );
};

export default PantryPage;