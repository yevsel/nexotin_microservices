import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import SpecificCategoryScreen from '../screens/SpecificCategoryScreen'
// import { ParentContext } from '../../../context/ParentContext'
import { ParentContext } from '../context/ParentContext'
import { useDispatch } from 'react-redux'
import { removeCategoriesData } from '../Actions'

const specificCategoryScreen = () => {

    const {
        setCategoriesProductsData,
        fetchMoreCategoryData,
        categoriesProductsLoading,
        getProductsByCategory
    } = useContext(ParentContext)
    

  const dispatch = useDispatch()
  useEffect(()=>{
    setCategoriesProductsData([])
    
    return()=>{
      setCategoriesProductsData([])
    }
  },[])


  return (
    <>
        <SpecificCategoryScreen 
            categoriesProductsLoading={categoriesProductsLoading}
            fetchMoreCategoryData={fetchMoreCategoryData}
            getProductsByCategory={getProductsByCategory}
            setCategoriesProductsData={setCategoriesProductsData}
            />
    </>
  )
}

export default specificCategoryScreen