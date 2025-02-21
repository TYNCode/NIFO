import React from 'react';
import ProjectDetails from './ProjectDetails';

interface OneTabStepTwoProps {
    // Define props here
}

const OneTabStepTwo: React.FC<OneTabStepTwoProps> = (props) => {
    return (
        <div>
            <div>
                <ProjectDetails/>
            </div>
        </div>

    );
};

export default OneTabStepTwo;