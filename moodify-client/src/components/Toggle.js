import React from 'react';

export default function Toggle({ leftText, rightText, onClickLeft, onClickRight, leftActive }) {
  const leftStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  };

  const rightStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  };

  if (leftActive) {
    leftStyle.backgroundColor = 'green';
  } else {
    rightStyle.backgroundColor = 'green';
  }

  return (
    <div className="toggle">
      <button className="toggle-half toggle-left" type="button" onClick={onClickLeft} style={leftStyle}>{leftText}</button>
      <button className="toggle-half toggle-right" type="button" onClick={onClickRight} style={rightStyle}>{rightText}</button>
    </div>
  );
}
