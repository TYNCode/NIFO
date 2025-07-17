import React from 'react';

interface EnterpriseDashboardProps {
    
}

const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = (props) => {
    return (
        <div>
            <div>Project Analytics</div>
            <div>
                <div>Active Problem Statement</div>
                <div>
                    <div> 123</div>
                    <div>Trends </div>
                </div>
                <div>
                    Some statement
                </div>
            </div>
            <div>
                <div>Average Time to Vendor Match</div>
                <div>
                    <div>3.5 days</div>
                    <div>Trends</div>
                </div>
                <div>
                    Some statement
                </div>
            </div>
            <div>
                <div>Average Age of Unsolved PS</div>
                <div>
                    <div>60 days</div>
                    <div>Trends</div>
                </div>
                <div>
                    Some statement
                </div>
            </div>
           
        </div>
    );
};

export default EnterpriseDashboard;