import React from 'react';

const BackgroundShape: React.FC = () => {
  return (
    <div className="bgRingsGroup" aria-hidden="true">
      <div className="bgOrb" />
      <div className="bgRing" />
      <div className="bgRing" />
      <div className="bgRing" />
      <div className="bgRing" />
    </div>
  );
};

export default BackgroundShape;