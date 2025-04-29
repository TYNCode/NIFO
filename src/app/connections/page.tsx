import React from 'react';

interface pageProps {

}

const page: React.FC<pageProps> = (props) => {
    return (
        <div>
            <div>
                <div className='text-[#0071C1] font-medium text-xl'>Connections</div>
                <div className='text-[#787878]'>Manage your engagement connections and request</div>
            </div>
            <div>
                <div></div>
            </div>
        </div>
    );
};

export default page;