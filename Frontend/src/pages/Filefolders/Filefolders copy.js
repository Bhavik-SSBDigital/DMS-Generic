// import React, { useEffect, useState } from "react";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import { Box, Stack } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// const containerStyle = {
//   padding: "10px",
// };

// const folderStyle = {
//   display: "flex",
//   alignItems: "center",
// };

// function FileExplorer() {
//   const [fileSystemData, setFileSystemData] = useState(null);

//   useEffect(() => {
//     // Load the root file system data when the component mounts
//     fetchFileSystemData();
//   }, []);

//   async function fetchFileSystemData(folderId = null) {
//     try {
//       // Simulate a network request to fetch the data for the specified folder or the root if folderId is not provided
//       // Replace this with your actual API call
//       const data = [
//         {
//           id: 1,
//           name: "Root Folder",
//           type: "folder",
//           isOpen: false,
//           children: [
//             {
//               id: 2,
//               name: "Folder 1",
//               type: "folder",
//               isOpen: false,
//               children: [
//                 {
//                   id: 4,
//                   name: "Folder 1-1",
//                   type: "folder",
//                   isOpen: false,
//                   children: [],
//                 },
//                 {
//                   id: 5,
//                   name: "File 1-1",
//                   type: "file",
//                 },
//               ],
//             },
//             {
//               id: 3,
//               name: "File 1",
//               type: "file",
//             },
//           ],
//         },
//       ];

//       // Update the state with only the clicked folder and its immediate children
//       if (folderId) {
//         setFileSystemData((prevData) => {
//           return prevData.map((item) => {
//             if (item.id === folderId) {
//               return {
//                 ...item,
//                 isOpen: !item.isOpen, // Toggle isOpen when clicking on a folder
//                 children: data.children,
//               };
//             }
//             return item;
//           });
//         });
//       } else {
//         // If folderId is not provided, set the root data
//         setFileSystemData(data);
//       }
//     } catch (error) {
//       console.error("Error fetching file system data:", error);
//     }
//   }

//   function handleFolderClick(folderId, e) {
//     // Create a copy of the file system data to avoid mutating the state directly
//     const updatedData = [...fileSystemData];

//     // Find the folder by ID
//     const folder = findFolderById(updatedData, folderId);

//     if (folder && folder.type === "folder") {
//       // Toggle the isOpen property of the folder
//       folder.isOpen = !folder.isOpen;

//       // Update the state with the modified data
//       setFileSystemData(updatedData);
//     }
//     e.stopPropagation();
//   }

//   function findFolderById(data, folderId) {
//     for (let i = 0; i < data.length; i++) {
//       if (data[i].id === folderId) {
//         return data[i];
//       }
//       if (data[i].children) {
//         const folder = findFolderById(data[i].children, folderId);
//         if (folder) {
//           return folder;
//         }
//       }
//     }
//     return null;
//   }
//   const [selection, setSelection] = useState({
//     selectedView: [],
//     selectedDownload: [],
//     selectedUpload: [],
//     foldersWithFullPermission: [],
//   });
//   console.log(selection);
//   const handleViewCheckboxChange = (item) => {
//     if (selection.selectedView.includes(item.id)) {
//       setSelection((prev) => ({
//         ...prev,
//         selectedView: prev.selectedView.filter((id) => id !== item.id),
//       }));
//     } else {
//       setSelection((prev) => ({
//         ...prev,
//         selectedView: [...prev.selectedView, item.id],
//       }));
//     }
//   };

//   const handleDownloadCheckboxChange = (item) => {
//     if (selection.selectedDownload.includes(item.id)) {
//       setSelection((prev) => ({
//         ...prev,
//         selectedDownload: prev.selectedDownload.filter((id) => id !== item.id),
//       }));
//     } else {
//       setSelection((prev) => ({
//         ...prev,
//         selectedDownload: [...prev.selectedDownload, item.id],
//       }));
//     }
//   };

//   const handleUploadCheckboxChange = (item) => {
//     if (selection.selectedUpload.includes(item.id)) {
//       setSelection((prev) => ({
//         ...prev,
//         selectedUpload: prev.selectedUpload.filter((id) => id !== item.id),
//       }));
//     } else {
//       setSelection((prev) => ({
//         ...prev,
//         selectedUpload: [...prev.selectedUpload, item.id],
//       }));
//     }
//   };

//   const handleFullPermissionCheckboxChange = (item) => {
//     if (selection.foldersWithFullPermission.includes(item.id)) {
//       setSelection((prev) => ({
//         ...prev,
//         foldersWithFullPermission: prev.foldersWithFullPermission.filter(
//           (id) => id !== item.id
//         ),
//       }));
//     } else {
//       setSelection((prev) => ({
//         ...prev,
//         foldersWithFullPermission: [...prev.foldersWithFullPermission, item.id],
//       }));
//     }
//   };

