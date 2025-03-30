
import React from 'react'

const WorkInProgress = () => {
  return (
    <>
      {/* Google Font Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      <svg
        width="400"
        height="120"
        viewBox="0 0 400 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <style>
          {`
            .text {
              font-family: 'Press Start 2P', monospace;
              font-size: 14px;
              fill: #00ffcc;
              animation:
                bounce 1s infinite ease-in-out,
                flicker 2s infinite steps(1, end);
              filter: drop-shadow(0 0 4px #00ffcc);
            }

            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-8px);
              }
            }

            @keyframes flicker {
              0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                opacity: 1;
              }
              20%, 22%, 24%, 55% {
                opacity: 0.5;
              }
            }
          `}
        </style>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text"
        >
          WORK IN PROGRESS
        </text>
      </svg>
    </>
  )
}

export default WorkInProgress
