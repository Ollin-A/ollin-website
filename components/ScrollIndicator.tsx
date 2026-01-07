import React from 'react';

const ScrollIndicator: React.FC = () => {
  return (
    <div className="scrollIndicator" aria-hidden="true">
      <span className="scrollLabel">SCROLL</span>
      <span className="scrollLine">
        <span className="scrollDot" />
      </span>
    </div>
  );
};

export default ScrollIndicator;