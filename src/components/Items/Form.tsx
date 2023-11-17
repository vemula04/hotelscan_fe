/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as React from "react";
import {
  Alert,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useFormData } from "./stateManagement/FormDataContext";
import { ScanAppService } from "../../services/ScanAppService";
import { Link, useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useConfig } from "../../config/config";
// import {decode as base64_decode, encode as base64_encode} from 'base-64';
import { RippleLoader } from "../Loader/RippleLoader";

export const Form = () => {
  const { tenant } = useParams();
  const config: any = useConfig();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // let encoded = base64_encode('YOUR_DECODED_STRING');
  // let decoded = base64_decode('YOUR_ENCODED_STRING');
  const { itemDetails, setItemDetails } = useFormData();
  const [fileSrc, setFileSrc] = useState(
    "../../assets/img/dummy-post-horisontal.jpg"
  );
  const [response, setResponse] = useState({ message: "", statusCode: 0 });
  const tdata = config?.data[0];
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const src = e.target.result;
      setFileSrc(src);
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  };
  const [errors, setErrors] = useState({
    itemDetails: {
      itemName: "",
      amount: "",
      offerPrice: "",
      description: "",
      spiceLevel: "",
      isSpecial: true,
    },
  });
  const onBlurItemDetails = (fieldName: any) => () => {
    if (!itemDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        itemDetails: {
          ...prevErrors.itemDetails,
          [fieldName]: "This field is required.",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        itemDetails: {
          ...prevErrors.itemDetails,
          [fieldName]: "",
        },
      }));
    }
  };

  const handleSubmit = async (event: any) => {
    let isFormFieldValid = false;
    event.preventDefault();

    // Perform onBlur validation for all fields
    onBlurItemDetails("itemName")();
    onBlurItemDetails("amount")();
    onBlurItemDetails("offerPrice")();
    onBlurItemDetails("description")();
    onBlurItemDetails("spiceLevel")();

    // If there are any validation errors, prevent form submission
    if (
      errors.itemDetails.itemName ||
      errors.itemDetails.amount ||
      errors.itemDetails.offerPrice ||
      errors.itemDetails.description ||
      errors.itemDetails.spiceLevel
    ) {
      // return;
      isFormFieldValid = false;
    } else {
      isFormFieldValid = true;
    }
    // setReview(false)
    try {
      console.log(`fileSrc :: `, fileSrc);
      // return;
      if (isFormFieldValid) {
        setIsLoading(false);
        const res = await ScanAppService.postItem({
          tenant_id: tdata?._id,
          name: itemDetails.itemName,
          url: fileSrc,
          // "is_special": itemDetails.isSpecial,
          is_special: true,
          item_price: itemDetails.amount,
          promotional_price: itemDetails.offerPrice,
          is_promotional_applicable: false,
          is_coupon_applicable: false,
          coupon_code: "",
          created_by: tdata?._id,
          item_desc: itemDetails.description,
          expired_on: new Date().getUTCMilliseconds(),
          spicy_level: itemDetails.spiceLevel,
        });
        if (res) {
          setIsLoading(true);
          setResponse({ message: "success", statusCode: res.status });
          setItemDetails({
            itemName: "",
            amount: "",
            offerPrice: "",
            description: "",
            spiceLevel: "",
            isSpecial: true,
          });
          setTimeout(() => {
            navigate(`../${tenant}/dashBoard`, { replace: true });
          }, 3000);
        }
      }

      // Frame the formData object based on the form field values
    } catch (error) {
      console.error("Error posting or updating data:", error);
      // Handle errors while posting or updating data
    }
  };
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  return (
    <div className="register-form p-5 needs-validation" id="register-form">
      {response.statusCode == 200 && (
        <Alert onClose={() => {}}>
          Item Added {`${response.message}`}fully
        </Alert>
      )}
      <div>
        {isLoading ? (
          <div>
            <fieldset className="scheduler-border">
              <legend className="scheduler-border">Item Details</legend>
              <div className="control-group">
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Item Name"
                        multiline
                        variant="outlined"
                        value={itemDetails.itemName}
                        onChange={(e) => {
                          const id = e.target.value
                            .replace(/^\s+/, "")
                            .replace(/\s{2,}/g, " ")
                            .replace(/[^a-zA-Z0-9 ]/g, "");
                          // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                          setItemDetails({ ...itemDetails, itemName: id });
                        }}
                        size="small"
                        onBlur={onBlurItemDetails("itemName")}
                        error={!!errors.itemDetails.itemName}
                        helperText={errors.itemDetails.itemName}
                        inputProps={{ maxLength: 50 }}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Item Price"
                        multiline
                        variant="outlined"
                        value={itemDetails.amount}
                        onChange={(e) => {
                          const amount = e.target.value.replace(
                            /^0+|[^0-9]/g,
                            ""
                          );
                          setItemDetails({ ...itemDetails, amount: amount });
                        }}
                        // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                        size="small"
                        onBlur={onBlurItemDetails("amount")}
                        error={!!errors.itemDetails.amount}
                        helperText={errors.itemDetails.amount}
                        inputProps={{ maxLength: 5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {" "}
                              {tdata.currency_code == "AUD" ||
                              tdata.currency_code == "US"
                                ? "$"
                                : "₹"}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Offer Price"
                        multiline
                        variant="outlined"
                        value={itemDetails.offerPrice}
                        onChange={(e) => {
                          const offerPrice = e.target.value.replace(
                            /^0+|[^0-9]/g,
                            ""
                          );
                          setItemDetails({
                            ...itemDetails,
                            offerPrice: offerPrice,
                          });
                        }}
                        // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                        size="small"
                        onBlur={onBlurItemDetails("offerPrice")}
                        error={!!errors.itemDetails.offerPrice}
                        helperText={errors.itemDetails.offerPrice}
                        inputProps={{ maxLength: 5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {tdata.currency_code == "AUD" ||
                              tdata.currency_code == "US"
                                ? "$"
                                : "₹"}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextareaAutosize
                        id="outlined-basic"
                        minRows={3} // Adjust the number of rows as needed
                        placeholder="Description"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ccc",
                        }}
                        value={itemDetails.description}
                        onChange={(e) => {
                          const description = e.target.value
                            .replace(/^\s+/, "")
                            .replace(/\s{2,}/g, " ")
                            .replace(/[^a-zA-Z0-9 ]/g, "");
                          setItemDetails({
                            ...itemDetails,
                            description: description,
                          });
                        }}
                        onBlur={onBlurItemDetails("description")}
                        // error={!!errors.itemDetails.description}
                        // helperText={errors.itemDetails.description}
                        maxLength={50} // You can set the maxLength directly on TextareaAutosize
                      />
                      {errors.itemDetails.description && (
                        <FormHelperText error>
                          {errors.itemDetails.description}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>

                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Spice Level on a scale of 1-5"
                        multiline
                        variant="outlined"
                        value={itemDetails.spiceLevel}
                        onChange={(e) => {
                          const spiceLevel = e.target.value.replace(
                            /[^1-5]/g,
                            ""
                          );
                          // const spiceLevel = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                          setItemDetails({
                            ...itemDetails,
                            spiceLevel: spiceLevel,
                          });
                        }}
                        size="small"
                        onBlur={onBlurItemDetails("spiceLevel")}
                        error={!!errors.itemDetails.spiceLevel}
                        helperText={errors.itemDetails.spiceLevel}
                        inputProps={{ maxLength: 1 }}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Coupoun codes
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={age}
                        label="Coupoun code"
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className=" d-flex align-items-right mb-3">
                    <input
                      className=""
                      type="checkbox"
                      id="is_special"
                      checked
                      value={itemDetails.isSpecial}
                    />
                    <label className=" mb-0 ms-3">Is Special</label>
                  </div>
                  <div
                    className="col-md-12"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl sx={{ m: 1 }}>
                      <div className="avatar-upload">
                        <div className="avatar-edit">
                          <input
                            type="file"
                            id="imageUpload"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleFileChange}
                          />
                          <label htmlFor="imageUpload"></label>
                        </div>
                        <div className="item-preview">
                          {/* <div id="imagePreview" style={{background: "url(http://i.pravatar.cc/500?img=7);"}}> */}
                          {fileSrc && (
                            <img
                              src={fileSrc}
                              id="imagePreview"
                              alt="Selected file"
                            />
                          )}
                          {/* </div> */}
                        </div>
                      </div>
                    </FormControl>
                  </div>
                </div>
              </div>
            </fieldset>
            <div className="col-12">
              <FormControl sx={{ m: 1 }}>
                <Link to={`/${tenant}/dashBoard`}>
                  <div className="backArrow">
                    <ArrowBackIcon />
                  </div>
                </Link>
              </FormControl>
              <FormControl sx={{ m: 1, float: "right" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  style={{
                    background: `${config?.data[0]?.primary_color}`,
                    color: `${config?.data[0]?.secondary_color}`,
                  }}
                >
                  <span>Add</span>
                </button>
              </FormControl>
            </div>
          </div>
        ) : (
          <div>
            {" "}
            <RippleLoader />
          </div>
        )}
      </div>
    </div>
  );
};
