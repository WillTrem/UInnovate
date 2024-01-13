import React, { useEffect } from "react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Dropzone.css";

function Dropzone({
  onItemAdded,
  items,
  itemsImage,
  itemsName,
  currentColumn,
}) {
  const [highlight, setHighlight] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [itemImage, setItemImage] = useState(itemsImage);
  const [itemName, setItemName] = useState(itemsName);
  const [item, setItem] = useState(items);
  const fileInputRef = React.createRef();
  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const onItemAddedDefault = (evt) => {
    const name = evt.target.files[0].name;
    const extension = evt.target.files[0].type.replace(/(.*)\//g, "");
    setItemName(name);
    setItemImage("pdf-icon.png");
    setItem(evt.target.files[0]);
    if (onItemAdded) {
      onItemAdded(
        evt.target.files[0],
        URL.createObjectURL(evt.target.files[0]),
        name,
        currentColumn
      );
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
    if (disabled) return;
    setHighlight(true);
  };

  const onDragLeave = (event) => {
    setHighlight(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    if (disabled) return;
    const files = event.dataTransfer.files;
    if (onItemAdded) {
      const array = fileListToArray(files);
      onItemAdded(array);
    }
  };

  const fileListToArray = (list) => {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  };

  return (
    <>
      {!item ? (
        <div
          className={`Dropzone ${highlight ? "bg-[#673ab7]/20" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={openFileDialog}
          style={{ cursor: item ? "default" : "pointer" }}
          hidden={item !== null}
        >
          <>
            <input
              ref={fileInputRef}
              className="FileInput"
              type="file"
              accept=".png, .jpg, .jpeg, .pdf"
              onChange={onItemAddedDefault}
            />
            <img
              alt="Upload"
              className="Icon"
              src="baseline-cloud_upload-24px.svg"
            />
            <span>Upload item</span>
          </>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-end p-0">
            <button
              className="flex p-0 justify-end"
              onClick={() => onItemAdded(null, null, null, currentColumn)}
            >
              {" "}
              <CloseIcon color="error"></CloseIcon>
            </button>
          </div>
          <div className="centerize">
            <img
              alt="Item"
              id="image-stop"
              src={itemImage}
              className="image-size"
            />
            <label htmlFor="image-stop" className="image-size">
              {itemName}
            </label>
          </div>
        </div>
      )}
    </>
  );
}

export default Dropzone;
