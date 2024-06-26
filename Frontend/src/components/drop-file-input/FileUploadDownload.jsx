import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export function getContentTypeFromExtension(extension) {
  const mimeTypes = {
    txt: 'text/plain',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    tar: 'application/x-tar',
    // Add more mappings for other file types as needed
  };

  return mimeTypes[extension] || 'application/octet-stream'; // Default to generic binary if extension not found
}

export const getFileSize = async (fileName, path, token) => {

  // console.log('getfilesize is called with', fileName);
  let response;
  try {
    const url = backendUrl + '/download';
    // console.log('url is', url);
    response = await axios.post(url, null, {
      headers: {
        Range: `bytes=0-0`,
        'X-File-name': encodeURIComponent(fileName),
        'X-File-path': encodeURIComponent(path),
        'x-authorization': `Bearer ${token}`,
        'Content-Type': getContentTypeFromExtension(fileName.split('.').pop()),
      },
    });
    // console.log(response);
    return response.data.fileSize;
  } catch (error) {}
};
// filename must be with its extension
// export const download = async (fileName,path,view) => {
//     let chunks = [];
//     const token = localStorage.getItem('accessToken')
//     // console.log('token' +token);
//     let start = 0;
//     let chunkSize = 100 * 1024 * 1024;
//     let end = chunkSize - 1;
//     const fileExtension = fileName.split('.')[1];
//     let fileSize = await getFileSize(fileName,path,token);
//     if (fileSize === undefined) {
//         console.log('file does not exist');
//         alert('file does not exist, please check file name');
//         return;
//     }
//     end = Math.min(end, fileSize - 1);
//     // console.log('file size is', fileSize);
//     // console.log('file size', fileSize);

//     try {
//         while (start < fileSize) {
//             // console.log('url--', backendUrl);
//             const url = backendUrl + '/download';
//             // console.log('start is', start);
//             // console.log('end is', end);
//             // console.log({
//             //     Range: `bytes=${start}-${end}`,
//             //     'x-file-name': encodeURIComponent(fileName),
//             //     'x-file-path': path,
//             //     'content-type': getContentTypeFromExtension(fileExtension),
//             //     'access-control-expose-headers': 'Content-Range'
//             // });
//             const config = {
//                 headers: {
//                     Range: `bytes=${start}-${end}`,
//                     'x-file-name': encodeURIComponent(fileName),
//                     'x-file-path': encodeURIComponent(path),
//                     'content-type': getContentTypeFromExtension(fileExtension),
//                     'x-authorization' : `Bearer ${token}`,
//                     'access-control-expose-headers': 'Content-Range'
//                 },
//                 responseType: 'arraybuffer'
//             };
//             // console.log(config)
//             const response = await axios.post(url, null, config);
//             // const uint8Array = new Uint8Array(response.data);
//             // console.log(uint8Array + "res");

//             // Push the chunk to the array
//             let check = new Blob([response.data]);
//             let check_url = URL.createObjectURL(check);
//             // console.log(check_url + " check url");
//             // chunks.push(new Blob([response.data]));

//             // Update the byte range for the next chunk
//             start = end + 1;
//             end = Math.min(start + chunkSize - 1, fileSize - 1);
//             // console.log('chunks', chunks);
//         }

//         // Create a single Blob from the chunks
//         const combinedBlob = new Blob(chunks, { type: getContentTypeFromExtension(fileExtension) });
//         // console.log(JSON.stringify(combinedBlob) + "combined blob");
//         if(view)
//         {
//             return combinedBlob;
//         }

//         // Create a URL for the Blob
//         const blobUrl = URL.createObjectURL(combinedBlob, { type: getContentTypeFromExtension(fileExtension) });
//         // console.log(blobUrl + "blob url")

//         // Create a new anchor element
//         const anchor = document.createElement('a');
//         anchor.href = blobUrl;
//         anchor.download = `${fileName}`;

//         // Attach the anchor element to the DOM temporarily
//         document.body.appendChild(anchor);

//         // Programmatically trigger a click event on the anchor element
//         anchor.click();

//         // Clean up: revoke the URL and remove the dynamically created anchor element
//         URL.revokeObjectURL(blobUrl);

//         document.body.removeChild(anchor);

