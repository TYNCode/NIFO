import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchROIEvaluation,
    updateSubParameter,
    saveROISectionParameters,
    deleteSubParameter,
} from '../../../redux/features/coinnovation/roiEvaluationSlice';
import { useAppSelector } from '../../../redux/hooks';
import { FaSpinner } from "react-icons/fa";
import { toast } from 'react-toastify';

interface ParameterAccordionProps {
    sectionKey: string;
    isEditable: boolean;
}

const ParameterAccordion: React.FC<ParameterAccordionProps> = ({ sectionKey, isEditable }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedParamId, setSelectedParamId] = useState<number | null>(null);

    const solutionProviderID = useAppSelector((state) => state.solutionProvider.activeTabSource);
    const roiId = useAppSelector((state) => state.roiEvaluation.data?.id);
    const allData = useSelector((state: any) => state.roiEvaluation.data?.sub_parameters || []);
    const projectID = useAppSelector((state) => state.projects.projectDetails?.project_id || '');

    const data = allData.filter((item: any) => item.section === sectionKey);

    useEffect(() => {
        const loadData = async () => {
            if (solutionProviderID && projectID) {
                setIsLoading(true);
                await dispatch(fetchROIEvaluation({
                    project_id: String(projectID),
                    solution_provider_id: String(solutionProviderID),
                    force_refresh: false
                }) as any);
                setIsLoading(false);
            }
        };
        loadData();
    }, [solutionProviderID, projectID, dispatch]);

    const calculateTotal = (units: number | null, cost: number | null) => {
        return units != null && cost != null ? units * cost : null;
    };

    const handleInputChange = (id: number, field: 'uom' | 'per_unit_cost' | 'units', value: string | number) => {
        const item = allData.find((param: any) => param.id === id);
        if (!item) return;

        const updated = {
            ...item,
            [field]: value,
            total: field === 'units' || field === 'per_unit_cost'
                ? Number(field === 'units' ? value : item.units) * Number(field === 'per_unit_cost' ? value : item.per_unit_cost)
                : item.total,
        };

        dispatch(updateSubParameter({ id, updates: updated }));
    };

    const handleBlur = async () => {
        if (!roiId || !sectionKey) return;

        const updatedParams = data.map(({ id, uom, per_unit_cost, units }) => ({
            id,
            uom,
            per_unit_cost,
            units
        }));

        try {
            setAutoSaving(true);
            await dispatch(saveROISectionParameters({
                roiId,
                section: sectionKey,
                updates: updatedParams
            }) as any);
        } catch (e) {
            toast.error(`Auto-save failed in ${sectionKey}`);
        } finally {
            setAutoSaving(false);
        }
    };

    const handleNumericInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: number,
        field: 'per_unit_cost' | 'units'
    ) => {
        const value = e.target.value;
        if (value === '' || (/^\d{1,7}$/.test(value))) {
            handleInputChange(id, field, Number(value));
        }
    };

    const handleDeleteClick = (id: number) => {
        setSelectedParamId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedParamId || !roiId || !sectionKey) return;

        try {
            await dispatch(deleteSubParameter({ roiId, section: sectionKey, id: selectedParamId }) as any);
            toast.success("Parameter deleted successfully");

            await dispatch(fetchROIEvaluation({
                project_id: String(projectID),
                solution_provider_id: String(solutionProviderID)
            }) as any);
        } catch (err) {
            toast.error("Failed to delete parameter");
            console.error(err);
        } finally {
            setShowDeleteModal(false);
            setSelectedParamId(null);
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            {isLoading ? (
                <div className="flex justify-center items-center py-6">
                    <FaSpinner className="animate-spin text-[#0071C1] text-2xl" />
                </div>
            ) : (
                <div className="flex flex-col text-sm w-full">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 font-semibold text-xs text-[#0071C1] p-2 rounded-lg border border-[rgba(0,113,193,0.19)] bg-[#DBF0FF]">
                        <div>Parameter Name</div>
                        <div className="text-center">UOM</div>
                        <div className="text-center">Per Unit Cost</div>
                        <div className="text-center">Total Units</div>
                        <div className="text-center">Total</div>
                    </div>

                    {data.map((item: any) => (
                        <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 my-1 bg-white py-3 px-3 shadow-sm rounded-md items-center">
                            <div className="truncate text-[#0071C1] font-semibold text-xs">
                                {item.parameter_name ?? '—'}
                            </div>

                            {isEditable ? (
                                <>
                                    <input
                                        type="text"
                                        value={item.uom ?? ''}
                                        onChange={(e) => handleInputChange(item.id, 'uom', e.target.value)}
                                        onBlur={handleBlur}
                                        className="text-center text-[#0071C1] font-semibold text-xs bg-transparent border-b border-gray-300 focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={item.per_unit_cost ?? ''}
                                        onChange={(e) => handleNumericInputChange(e, item.id, 'per_unit_cost')}
                                        onBlur={handleBlur}
                                        className="text-center text-[#0071C1] font-semibold text-xs bg-transparent border-b border-gray-300 focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={item.units ?? ''}
                                        onChange={(e) => handleNumericInputChange(e, item.id, 'units')}
                                        onBlur={handleBlur}
                                        className="text-center text-[#0071C1] font-semibold text-xs bg-transparent border-b border-gray-300 focus:outline-none"
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="text-center text-[#0071C1] font-semibold text-xs">{item.uom ?? '—'}</div>
                                    <div className="text-center text-[#0071C1] font-semibold text-xs">{item.per_unit_cost ?? '—'}</div>
                                    <div className="text-center text-[#0071C1] font-semibold text-xs">{item.units ?? '—'}</div>
                                </>
                            )}

                            <div className="text-center text-[#0071C1] font-semibold text-xs">
                                {calculateTotal(item.units, item.per_unit_cost) ?? '—'}
                            </div>

                            <div className="text-red-500 cursor-pointer pl-2 text-right" onClick={() => handleDeleteClick(item.id)}>
                                <RiDeleteBinLine />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this parameter?</p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParameterAccordion;
