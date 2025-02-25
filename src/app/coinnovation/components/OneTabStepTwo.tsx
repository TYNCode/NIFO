import React from 'react';
import Questionairre from './Questionairre';
import ProjectDetails from './ProjectDetails';

interface OneTabStepTwoProps {
    
}

const OneTabStepTwo: React.FC<OneTabStepTwoProps> = (props) => {
    return (
        <div className="w-full flex gap-20">
        <div className="w-[20%]">
            {/* <ProjectDetails/> */}
        </div>
        <div className="w-[80%] h-screen">
          <Questionairre/>
        </div>
      </div>

    );
};

export default OneTabStepTwo;