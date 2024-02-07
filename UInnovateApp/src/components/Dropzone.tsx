import React from "react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import "../styles/Dropzone.css";
import vmd from "../virtualmodel/VMD";

function Dropzone({ onItemAdded, items, currentColumn, onItemRemoved }) {
  const [highlight, setHighlight] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [itemsList, setItemsList] = useState(items);

  const fileInputRef = React.createRef();
  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const onItemAddedDefault = (evt) => {
    const name = evt.target.files[0].name;
    const extension = evt.target.files[0].type.replace(/(.*)\//g, "");
    const reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    reader.onload = (e) => {
      const buffer =
        extension == "pdf"
          ? reader.result
              ?.toString()
              .replace("data:application/pdf;base64,", "")
          : extension == "jpg"
          ? reader.result?.toString().replace("data:image/jpg;base64,", "")
          : extension == "jpeg"
          ? reader.result?.toString().replace("data:image/jpeg;base64,", "")
          : extension == "png"
          ? reader.result?.toString().replace("data:image/png;base64,", "")
          : extension == "csv"
          ? reader.result?.toString().replace("data:text/csv;base64,", "")
          : null;

      if (onItemAdded) {
        onItemAdded(evt, buffer, extension, name, currentColumn);
      }
    };
  };

  function convertToByteArray(input) {
    input = atob(input);
    const binaryLen = input.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = input.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  const fetchAndDownloadFile = (e, item) => {
    e.preventDefault();
    vmd
      .getRowDataAccessor("filemanager", "filestorage", "id", item.id)
      .fetchRows()
      .then((response) => {
        const bytes = convertToByteArray(response[0].blob);
        const blob = new Blob([bytes], {
          type: "application/" + item.extension,
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", item.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.log(error);
      });
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
      onItemAdded(event, array);
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
    <div>
      <div className="flex-row">
        {itemsList?.length > 0
          ? itemsList.map((item, index) => {
              return (
                <div className="display-flex" key={index}>
                  <div className="display-flex-row align-end">
                    <button
                      className="delete-button margin-lr"
                      onClick={(e) => onItemRemoved(e, item, currentColumn)}
                      type="button"
                    >
                      {" "}
                      <CloseIcon color="error"></CloseIcon>
                    </button>
                    <a href="" download={item.filename}>
                      <button
                        className="download-button margin-lr"
                        type="button"
                        onClick={(e) => fetchAndDownloadFile(e, item)}
                      >
                        {" "}
                        <DownloadIcon></DownloadIcon>
                      </button>
                    </a>
                  </div>
                  <div className="display-inline-block" key={index}>
                    <img
                      alt="Item"
                      id="image-stop"
                      src={
                        item.extension == "pdf"
                          ? "pdf-icon.png"
                          : item.extension == "jpg" ||
                            item.extension == "jpeg" ||
                            item.extension == "png"
                          ? "image-icon.png"
                          : item.extension == "csv"
                          ? "csv-icon.png"
                          : null
                      }
                      className="image-size"
                    />
                    <figcaption className="text-align truncate">
                      {item.filename}
                    </figcaption>
                  </div>
                </div>
              );
            })
          : null}
        <div
          className={`display-inline-block Dropzone ${
            highlight ? "bg-[#673ab7]/20" : ""
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={openFileDialog}
          style={{ cursor: "pointer" }}
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
      </div>
    </div>
  );
}

export default Dropzone;
