import React from 'react';
import './Container.scss';

const Container = ({ children, cStyle }) => (
  <div className="uk-flex uk-flex-middle uk-animation-fade">
    <div className='uk-margin uk-width-large uk-margin-auto uk-card uk-card-default uk-card-body container' style={cStyle}>
      {children}
    </div>
  </div>
);

export default Container