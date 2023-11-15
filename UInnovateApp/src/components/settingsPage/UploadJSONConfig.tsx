import React, { useState } from "react";
import axios from "axios";

function Upload() {
	const [jsonData, setJsonData] = useState(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;
		if (file && file.type === "application/json") {
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				if (e.target && e.target.result) {
					try {
						const json = JSON.parse(e.target.result.toString());
						setJsonData(json);
						console.log("File loaded and parsed:", json);
					} catch (error) {
						console.error("Error parsing JSON:", error);
					}
				}
			};
			reader.readAsText(file);
		} else {
			console.error("Please upload a JSON file.");
		}
	};

	const handleSubmit = async () => {
		if (jsonData) {
			try {
				const updateEndpoint = "http://localhost:3000/update-database";
				const response = await axios.post(updateEndpoint, jsonData, {
					headers: {
						Prefer: "return=representation",
						"Content-Type": "application/json",
						"Content-Profile": "meta",
					},
				});
				console.log("Database updated successfully:", response.data);
			} catch (error) {
				console.error("Error updating database:", error);
			}
		} else {
			console.error("No JSON data to submit");
		}
	};

	return (
		<div>
			<h3>Upload JSON File</h3>
			<input
				type='file'
				accept='application/json'
				onChange={handleFileChange}
			/>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
}

export default Upload;
