import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { setUserInfo } from "../features/auth/userInfoSlice"

const useUserInfo = ()=> {
    const dispatch = useAppDispatch()
    const userInfoObject = useAppSelector((state)=> state.userInfo)


    useEffect(()=> {
    const userInfoFromStorage  = localStorage.getItem('user')
    if(userInfoFromStorage) {
        const parsedUserInfo = JSON.parse(userInfoFromStorage);
        dispatch(setUserInfo(parsedUserInfo))

    }

    },[dispatch])

    return userInfoObject.userInfo
}

export default useUserInfo