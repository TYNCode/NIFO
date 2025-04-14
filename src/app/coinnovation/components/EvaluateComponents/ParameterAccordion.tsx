import React, { useState } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import { fetchROIEvaluation, updateSubParameter } from '../../../redux/features/coinnovation/roiEvaluationSlice';
import { useAppSelector } from '../../../redux/hooks';

interface ParameterAccordionProps {
   
}

const ParameterAccordion: React.FC<ParameterAccordionProps> = (props) => {
    const dispatch = useDispatch();
    const data = useSelector((state: any) => state.roiEvaluation.data?.sub_parameters || []);

    const handleDelete = (id: number) => {
        console.log(`Delete param with id ${id}`);
    };

    return (
        <div>
            <div className='flex flex-col gap-4'>
                <div className="flex flex-col text-sm w-full">
                    <div className="grid grid-cols-6 auto-cols-max gap-2 font-semibold text-xs text-[#0071C1] p-2 rounded-lg border-[0.5px] border-[rgba(0,113,193,0.19)] bg-[#DBF0FF]">
                        <div>Parameter Name</div>
                        <div>UOM</div>
                        <div>Per Unit Cost or Per Labour</div>
                        <div>Total Units or Total Hours</div>
                        <div>Total</div>
                        <div>
                            <IoIosAddCircleOutline className='cursor-pointer'/>
                        </div>
                    </div>

                    {data.map((item: any, index: number) => (
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
        </div>
    );
};

export default ParameterAccordion;