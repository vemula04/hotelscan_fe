/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
// FormDataContext.js
import  { createContext, useContext, useState } from "react";

const FormDataContext = createContext<any>(null);

export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children}:any) => {
  const [itemDetails, setItemDetails] = useState({ itemName: "", amount: "" , offerPrice:"", cuponCode:"", description:"", spiceLevel:""});
const [open, setOpen] = useState(false);
const [indexedImage, setIndexedImage] = useState(0);
  return (
    <FormDataContext.Provider
      value={{
        itemDetails,
        setItemDetails,
        open, setOpen,
        indexedImage, setIndexedImage
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};
