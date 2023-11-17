/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Alert,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";
import { useFormData } from "./stateManagement/FormDataContext";
import { ScanAppService } from "../../services/ScanAppService";
export const Form = () => {
  const {
    tenantDetails,
    setTenantDetails,
    userDetails,
    setUserDetails,
    location,
    setLocation,
    checked,
    setChecked,
    themeDetails, setThemeDetails
  } = useFormData();
  const [response , setResponse]= useState({message: "",statusCode: 0})
  const [errors, setErrors] = useState({
    tenantDetails: { tenantName: "", email: "" },
    userDetails: {
      name: "",
      email: "",
      contact: "",
    },
    location: {
      address: "",
      country: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });
  const [isNotOnboarded, setIsNotOnboarded] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");

  // Other code (onBlur functions, handleSubmit, etc.)

  const handleCheckboxChange = (event: any) => {
    setChecked(event.target.checked);
    setCheckboxError("");
  };
  const onBlurtenantDetails = (fieldName: any) => () => {
    if (!tenantDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tenantDetails: {
          ...prevErrors.tenantDetails,
          [fieldName]: "This field is required.",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tenantDetails: {
          ...prevErrors.tenantDetails,
          [fieldName]: "",
        },
      }));
    }
  };

  const onBlurUserDetails = (fieldName: any) => () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          [fieldName]: "This field is required.",
        },
      }));
    } else if (fieldName === "email" && !emailRegex.test(userDetails.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          email: "Invalid email format.",
        },
      }));
    } else if (fieldName === "contact" && userDetails.contact.length < 9) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          contact: "Enter your 10 digits contact number",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          [fieldName]: "",
        },
      }));
    }
  };

  const onBlurLocation = (fieldName: any) => () => {
    if (!location[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: {
          ...prevErrors.location,
          [fieldName]: "This field is required.",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: {
          ...prevErrors.location,
          [fieldName]: "",
        },
      }));
    }
  };

  const handleSubmit = async (event: any) => {
    // let isFormFieldValid = false;
    event.preventDefault();

    // Perform onBlur validation for all fields
    onBlurtenantDetails("tenantName")();
    onBlurtenantDetails("email")();
    onBlurUserDetails("name")();
    onBlurUserDetails("email")();
    onBlurUserDetails("contact")();
    onBlurLocation("address")();
    onBlurLocation("country")();
    onBlurLocation("city")();
    onBlurLocation("state")();
    onBlurLocation("postalCode")();

    // If there are any validation errors, prevent form submission
    // if (
    //   errors.tenantDetails.tenantName ||
    //   errors.tenantDetails.email ||
    //   errors.userDetails.name ||
    //   errors.userDetails.email ||
    //   errors.userDetails.contact ||
    //   errors.location.address ||
    //   errors.location.country ||
    //   errors.location.city ||
    //   errors.location.state ||
    //   errors.location.postalCode
    // ) {
    //   // return;
    //   isFormFieldValid = false;
    // } else {
    //   isFormFieldValid = true;
    // }
    // if (!checked) {
    //   setCheckboxError("You must agree to the terms and conditions.");
    //   // return; // Prevent form submission if checkbox is not checked
    // } else {
    //   setCheckboxError(""); // Clear the checkbox error if it's checked
    // }
    // if (!isFormFieldValid || !checked) return;
    // setReview(false)
    try {
      // Frame the formData object based on the form field values
      console.log(`fileSrc :: onboard ::`, fileSrc);
      // return;
      const res = await ScanAppService.onBoarding({
        name: tenantDetails.tenantName,
        email: tenantDetails.email,
        "url":fileSrc,
        // "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFAKyG_UrnbS-IDsnFOV92Kp7LRQCVxyC4BaPY-TwXChIuRvy31ByTmTcUySLf7Z2ZkHk&usqp=CAU",
        primary_color: themeDetails.primaryColor,
        secondary_color:themeDetails.secondaryColor
    })
    console.log("res", res)
    if(res.data.data.statusCode == 200) {
      setIsNotOnboarded(false);
      setResponse({message:res.data.data.message, statusCode:res.data.data.statusCode})
    }
    
    } catch (error) {
      console.error("Error posting or updating data:", error);
      // Handle errors while posting or updating data
    }
  };
  const [fileSrc, setFileSrc] = useState("./assets/img/logo.jpg");

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
  return (
    <div className="register-form p-5 needs-validation" id="register-form">      
      {response.statusCode==200 &&  
          <Alert onClose={() => {}}>
          On Boarderd {`${response.message}`}fully
        </Alert>
        } 
        
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Tenant Details</legend>
        <div className="control-group">
          <div className="row g-3">
            <div className="col-md-6">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Tenant Name"
                  multiline
                  variant="outlined"
                  value={tenantDetails.tenantName}
                  onChange={(e) => {
                    const id = e.target.value
                      .replace(/^\s+/, "")
                      .replace(/\s{2,}/g, " ")
                      .replace(/[^a-zA-Z0-9 ]/g, "");
                    // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                    setTenantDetails({ ...tenantDetails, tenantName: id });
                  }}
                  size="small"
                  onBlur={onBlurtenantDetails("tenantName")}
                  error={!!errors.tenantDetails.tenantName}
                  helperText={errors.tenantDetails.tenantName}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Email"
                  multiline
                  variant="outlined"
                  value={tenantDetails.email}
                  onChange={(e) => {
                    const emailValue = e.target.value
                      .replace(/[^a-zA-Z0-9@.]/g, "")
                      .replace(/\.com.*$/, ".com");
                      setTenantDetails({ ...tenantDetails, email: emailValue });
                  }}
                  // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  size="small"
                  onBlur={onBlurtenantDetails("email")}
                  error={!!errors.tenantDetails.email}
                  helperText={errors.tenantDetails.email}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>
            </div>
            <div className="col-md-6" style={{display:"flex", justifyContent:"center"}}>
              {/* <FormControl sx={{ m: 1 }}>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="custom-file-input"
              />
               <label htmlFor="avatar"> <FileUploadIcon/>Choose Logo</label>
              </FormControl>
              <FormControl sx={{ m: 1, width: "100%" }}>

              {fileSrc && (
                <img
                  src={fileSrc}
                  alt="Selected file"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
              </FormControl> */}
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
                  <div className="avatar-preview">
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
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Theme Details</legend>
        <div className="control-group">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex" style={{ marginLeft: "10px" }}>
                <input type="color" id="head" name="head" value={themeDetails.primaryColor} onChange={(e)=>{
                  setThemeDetails({ ...themeDetails, primaryColor: e.target.value });
                } }/>
                <p className="primarycolor">Primary Color</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex" style={{ marginLeft: "10px" }}>
                <input type="color" id="head" name="head" value={themeDetails.secondaryColor}  onChange = {(e)=>{ 
                  setThemeDetails({ ...themeDetails, secondaryColor: e.target.value });

                }}/>
                <p className="secondarycolor">Secondary Color</p>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Communication Details</legend>
        <div className="control-group">
          <div className="row g-3">
            
            {/* <div className="col-md-4">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Secondary color"
                  multiline
                  variant="outlined"
                  value={userDetails.email}
                  onChange={(e) => {
                    const emailValue = e.target.value
                      .replace(/[^a-zA-Z0-9@.]/g, "")
                      .replace(/\.com.*$/, ".com");
                    setUserDetails({ ...userDetails, email: emailValue });
                  }}
                  // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  size="small"
                  onBlur={onBlurUserDetails("email")}
                  error={!!errors.userDetails.email}
                  helperText={errors.userDetails.email}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>
            </div> */}
            <div className="col-md-4">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Contact"
                  multiline
                  variant="outlined"
                  value={userDetails.contact}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  }}
                  // onChange={(e) => setUserDetails({ ...userDetails, contact: e.target.value })}
                  onChange={(e) => {
                    const contactValue = e.target.value.replace(
                      /^0+|[^0-9]/g,
                      ""
                    );

                    // const contactValue = e.target.value.replace(/^[0]+([0-9]*)$/, "$1");
                    // const contactValue = e.target.value.replace(/[^0-9]/g, "");
                    setUserDetails({ ...userDetails, contact: contactValue });
                  }}
                  size="small"
                  onBlur={onBlurUserDetails("contact")}
                  error={!!errors.userDetails.contact}
                  helperText={errors.userDetails.contact}
                  inputProps={{ maxLength: 10 }}
                />
              </FormControl>
            </div>
            <div className="col-md-4">
              <FormControlLabel
                sx={{ m: 1, width: "100%" }}
                control={<Switch defaultChecked />}
                label="Is WhatsApp Enabled"
              />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Location</legend>
        <div className="control-group">
          <div className="row g-3">
            <div className="col-md-6">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Address"
                  multiline
                  variant="outlined"
                  value={location.address}
                  // onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  onChange={(e) => {
                    const addressValue = e.target.value
                      .replace(/^\s+/, "")
                      .replace(/\s{2,}/g, " ")
                      .replace(/[^a-zA-Z0-9 /,-]/g, "");
                    setLocation({ ...location, address: addressValue });
                  }}
                  size="small"
                  onBlur={onBlurLocation("address")}
                  error={!!errors.location.address}
                  helperText={errors.location.address}
                  inputProps={{ maxLength: 100 }}
                />
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="City"
                  multiline
                  variant="outlined"
                  value={location.city}
                  onChange={(e) => {
                    const cityValue = e.target.value.replace(/[^a-zA-Z ]/g, "");
                    setLocation({ ...location, city: cityValue });
                  }}
                  size="small"
                  onBlur={onBlurLocation("city")}
                  error={!!errors.location.city}
                  helperText={errors.location.city}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>
            </div>
            <div className="col-md-4">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="State"
                  multiline
                  variant="outlined"
                  value={location.state}
                  onChange={(e) => {
                    const stateValue = e.target.value
                      .replace(/^\s+/, "")
                      .replace(/\s{2,}/g, " ")
                      .replace(/[^a-zA-Z ]/g, "");
                    setLocation({ ...location, state: stateValue });
                  }}
                  size="small"
                  onBlur={onBlurLocation("state")}
                  error={!!errors.location.state}
                  helperText={errors.location.state}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>
            </div>
            <div className="col-md-4">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Country"
                  multiline
                  variant="outlined"
                  value={location.country}
                  onChange={(e) => {
                    const countryValue = e.target.value
                      .replace(/^\s+/, "")
                      .replace(/\s{2,}/g, " ")
                      .replace(/[^a-zA-Z ]/g, "");
                    setLocation({ ...location, country: countryValue });
                  }}
                  size="small"
                  onBlur={onBlurLocation("country")}
                  error={!!errors.location.country}
                  helperText={errors.location.country}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>
            </div>
            <div className="col-md-4">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Postal Code"
                  multiline
                  variant="outlined"
                  value={location.postalCode}
                  onChange={(e) => {
                    const postalValue = e.target.value.replace(/[^0-9]/g, "");
                    setLocation({ ...location, postalCode: postalValue });
                  }}
                  size="small"
                  onBlur={onBlurLocation("postalCode")}
                  error={!!errors.location.postalCode}
                  helperText={errors.location.postalCode}
                  inputProps={{ maxLength: 6 }}
                />
              </FormControl>
            </div>
          </div>
        </div>
      </fieldset>
      <div className="row">
        <div className="col-md-12">
          <div className="checkboxInput">
            <input
              type="checkbox"
              name="tos"
              id="tos"
              value="terms"
              checked={checked}
              onChange={handleCheckboxChange}
            />
            <p>
              I agree to the{" "}
              <a href="https://www.cloud4c.com/terms">terms and conditions</a>{" "}
              mentioned in the <a href="https://www.cloud4c.com/aup">AUP</a>,{" "}
              <a href="https://www.cloud4c.com/msa">MSA</a>,{" "}
              <a href="https://www.cloud4c.com/sla">SLA</a>.
            </p>
          </div>
          {checkboxError && (
            <span style={{ color: "#d32f2f", marginLeft: "25px" }}>
              {checkboxError}
            </span>
          )}
        </div>
      </div>
      <div className="col-12">
      <FormControl sx={{ m: 1 ,float:"right" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            <span>Proceed</span>
          </button>
        </FormControl>
      </div>
    </div>
  );
};
