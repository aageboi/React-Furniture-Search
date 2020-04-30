import React, { useCallback, useReducer, useMemo } from 'react';

import FurnitureForm from './FurnitureForm';
import FurnitureList from './FurnitureList';

const furnitureReducer = (currentFurnitures, action) => {
  switch (action.type) {
    case 'SET':
      return action.furnitures;
    default:
      throw new Error('Should not get there!');
  }
};

const Furnitures = () => {
  const [userFurnitures, dispatch] = useReducer(furnitureReducer, []);

  const loadingFurnituresHandler = useCallback(loadedFurnitures => {
    dispatch({ type: 'SET', furnitures: loadedFurnitures });
  }, []);

  const filterFurnituresHandler = useCallback(data => {
    dispatch({ type: 'SET', furnitures: data });
  }, []);

  const furnitureList = useMemo(() => {
    return (
      <FurnitureList
        furnitures={userFurnitures}
      />
    );
  }, [userFurnitures]);

	return (
    <div className="App">
      <FurnitureForm 
        onLoadingFurnitures={loadingFurnituresHandler}
        onFilterFurnitures={filterFurnituresHandler}
      />

      <section>
        {furnitureList}
      </section>
    </div>
  );
};

export default Furnitures;
