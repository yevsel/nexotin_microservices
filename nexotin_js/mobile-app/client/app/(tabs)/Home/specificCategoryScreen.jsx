import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import SpecificCategoryScreen from '../../../screens/SpecificCategoryScreen'
import { ParentContext } from '../../../context/ParentContext'

const specificCategoryScreen = () => {

    const {
        setCategoriesProductsData,
        fetchMoreCategoryData,
        categoriesProductsLoading,
        categoriesProductsData,
        getProductsByCategory
    } = useContext(ParentContext)

  return (
    <>
        <SpecificCategoryScreen 
            categoriesProductsData={categoriesProductsData}
            categoriesProductsLoading={categoriesProductsLoading}
            fetchMoreCategoryData={fetchMoreCategoryData}
            getProductsByCategory={getProductsByCategory}
            setCategoriesProductsData={setCategoriesProductsData}
            />
    </>
  )
}

export default specificCategoryScreen