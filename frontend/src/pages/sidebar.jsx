import React, { useState } from 'react';

function Sidebar() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  return (
    <div className="bg-gray-900 h-screen w-full flex flex-col justify-between px-4">
      {/* Sidebar header */}
      <div className="flex items-center justify-center py-4">
        <h1 className="text-white text-lg font-bold">Saturday</h1>
      </div>
      
      {/* Sidebar buttons */}
      <div className="flex flex-col items-center py-4">
        {/* Sample buttons */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 w-full">Button 1</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 w-full">Button 2</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 w-full">Button 3</button>
      </div>


      <div className="flex flex-col items-center pb-4">
        <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 w-full">
          Upload Files
        </label>
        <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} />
      </div>

      {/* Display selected files */}
      <div className="px-4">
        {selectedFiles.map((file, index) => (
          <div key={index} className="text-white">{file.name}</div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
