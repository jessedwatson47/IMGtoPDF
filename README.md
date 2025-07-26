# IMGtoPDF

Convert one or more images into a single PDF.
---

## Problems to Solve

- I always need my university math work compiled into one PDF for submission.  
- I’m wary of security risks using third‑party conversion tools.

---

## Tools Involved

- **Node.js**  
- **Express.js**  
- **HTML, CSS, JavaScript**  
- **Multer** (parses incoming byte streams; uses `memoryStorage`)  
- **pdf-lib** (to generate and manipulate PDF files)  

---

## Learning Process

1. Researched image‑to‑PDF JavaScript libraries via ChatGPT  
2. Read the [pdf-lib documentation](https://pdf-lib.js.org/) and studied code snippets  

---

## Software Pipeline

1. **Serve an upload form** (PNG, JPG) via HTTP  
2. **User uploads** one or more image files  
3. **Multer** parses incoming byte streams and stores them in RAM  
4. **pdf-lib** creates a new PDF document  
5. For each incoming file:  
   - Detect file type in Node.js  
   - Embed the image into the PDF  
6. **Add a new page** per image at A4 size  
7. **Serialize** the PDF back to bytes  
8. **Send** the PDF as a `200 OK` response with appropriate headers so the browser prompts a “Save As…” dialog

---

## Future Possible Improvements
- Rate limiting
- Better error handling (for client)
- Experiment with server storage (diskStorage)
- Validation for file size, type and number of files
- Drag'n'Drop files for upload

