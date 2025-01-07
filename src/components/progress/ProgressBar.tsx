import React from 'react'

interface ProgressBarProps {
  count: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ count }) => {
  return (
    <div className="progress-bar__energy h-[16px] progressBarParent w-full rounded-full overflow-hidden ">
      <div className="h-[16px] progressBarLine"
        style={{ width: `${count}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
