import React from 'react'
import styled from 'styled-components';



function CoMap() {
    return (
        <div className="map-view">
            <h2>Map View</h2>
            <div className="map-area">Tables Area</div>
            <div className="controls">
                <div className="time-slider">
                    <label>Time:</label>
                    <input type="range" min="0" max="24" />
                </div>
                <div className="date-controls">
                    <button>-</button>
                    <input type="date" />
                    <button>+</button>
                </div>
            </div>
        </div>
    )
}

export default CoMap