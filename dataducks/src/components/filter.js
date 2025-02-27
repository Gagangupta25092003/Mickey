import React, { useEffect, useState } from "react";
import downicon from "../resources/Images/arrow_down.png";

const FilterComponent = (props) => {
  const [showFilters, setShowFilters] = useState(false);
  const [size, setSize] = useState([]);
  const [data_type, setType] = useState([]);
  const [minsize, setminsize] = useState(0);
  const [maxsize, setmaxsize] = useState(0);
  const [selectedValues, setSelectedValues] = useState([]);

  const handleCheckboxChange = (value) => {
    const isElementPresent = selectedValues.includes(value.value);

    if (isElementPresent) {
      // Remove the element if it is present
      const updatedArray = selectedValues.filter(item => item !== value.value);
      setSelectedValues(updatedArray);
    } else {
      // Add the element if it is not present
      setSelectedValues(prevArray => [...selectedValues, value.value]);
    }
  };

  const Apply = (e) => {
    e.preventDefault();
    console.log("Applying Filter")
    setTimeout(() => {
      const requestBody = {
        min_size: minsize,
        max_size: maxsize,
        file_types: selectedValues,
      };
      console.log(requestBody);
      return fetch(`http://localhost:5000/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the data
          console.log(data);
          const jsonResponse = JSON.parse(JSON.stringify(data));

          // Access the data of a specific key
          const keyData = jsonResponse.key;
          console.log("Output....");
          props.ChangeData(data);
          console.log("keyData", keyData);
        })
        .catch((error) => {
          console.log(error);
          console.log("Error in Response");
        });
    }, 1000);
  };

  const handleButtonClick = () => {
    setShowFilters(!showFilters);
  };
  useEffect(() => {
    const fetchDataSize = async () => {
      try {
        console.log("Starting to get Data");
        const response = await fetch("http://localhost:5000/getsize_info");
        console.log("response", response);
        const result = await response.json();
        setSize(result);
        console.log(result);
      } catch (error) {
        console.log("Error in fetching DataType: ", error);
      }
    };

    const fetchDataType = async () => {
      try {
        console.log("Starting to get Data");
        const response = await fetch("http://localhost:5000/gettype_info");
        console.log("response type", response);
        const result = await response.json();
        setType(result);
        console.log(result);
      } catch (error) {
        console.log("Error in fetching DataType: ", error);
      }
    };
    fetchDataType();
    fetchDataSize();
  }, []);

  return (
    <div>
      <div
        className="bg-gray-100 hover:bg-gray-200 text-blue-900 px-4 flex mx-auto border-b border-blue-900"
        onClick={handleButtonClick}>
        <img src={downicon} className="w-6 h-6 my-auto" />
        &nbsp;&nbsp;
        <h1 className="text-xl font-medium  mb-2"> Filters</h1>
      </div>
      {showFilters && (
        <div className=" p-4 text-blue-900 bg-gray-100 px-12">
          {/* Size Filter */}
          <div className="mb-4 ">
            <h3 className="text-lg font-medium ">Size</h3>
            <div className="flex flex-wrap gap-2">
              <label>
                <input
                  type="number"
                  className="mr-2 w-16 border-b border-blue-900"
                  placeholder=" in mb"
                  value={minsize}
                  onChange={(e)=>setminsize(e.target.value)}
                />
                Min. : {size.min}
              </label>
              <label>
                <input
                  type="number"
                  className="mr-2 w-16 border-b border-blue-900"
                  placeholder=" in mb"
                  value={maxsize}
                  onChange={(e)=>setmaxsize(e.target.value)}
                />
                Max. : {size.max}
              </label>
            </div>
          </div>

          {/* File Type Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">File Type</h3>
            <div className="">
              <ul className="flex flex-wrap">
                {data_type.map((value, index) => (
                  <div key={index} className="mx-2">
                    <label>
                      <input
                        type="checkbox"
                        className="mr-2 bg-black"
                        // checked={selectedValues.includes({value})}
                        onChange={() => handleCheckboxChange({value})}
                      />
                      {value}
                      {console.log(index)}
                    </label>
                  </div>
                ))}
              </ul>
            </div>
            <button className="bg-blue-800 w-24 text-lg text-white rounded-full hover:bg-blue-900 mt-4" onClick={Apply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
