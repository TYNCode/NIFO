import React, { useState } from 'react'
import { FaChevronUp, FaEdit } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ProblemStatement = ({ problemStatement, setProblemStatement, handleProceed, handleSkipQuestions ,isChoosenOption , isQuestionnaireLoading , questionnaireFile}) => {
    const [isProblemStatementVisible, setIsProblemStatementVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
  

    const handleToggleProblemStatement = () => {
        setIsProblemStatementVisible(!isProblemStatementVisible);
    }

    const handleEdit = () => {
        setIsProblemStatementVisible(true);
        setIsEditing(true);
    }

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setIsEditing(false);
        }
    }

    const handleChange = (e) => {
        setProblemStatement(e.target.value);
    }
  return (
      <div>

          {problemStatement && (
            <>
                  <div className="flex flex-col mt-4">
                      <div className="flex flex-row  items-center justify-between gap-4 bg-neutral-100 shadow-md px-2 py-2 rounded-t-lg">
                          <div className="font-medium text-base text-gray-500 ">
                              Problem Statement
                          </div>
                          <div className="flex flex-row gap-4">
                              <div className="text-gray-500 cursor-pointer" onClick={handleEdit}>
                                  <MdModeEdit />
                              </div>
                              <div className="text-gray-500 cursor-pointer" onClick={handleToggleProblemStatement}>
                                  <FaChevronUp />
                              </div>
                          </div>
                      </div>
                      {isProblemStatementVisible && (
                          <div className="bg-white shadow-md px-4 py-3" >
                              {isEditing ? (
                                  <textarea
                                      className="w-full border-none focus:ring-[1px] px-2 py-1 rounded-sm focus:ring-gray-500"
                                      value={problemStatement}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      onKeyDown={handleKeyDown}
                                      autoFocus
                                  />
                              ) : (
                                  <div onClick={handleEdit} className="cursor-pointer">
                                      {problemStatement}
                                  </div>
                              )}
                          </div>
                      )}
                  </div>

                  {!isChoosenOption && !questionnaireFile &&(
                      <div className='flex flex-row justify-center items-center gap-4 mt-5'>
                          <div className="font-medium text-base text-gray-500">
                              Can I ask you some questions to understand the problem in depth?
                          </div>
                          {isQuestionnaireLoading ? (
                            <div>
                             <AiOutlineLoading3Quarters className='animate-spin' />
                            </div>
                          ) : (
                          <div className='bg-blue-400 px-3 py-1.5 rounded-md text-white text-sm cursor-pointer flex items-center' onClick={handleProceed}>
                              Proceed
                          </div>
                          )}
                        
                         
                          <div className='bg-gray-300 px-3 py-1.5 rounded-md text-white text-sm cursor-pointer flex items-center' onClick={handleSkipQuestions}>
                              Skip
                          </div>
                      </div>
                  )  
                  }
            </>
             
          )}

      </div>
  )
}

export default ProblemStatement