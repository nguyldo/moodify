import React from 'react';

export default function Button({ onClick, text, color, type }) {
    return (
        <button className={type + "-button"} style={{backgroundColor: color}} type="button" onClick={onClick}>
            {text}
        </button>
    );
}