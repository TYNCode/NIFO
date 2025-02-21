import React from 'react';

interface ProjectDetailsProps {

}

const ProjectDetails: React.FC<ProjectDetailsProps> = (props) => {
    return (
        <div>
            <div>
                <div className='flex flex-col gap-3'>
                    <div>Project Entry Details</div>
                    <div className='flex flex-col'>
                        <div>Project ID</div>
                        <div className=''>
                           <input type='text' className='rounded-md focus:ring-0  border-blue-500' />
                        </div>
                    </div>
                    <div>
                        <div>Project Name</div>
                        <div></div>
                    </div>
                    <div>
                        <div>
                            <div>Priority</div>
                            <div></div>
                        </div>
                        <div>
                            <div>Status</div>
                            <div></div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Start Date</div>
                            <div></div>
                        </div>
                        <div>
                            <div>Target Closure</div>
                            <div></div>
                        </div>
                    </div>
                </div>

                <div>
                    <div>Enterprise Details</div>
                    <div>
                        <div>Project ID</div>
                        <div></div>
                    </div>
                    <div>
                        <div>Project Name</div>
                        <div></div>
                    </div>
                    <div>
                        <div>
                            <div>Priority</div>
                            <div></div>
                        </div>
                        <div>
                            <div>Status</div>
                            <div></div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Start Date</div>
                            <div></div>
                        </div>
                        <div>
                            <div>Target Closure</div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;