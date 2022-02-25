import React from 'react';

export default function Button({ onClick, text, color, type, active }) {
    let style = {
        backgroundColor: color
    }
    if (active) {
        style["boxShadow"] = "2px 2px 20px lightgray";
    }
    return (
        <button className={type + "-button"} style={style} type="button" onClick={onClick}>
            {text}
        </button>
    );
}