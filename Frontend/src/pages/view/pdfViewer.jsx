import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

function PdfContainer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div key={i}>
          <Page pageNumber={i} />
        </div>
      );
    }
    return pages;
  };

  return (
    <div style={{height: '100%', overflow: 'auto', border: '1px dotted'}}>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess} loading={null} onWaiting="">
        {renderPages()}
      </Document>
    </div>
  );
}

export default PdfContainer;