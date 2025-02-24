import React from 'react';
import ProjectDetails from './ProjectDetails';

interface OneTabStepTwoProps {
    // Define props here
}

const OneTabStepTwo: React.FC<OneTabStepTwoProps> = (props) => {
    return (
        <div className='w-full flex gap-20'>
            <div className='w-1/3'>Hi</div>
            <div className='w-2/3'>
                <ProjectDetails/>
            </div>
        </div>

    );
};

export default OneTabStepTwo;