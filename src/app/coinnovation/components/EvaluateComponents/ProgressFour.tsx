import React, { useEffect } from 'react';
import SolutionProviders from './SolutionProviders';
import Tabs from '../Tabs';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    setActiveTabSource,
    selectShortlistedProviders
} from "../../../redux/features/source/solutionProviderSlice";

interface Tab {
    id: string;
    label: string;
    enabled: boolean;
}

const ProgressFour: React.FC = () => {
    const dispatch = useAppDispatch();

    const activeTabSource = useAppSelector((state) => state.solutionProvider.activeTabSource);
    const solutionProviders = useAppSelector(selectShortlistedProviders);

    const handleTabChange = (tabId: string) => {
        dispatch(setActiveTabSource(tabId));
    };

    useEffect(() => {
        const isActiveTabValid = solutionProviders.some(
            (provider) => provider.solution_provider_id === activeTabSource
        );

        if (!isActiveTabValid && solutionProviders.length > 0) {
            const defaultId = solutionProviders[0].solution_provider_id;
            dispatch(setActiveTabSource(defaultId));
        }
    }, [solutionProviders, activeTabSource, dispatch]);

    const tabs: Tab[] = solutionProviders.map((provider) => ({
        id: provider.solution_provider_id,
        label: provider.solution_provider_name,
        enabled: true,
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex flex-col gap-4 bg-[#F5FCFF] rounded-lg p-4 mb-4">
                <div>
                    <div className="text-sm font-semibold">ROI Evaluation & Customization</div>
                </div>

                {tabs.length > 0 && activeTabSource && (
                    <>
                        <Tabs tabs={tabs} activeTab={activeTabSource} setActiveTab={handleTabChange} />
                        <SolutionProviders />
                    </>
                )}
            </div>
        </div>
    );
};

export default ProgressFour;
