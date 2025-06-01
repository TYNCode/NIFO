"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  createSpotlight,
  updateSpotlight,
  setSpotlightModalOpen,
  selectSelectedSpotlight,
  selectSpotlightMode,
} from "@/app/redux/features/spotlight/spotlightSlice";
import { Spotlight } from "@/app/admin/spotlights/types/spotlights";

const defaultValues: Partial<Spotlight> = {
  spotlight_title: "",
  spotlight_subtitle: "",
  spotlight_category: "",
  spotlight_week: "",
  logo_url: "",
  problem_address: "",
  use_case: "",
  impact: "",
  technology_leveraged: [{ heading: "", body: "" }],
  is_selected: false,
  gartner_tag: null,
  sort_order: 0,
  spotlight_startup: 0,
};

const SpotlightModal = () => {
  const dispatch = useAppDispatch();
  const spotlight = useAppSelector(selectSelectedSpotlight);
  const mode = useAppSelector(selectSpotlightMode);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Partial<Spotlight>>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "technology_leveraged",
  });

  useEffect(() => {
    if (mode === "edit" && spotlight) {
      reset(spotlight);
    } else {
      reset(defaultValues);
    }
  }, [spotlight, mode, reset]);

  const onSubmit = (data: Partial<Spotlight>) => {
    const cleanedData: Partial<Spotlight> = {
      ...data,
      spotlight_startup: Number(data.spotlight_startup),
      sort_order: Number(data.sort_order),
      gartner_tag: data.gartner_tag || null,
    };

    if (mode === "edit" && spotlight?.id) {
      dispatch(updateSpotlight({ id: spotlight.id, payload: cleanedData }));
    } else {
      dispatch(createSpotlight(cleanedData));
    }

    dispatch(setSpotlightModalOpen(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-semibold mb-4">
          {mode === "edit" ? "Edit Spotlight" : "Add New Spotlight"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Title *</label>
              <input {...register("spotlight_title", { required: "Title is required" })} placeholder="e.g., AI for Compliance Automation" className="border p-2 rounded w-full" />
              {errors.spotlight_title && <p className="text-red-500 text-xs">{errors.spotlight_title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Subtitle</label>
              <input {...register("spotlight_subtitle")} placeholder="e.g., Transforming how companies handle regulations" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input {...register("spotlight_category")} placeholder="e.g., RegTech, AI Compliance" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium">Spotlight Week</label>
              <input {...register("spotlight_week")} placeholder="e.g., Week 9" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium">Logo URL *</label>
              <input {...register("logo_url", {
                required: "Logo URL is required",
                pattern: {
                  value: /^(https?:\/\/.*\..{2,})/,
                  message: "Enter a valid URL",
                },
              })} placeholder="https://example.com/logo.png" className="border p-2 rounded w-full" />
              {errors.logo_url && <p className="text-red-500 text-xs">{errors.logo_url.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Startup ID *</label>
              <input type="number" {...register("spotlight_startup", { required: "Startup ID is required", valueAsNumber: true })} placeholder="e.g., 530" className="border p-2 rounded w-full" />
              {errors.spotlight_startup && <p className="text-red-500 text-xs">{errors.spotlight_startup.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Sort Order</label>
              <input type="number" {...register("sort_order", { valueAsNumber: true })} placeholder="e.g., 1" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium">Gartner Tag</label>
              <select {...register("gartner_tag")} className="border p-2 rounded w-full">
                <option value="">Select Gartner Tag</option>
                <option value="cool_vendor">Cool Vendor</option>
                <option value="magic_quadrant">Magic Quadrant</option>
                <option value="hype_cycle">Hype Cycle</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Problem Address</label>
            <textarea {...register("problem_address")} placeholder="What business challenge is being solved?" className="border p-2 w-full rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Use Case</label>
            <textarea {...register("use_case")} placeholder="Real-world use case where this startup added value" className="border p-2 w-full rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Impact</label>
            <textarea {...register("impact")} placeholder="What was the measurable result?" className="border p-2 w-full rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Technology Leveraged</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input {...register(`technology_leveraged.${index}.heading`)} placeholder="e.g., NLP Engine" className="border p-2 rounded w-1/3" />
                <input {...register(`technology_leveraged.${index}.body`)} placeholder="e.g., Enables document analysis at scale" className="border p-2 rounded w-2/3" />
                <button type="button" onClick={() => remove(index)} className="text-red-500">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => append({ heading: "", body: "" })} className="text-blue-600 text-sm mt-2">
              + Add More
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("is_selected")} /> Selected
            </label>
            <label className="flex items-center gap-2 text-gray-400" title="Not editable">
              <input type="checkbox" checked={spotlight?.is_tyn_verified || false} disabled /> TYN Verified
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={() => dispatch(setSpotlightModalOpen(false))} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpotlightModal;
