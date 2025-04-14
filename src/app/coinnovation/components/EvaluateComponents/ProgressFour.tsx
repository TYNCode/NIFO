import React from 'react';
import SolutionProviders from './SolutionProviders';
import Tabs from '../Tabs';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setActiveTabSource } from "../../../redux/features/source/solutionProviderSlice";

interface ProgressFourProps {

}

interface Tab {
    id: string;
    label: string;
    enabled: boolean;
}


const ProgressFour: React.FC<ProgressFourProps> = (props) => {
    const dispatch = useAppDispatch();
    const activeTabSource = useAppSelector((state) => state.solutionProvider.activeTabSource);
    const solutionProviders = useAppSelector((state) => state.solutionProvider.solutionProviders);
 
    const handleTabChange = (tabId: string) => {
        dispatch(setActiveTabSource(tabId));
    };

    const tabs: Tab[] = [
        ...solutionProviders.map((provider) => ({
            id: provider.solution_provider_id,
            label: provider.solution_provider_name,
            enabled: true,
        })),
    ];

    const projectID = useAppSelector((state) => state.projects.projectDetails)


    return (
        <>
            <div className='bg-white rounded-xl shadow-sm p-5'>
                <div className='flex flex-col gap-4 bg-[#F5FCFF] rounded-lg p-4 mb-4'>
                    <div>
                        <div className='text-sm font-semibold'>ROI Evaluation & Customization</div>
                    </div>
                    <div>
                        <Tabs tabs={tabs} activeTab={activeTabSource} setActiveTab={handleTabChange} />
                    </div>
                    <div className=''>
                        <SolutionProviders />
                    </div>
                </div>
            </div>

        </>
    );
};

export default ProgressFour;