//   function renderFileSystem(data, level = 0) {
//     if (!data) {
//       return <div>Loading...</div>;
//     }
//     return (
//       <ul
//         style={{ listStyleType: "none", overflow: "auto" }}
//         // onClick={(e) => handleListClick(e)}
//       >
//         {data.map((item) => (
//           <li key={item.id}>
//             <div style={{ paddingLeft: `${level * 20}px` }}>
//               <span style={folderStyle}>
//                 {item.type === "folder" && (
//                   <>
//                     <span onClick={(e) => handleFolderClick(item.id, e)}>
//                       {item.isOpen ? (
//                         <KeyboardArrowUpIcon />
//                       ) : (
//                         <KeyboardArrowDownIcon />
//                       )}
//                       <FolderOpenIcon fontSize="small" />
//                     </span>
//                   </>
//                 )}
//                 {item.type === "file" ? <InsertDriveFileIcon /> : null}
//                 {item.name}
//                 {item.type === "folder" ? (
//                   <>
//                     <Box display="inline-list-item" padding={2}>
//                       <input type="checkbox" id={`permission-${item.id}`} />
//                       <label htmlFor={`permission-${item.id}`}>
//                         Full Permission
//                       </label>
//                     </Box>
//                     <Stack display="inline-list-item" padding={2} columnGap={2}>
//                       <Box>
//                         <input type="checkbox" id={`view-${item.id}`} onChange={()=>handleViewCheckboxChange(item)}/>
//                         <label htmlFor={`view-${item.id}`}>View</label>
//                       </Box>
//                       <Box>
//                         <input type="checkbox" id={`upload-${item.id}`} onChange={()=>handleUploadCheckboxChange(item)} />
//                         <label htmlFor={`upload-${item.id}`}>Upload</label>
//                       </Box>
//                       <Box>
//                         <input type="checkbox" id={`download-${item.id}`} onChange={()=>handleDownloadCheckboxChange(item)} />
//                         <label htmlFor={`download-${item.id}`}>Download</label>
//                       </Box>
//                     </Stack>
//                   </>
//                 ) : (
//                   <Stack display="inline-list-item" padding={2} columnGap={2}>
//                     <Box>
//                       <input type="checkbox" id={`view-${item.id}`} onChange={()=>handleViewCheckboxChange(item)} />
//                       <label htmlFor={`view-${item.id}`}>View</label>
//                     </Box>
//                     <Box>
//                       <input type="checkbox" id={`download-${item.id}`} onChange={()=>handleDownloadCheckboxChange(item)} />
//                       <label htmlFor={`download-${item.id}`}>Download</label>
//                     </Box>
//                   </Stack>
//                 )}
//               </span>
//               {item.isOpen ? (
//                 item.children.length === 0 ? (
//                   <div style={{ paddingLeft: "20px" }}>No content</div>
//                 ) : (
//                   renderFileSystem(item.children, level + 1)
//                 )
//               ) : null}
//             </div>
//           </li>
//         ))}
//       </ul>
//     );
//   }
//   return <div style={containerStyle}>{renderFileSystem(fileSystemData)}</div>;
// }

// function App() {
//   return (
//     <div className="App">
//       <FileExplorer />
//     </div>
//   );
// }

// export default App;import React, { useEffect, useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Box, Stack,Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
import { useEffect, useState } from "react";

const containerStyle = {
  padding: "10px",
};

const folderStyle = {
  display: "flex",
  alignItems: "center",
};

