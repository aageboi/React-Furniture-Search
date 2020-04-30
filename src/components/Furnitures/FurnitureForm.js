import React, { useState, useEffect, useRef, useCallback } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import useHttp from '../../hooks/http';
import { Multiselect } from "multiselect-react-dropdown";
import './FurnitureForm.css';

const FurnitureForm = React.memo(props => {
  const { onLoadingFurnitures, onFilterFurnitures } = props;
  
  const [ enteredFilter, setEnteredFilter ] = useState('');
  const [ loadedStyles, setLoadedStyles ] = useState([]);
  const [ userFilteredStyles, setUserFilteredStyles ] = useState([]);
  const [ userFilteredTimes, setUserFilteredTimes ] = useState([]);

  const inputRef = useRef();
  const styleRef = useRef();
  const timeRef = useRef();
  const { sendRequest, isLoading, error, data } = useHttp();

  const optionsDelivery = [
    { name: "1 Week", value: 7 },
    { name: "2 Weeks", value: 14 },
    { name: "1 Months", value: 30 },
    { name: "All", value: Infinity }
  ];
  const optionsStyle = loadedStyles.map(name => ({ name }));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && enteredFilter === inputRef.current.value) {
        // const arrProducts = [].concat.apply([], data.products);
        let filteredProducts = data.products;

        if (userFilteredStyles.length > 0) {
          filteredProducts = userFilteredStyles;
        }

        if (userFilteredTimes.length > 0) {
          filteredProducts = filteredProducts.filter(item =>
            item.delivery_time <= Math.max(...userFilteredTimes)
          );
        }

        if (inputRef.current.value !== '') {
          filteredProducts = filteredProducts.filter(furniture => {
            return furniture.name
              .toLowerCase()
              .includes(enteredFilter.toLowerCase());
          });
        }

        onFilterFurnitures(filteredProducts);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, data, userFilteredStyles, userFilteredTimes, onFilterFurnitures]);

  const onSelectStyles = useCallback(selectedStyles => {
    if (data) {
      const products = data.products;
      if (selectedStyles.length > 0) {
        const furnitureStyles = selectedStyles.map(
          item => item.name
        );
        const filtered = new Set(furnitureStyles);
        const filteredStyle = products.filter(item =>
          item.furniture_style.some(style => filtered.has(style))
        );
        setUserFilteredStyles(filteredStyle);
      } else {
        setUserFilteredStyles([]);
      }
    }
  }, [data]);

  const onSelectTimes = useCallback(selectedTimes => {
    if (data) {
      if (selectedTimes.length > 0) {
        const deliveryTime = selectedTimes.map(
          item => item.value
        );
        setUserFilteredTimes(deliveryTime);
      } else {
        setUserFilteredTimes([]);
      }
    }
  }, [data]);

  useEffect(() => {
    sendRequest(
      'http://www.mocky.io/v2/5c9105cb330000112b649af8',
      'GET'
    );
  }, [sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedFurnitures = [];
      for (const key in data.products) {
        loadedFurnitures.push({
          id: key,
          name: data.products[key].name,
          delivery_time: data.products[key].delivery_time,
          description: data.products[key].description.substring(0, 114) + "...",
          furniture_style: data.products[key].furniture_style,
          price: data.products[key].price.toLocaleString("id-ID")
        });
      }
      onLoadingFurnitures(loadedFurnitures);
      setLoadedStyles(data.furniture_styles);
    }
  }, [data, isLoading, error, onLoadingFurnitures]);

  return (
    <section className="furniture-form">
      <Card>
        <div className="form-control">
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            placeholder="Search Furniture"
            onChange={event => {
              setEnteredFilter(event.target.value);
            }}
          />
        </div>
        <div className="furniture-form__select">
          <Multiselect
            ref={styleRef}
            options={optionsStyle}
            showCheckbox={true}
            displayValue="name"
            onSelect={onSelectStyles}
            onRemove={onSelectStyles}
            placeholder="Furniture Style"
          />
          <Multiselect
            ref={timeRef}
            options={optionsDelivery}
            showCheckbox={true}
            displayValue="name"
            onSelect={onSelectTimes}
            onRemove={onSelectTimes}
            placeholder="Delivery Time"
          />
        </div>
        {isLoading && <LoadingIndicator />}
      </Card>
    </section>
  );
});

export default FurnitureForm;
