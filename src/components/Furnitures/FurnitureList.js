import React from 'react';

import './FurnitureList.css';

const FurnitureList = props => {
  return (
    <section className="furniture-list">
      <ul>
	    {props.furnitures.map(fr => (
        <li key={fr.name}>
          <div className="furniture-title">
  	       <h2>{fr.name}</h2>
  	       <div className="furniture-price">Rp. {fr.price.toLocaleString("id-ID")}</div>
          </div>
	        <span>{fr.description.substring(0, 114) + "..."}</span>
          <div className="furniture-styles">
            {fr.furniture_style.map(style => (
              <strong key={style}>{style}</strong>
            ))}
          </div>
          <div className="furniture-time">
            {fr.delivery_time} days delivery
          </div>
        </li>
	    ))}
      </ul>
    </section>
  );
};

export default FurnitureList;