function FileExplorer(props) {
  const [fileSystemData, setFileSystemData] = useState([]);
  console.log(JSON.stringify(props) + "selections"); 

  useEffect(() => {
    // Load the root file system data when the component mounts
    fetchProjectsData(); // Initially load the projects data
  }, []);

  async function fetchProjectsData() {
    const url = process.env.REACT_APP_BACKEND_URL + "/getProjects";
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data.children) {
        throw new Error("Invalid projects data");
      }

      // Add isOpen: false to each object in the array
      const dataWithIsOpen = response.data.children.map((item) => ({
        ...item,
        isOpen: false,
      }));

      setFileSystemData(dataWithIsOpen);
    } catch (error) {
      console.error("Error fetching projects data:", error);
    }
  }

  async function fetchFileSystemData(folderId, folderPath) {
    const url = process.env.REACT_APP_BACKEND_URL + `/accessFolder`;
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        url,
        {
          path: `${folderPath}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedData = [...fileSystemData];
      const folder = findFolderById(updatedData, folderId);
      if (folder && folder.type === "folder") {
        folder.isOpen = !folder.isOpen;

        if (folder.isOpen && folder.children.length === 0) {
          // Remove the unnecessary "children" key here
          folder.children = response.data.children;
        }
        setFileSystemData(updatedData);
      }
    } catch (error) {
      console.error("Error fetching folder children:", error);
    }
  }

  function handleFolderClick(folderId, e, folderPath) {
    fetchFileSystemData(folderId, folderPath);
    e.stopPropagation();
  }

  function findFolderById(data, folderId) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === folderId) {
        return data[i];
      }
      if (data[i].children) {
        const folder = findFolderById(data[i].children, folderId);
        if (folder) {
          return folder;
        }
      }
    }
    return null;
  }

  

  const handleViewCheckboxChange = (item, name, checked) => {
    props.setSelection((prev) => {
      const fullAccessArray = Array.isArray(prev.fullAccess)
        ? prev.fullAccess
        : [];

      // Check if the ID is not in fullAccess
      if (!fullAccessArray.some((accessItem) => accessItem.id === item.id)) {
        // Add the ID to selectedView based on the checked value
        if (checked) {
          return {
            ...prev,
            selectedView: [...prev.selectedView, item.id],
          };
        } else {
          return {
            ...prev,
            selectedView: prev.selectedView.filter((id) => id !== item.id),
          };
        }
      }

      // Update fullAccess
      const updatedFullAccess = fullAccessArray.map((fullAccessItem) => {
        if (fullAccessItem.id === item.id) {
          return {
            ...fullAccessItem,
            [name]: checked,
          };
        }
        return fullAccessItem;
      });

      return {
        ...prev,
        fullAccess: updatedFullAccess,
      };
    });
  };

  const handleDownloadCheckboxChange = (item, name, checked) => {
    props.setSelection((prev) => {
      const fullAccessArray = Array.isArray(prev.fullAccess)
        ? prev.fullAccess
        : [];

      // Check if the ID is not in fullAccess
      if (!fullAccessArray.some((accessItem) => accessItem.id === item.id)) {
        // Add the ID to selectedDownload based on the checked value
        if (checked) {
          return {
            ...prev,
            selectedDownload: [...prev.selectedDownload, item.id],
          };
        } else {
          return {
            ...prev,
            selectedDownload: prev.selectedDownload.filter(
              (id) => id !== item.id
            ),
          };
        }
      }

      // Update fullAccess
      const updatedFullAccess = fullAccessArray.map((fullAccessItem) => {
        if (fullAccessItem.id === item.id) {
          return {
            ...fullAccessItem,
            [name]: checked,
          };
        }
        return fullAccessItem;
      });

      return {
        ...prev,
        fullAccess: updatedFullAccess,
      };
    });
  };

  const handleUploadCheckboxChange = (item, name, checked) => {
    props.setSelection((prev) => {
      const fullAccessArray = Array.isArray(prev.fullAccess)
        ? prev.fullAccess
        : [];

      // Check if the ID is not in fullAccess
      if (!fullAccessArray.some((accessItem) => accessItem.id === item.id)) {
        // Add the ID to selectedUpload based on the checked value
        if (checked) {
          return {
            ...prev,
            selectedUpload: [...prev.selectedUpload, item.id],
          };
        } else {
          return {
            ...prev,
            selectedUpload: prev.selectedUpload.filter((id) => id !== item.id),
          };
        }
      }

      // Update fullAccess
      const updatedFullAccess = fullAccessArray.map((fullAccessItem) => {
        if (fullAccessItem.id === item.id) {
          return {
            ...fullAccessItem,
            [name]: checked,
          };
        }
        return fullAccessItem;
      });

      return {
        ...prev,
        fullAccess: updatedFullAccess,
      };
    });
  };

  const handleFullPermissionCheckboxChange = (item, isChecked) => {
    props.setSelection((prev) => {
      if (isChecked) {
        return {
          ...prev,
          fullAccess: [
            ...prev.fullAccess,
            { id: item.id, view: false, upload: false, download: false },
          ],
        };
      } else {
        const updatedFullAccess = prev.fullAccess.filter(
          (access) => access.id !== item.id
        );
        return {
          ...prev,
          fullAccess: updatedFullAccess,
        };
      }
    });
  };

  console.log(props.selection);

  function renderFileSystem(
    data,
    level = 0,
    parentFullAccess,
    parentViewSelected
  ) {
    if (!data || data.length === 0) {
      return <div>No content</div>;
    }

    return (
      <ul style={{ listStyleType: "none", overflow: "auto" }}>
        {data.map((item, index) => {
          // Check if the parent folder has Full Permission and View selected
          const isParentFullAccessAndViewSelected =
            parentFullAccess && parentViewSelected;

          // Check if the item is a folder and if it should have View disabled
          const isFolderWithDisabledView =
            isParentFullAccessAndViewSelected && item.type === "folder";

          return (
            <li key={index}>
              <div style={{ paddingLeft: `${level * 20}px` }}>
                <span style={folderStyle}>
                  {item.type === "folder" && (
                    <>
                      <span
                        onClick={(e) =>
                          handleFolderClick(item.id, e, item.path)
                        }
                      >
                        {item.isOpen ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                        <FolderOpenIcon fontSize="small" />
                      </span>
                    </>
                  )}
                  {item.type === "file" ? <InsertDriveFileIcon /> : null}
                  {item.name}
                  {item.type === "folder" ? (
                    <>
                      <Box display="inline-list-item" padding={2}>
                        <input
                          type="checkbox"
                          id={`permission-${item.id}`}
                          onChange={(e) =>
                            handleFullPermissionCheckboxChange(
                              item,
                              e.target.checked
                            )
                          }
                        />
                        <label htmlFor={`permission-${item.id}`}>
                          Full Permission
                        </label>
                      </Box>
                      <Stack
                        display="inline-list-item"
                        padding={2}
                        columnGap={2}
                      >
                        <Box>
                          <input
                            type="checkbox"
                            id={`view-${item.id}`}
                            name="view"
                            checked={
                              props.selection.fullAccess.some((check) => check.id === item.id && check.view) ||
                              props.selection.selectedView.includes(item.id)
                            }                         
                            onChange={(e) =>
                              handleViewCheckboxChange(
                                item,
                                e.target.name,
                                e.target.checked
                              )
                            }
                            disabled={isFolderWithDisabledView}
                          />
                          <label htmlFor={`view-${item.id}`}>View</label>
                        </Box>
                        <Box>
                          <input
                            type="checkbox"
                            id={`upload-${item.id}`}
                            name="upload"
                            checked={
                              props.selection.fullAccess.some((check) => check.id === item.id && check.upload) ||
                              props.selection.selectedUpload.includes(item.id)
                            }
                            onChange={(e) =>
                              handleUploadCheckboxChange(
                                item,
                                e.target.name,
                                e.target.checked
                              )
                            }
                          />
                          <label htmlFor={`upload-${item.id}`}>Upload</label>
                        </Box>
                        <Box>
                          <input
                            type="checkbox"
                            id={`download-${item.id}`}
                            name="download"
                            checked={
                              props.selection.fullAccess.some((check) => check.id === item.id && check.download) ||
                              props.selection.selectedDownload.includes(item.id)
                            }
                            onChange={(e) =>
                              handleDownloadCheckboxChange(
                                item,
                                e.target.name,
                                e.target.checked
                              )
                            }
                          />
                          <label htmlFor={`download-${item.id}`}>
                            Download
                          </label>
                        </Box>
                      </Stack>
                    </>
                  ) : (
                    <Stack display="inline-list-item" padding={2} columnGap={2}>
                      <Box>
                        <input
                          type="checkbox"
                          id={`view-${item.id}`}
                          name="view"
                          onChange={(e) =>
                            handleViewCheckboxChange(
                              item,
                              e.target.name,
                              e.target.checked
                            )
                          }
                          disabled={isFolderWithDisabledView}
                        />
                        <label htmlFor={`view-${item.id}`}>View</label>
                      </Box>
                      <Box>
                        <input
                          type="checkbox"
                          id={`download-${item.id}`}
                          name="download"
                          onChange={(e) =>
                            handleDownloadCheckboxChange(
                              item,
                              e.target.name,
                              e.target.checked
                            )
                          }
                        />
                        <label htmlFor={`download-${item.id}`}>Download</label>
                      </Box>
                    </Stack>
                  )}
                </span>
                {item.isOpen &&
                  item.children.length > 0 &&
                  renderFileSystem(
                    item.children,
                    level + 1,
                    item.type === "folder"
                      ? item.fullAccess &&
                          item.fullAccess.view &&
                          item.fullAccess.upload
                      : false,
                    item.type === "folder"
                      ? item.selectedView && item.selectedUpload
                      : false
                  )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return <div style={containerStyle}>{renderFileSystem(fileSystemData)}</div>;
}

function App(props) {
  return (
    <div className="App">
      <FileExplorer selection={props.selection} setSelection={props.setSelection} />
    </div>
  );
}

export default App;
