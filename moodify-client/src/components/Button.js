import React from 'react';

export default function Button({
  onClick, text, color, type, active, filterActive,
}) {
  const style = {
    backgroundColor: color,
  };
  if (active) {
    style.boxShadow = '2px 2px 20px lightgray';
  }
  if (filterActive) {
    style.color = '#1DAF51';
    style['border-color'] = '#1DAF51';
  }
  return (
    <button className={`${type}-button`} style={style} type="button" onClick={onClick}>
      {text}
    </button>
  );
}