//         chunks = [];
//         start = 0;
//     } catch (error) {
//         alert(`download failed for text.txt`);
//         console.error('Error downloading file:', error);
//     }
// };
export const download = async (fileName, path, view) => {
  let chunks = [];
  const token = localStorage.getItem('accessToken');
  let start = 0;
  let chunkSize = 100 * 1024 * 1024;
  let end = chunkSize - 1;
  const fileExtension = fileName.split('.').pop();
  let fileSize = await getFileSize(fileName, path, token);

  if (fileSize === undefined) {
    console.log('File does not exist');
    // alert("File does not exist, please check file name");
    return null; // Return null if the file doesn't exist
  }

  end = Math.min(end, fileSize - 1);

  try {
    while (start < fileSize) {
      const url = backendUrl + '/download';
      const config = {
        headers: {
          Range: `bytes=${start}-${end}`,
          'x-file-name': encodeURIComponent(fileName),
          'x-file-path': encodeURIComponent(path),
          'content-type': getContentTypeFromExtension(fileExtension),
          'x-authorization': `Bearer ${token}`,
          'access-control-expose-headers': 'Content-Range',
        },
        responseType: 'arraybuffer',
      };

      const response = await axios.post(url, null, config);

      // Push the chunk to the array
      let check = new Blob([response.data]);
      chunks.push(new Blob([response.data]));

      // Update the byte range for the next chunk
      start = end + 1;
      end = Math.min(start + chunkSize - 1, fileSize - 1);
    }

    // Create a single Blob from the chunks
    const combinedBlob = new Blob(chunks, {
      type: getContentTypeFromExtension(fileExtension),
    });

    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(combinedBlob, {
      type: getContentTypeFromExtension(fileExtension),
    });

    if (view) {
      // Return the document data and file type
      return {
        data: blobUrl,
        fileType: fileExtension,
      };
    }

    // Create a new anchor element
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = `${fileName}`;

    // Attach the anchor element to the DOM temporarily
    document.body.appendChild(anchor);

    // Programmatically trigger a click event on the anchor element
    anchor.click();

    // Clean up: revoke the URL and remove the dynamically created anchor element
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(anchor);

    chunks = [];
    start = 0;
  } catch (error) {
    alert(`Download failed for ${fileName}`);
    console.error('Error downloading file:', error);
  }
};

export async function uploadFileWithChunks(
  file,
  path,
  customName,
  isInvolvedInProcess,
) {
  // console.log('file chunks', path)
  try {
    // console.log('hello bro');
    const chunkSize = 500 * 1024 * 1024; // 500MB chunk size
    const totalChunks = Math.ceil(file.size / chunkSize);
    // console.log('totalChunks', totalChunks);
    for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
      const start = chunkNumber * chunkSize;
      const end = Math.min(start + chunkSize - 1, file.size - 1);
      // console.log('end', end);
      // console.log(typeof file);
      // console.log('file name is', file.name);
      const contentType = getContentTypeFromExtension(
        file.name.split('.').pop(),
      );
      console.log('content type', contentType);

      const headers = {
        'X-File-Name':
          customName !== undefined
            ? encodeURIComponent(customName)
            : encodeURIComponent(file.name),
        'X-Total-Chunks': totalChunks,
        'X-Current-Chunk': chunkNumber,
        'X-Chunk-Size': chunkSize,
        'Content-Type': contentType,
        'X-file-path': path,
        'X-Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        Range: `bytes=${start}-${end}`,
      };

      if (chunkNumber === 0) {
        headers['x-involved-in-process'] = isInvolvedInProcess;
      }

      const chunk = file.slice(start, end + 1);

      const url = backendUrl + '/upload';
      // console.log('url is', url);
      const response = await fetch(url, {
        method: 'POST',
        body: chunk,
        headers: headers,
      });
      // console.log('reseponse', response);

      if (response.ok) {
        const data = await response.json();
        return data;
        // console.log(`Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully`);
      } else {
        console.error(`Chunk ${chunkNumber + 1}/${totalChunks} upload failed`);
      }
    }
  } catch (error) {
    console.log(error.message);
    return error;
  }
}

export async function upload(
  fileList,
  path,
  getData,
  customName,
  isInvolvedInProcess,
) {
  console.log('path in upload', path);
  console.log('function we need is called');
  console.log('filelist length is', fileList);
  if (fileList.length === 0) {
    return;
  }
  try {
    let documentIds = [];
    for (let i = 0; i < fileList.length; i++) {
      console.log('in loop');
      const file = fileList[i];
      let res =
        customName !== undefined
          ? await uploadFileWithChunks(
              file,
              path,
              customName,
              isInvolvedInProcess,
            )
          : await uploadFileWithChunks(
              file,
              path,
              undefined,
              isInvolvedInProcess,
            );
      documentIds.push(res.documentId);
      // console.log(path)
      getData();
      return documentIds;
    }
    console.log('document ids', documentIds);
  } catch (error) {
    throw error;
  }
}
