import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import { fetchROIEvaluation, updateSubParameter } from '../../../redux/features/coinnovation/roiEvaluationSlice';
import { useAppSelector } from '../../../redux/hooks';

interface ParameterAccordionProps {
    sectionKey: string;
}

const ParameterAccordion: React.FC<ParameterAccordionProps> = ({ sectionKey }) => {
    const dispatch = useDispatch();
    const solutionProviderID = useAppSelector((state) => state.solutionProvider.activeTabSource);
    const allData = useSelector((state: any) => state.roiEvaluation.data?.sub_parameters || []);
    const projectID = useAppSelector((state) => state.projects.projectDetails?.project_id || '');

    const data = allData.filter((item: any) => item.section === sectionKey);

    useEffect(() => {
        if (solutionProviderID && projectID) {
            dispatch(fetchROIEvaluation({
                project_id: String(projectID),
                solution_provider_id: String(solutionProviderID),
                force_refresh: false
            }) as any);
        }
    }, [solutionProviderID, projectID, dispatch]);

    const handleDelete = (id: number) => {
        console.log(`Delete param with id ${id}`);
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex flex-col text-sm w-full">
                <div className="grid grid-cols-6 auto-cols-max gap-2 font-semibold text-xs text-[#0071C1] p-2 rounded-lg border-[0.5px] border-[rgba(0,113,193,0.19)] bg-[#DBF0FF]">
                    <div>Parameter Name</div>
                    <div>UOM</div>
                    <div>Per Unit Cost or Per Labour</div>
                    <div>Total Units or Total Hours</div>
                    <div>Total</div>
                    <div><IoIosAddCircleOutline className='cursor-pointer' /></div>
                </div>

                {data.map((item: any) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-6 auto-cols-max my-1 bg-white py-3 px-3 shadow-sm rounded-md items-center"
                    >
                        <div className="truncate text-[#0071C1] font-semibold text-xs">{item.parameter_name}</div>
                        <div className="truncate text-[#0071C1] font-semibold text-xs">{item.uom}</div>
                        <div className='text-[#0071C1] font-semibold text-xs'>{item.per_unit_cost}</div>
                        <div className='text-[#0071C1] font-semibold text-xs'>{item.units}</div>
                        <div className='text-[#0071C1] font-semibold text-xs'>{item.total}</div>
                        <div className="text-red-500 cursor-pointer" onClick={() => handleDelete(item.id)}>
                            <RiDeleteBinLine />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParameterAccordion;
