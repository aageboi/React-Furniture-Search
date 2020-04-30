import React from 'react';

import './Card.css';

const Card = props => {
  const { style } = props;

  return <div className="card" style={ style }>{props.children}</div>;
};

export default Card;
