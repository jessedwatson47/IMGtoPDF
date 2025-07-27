import express from 'express'
import multer  from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { PageSizes, PDFDocument } from 'pdf-lib';

const app = express();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
            return cb(new Error("Only JPG/PNG files allowed"))
        }
        cb(null, true);
    }
    
 })
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));

app.listen(3000, () => {console.log("Server running on port 3000")})

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get('/page-sizes', (req,res) => {
    const pageSizes = Object.keys(PageSizes);
    res.json(pageSizes);
})

app.post('/upload', upload.any(),  async (req, res) => {
    try {
        const pdfDoc = await PDFDocument.create();
        const options = req.body;
        console.log(req.files);
        console.log(options);
        const pageSize = options.pageSize;
        const imageSize = options.imageSize;
        
        
        for (const file of req.files) {
        const image = file.mimetype === 'image/png' ? await pdfDoc.embedPng(file.buffer) : await pdfDoc.embedJpg(file.buffer);
        const { width: imgWidth, height: imgHeight } = image.scale(1);
        const [pageWidth, pageHeight] = PageSizes[pageSize];
        const widthScale = pageWidth / imgWidth;
        const heightScale = pageHeight / imgHeight;
        const scale = Math.min(widthScale, heightScale, 1);
        
        const { width: scaledWidth, height: scaledHeight } = image.scale(scale);

        const page = pdfDoc.addPage(PageSizes[pageSize]);
        
        const imageSizes = {
            stretch: {x: 0, y: 0, width: PageSizes[pageSize][0], height: PageSizes[pageSize][1]},
            original: null,
            center: {x: (PageSizes[pageSize][0] - imgWidth) / 2, y: (PageSizes[pageSize][1] - imgHeight) / 2, width: imgWidth, height: imgHeight},
            fit: {x: (PageSizes[pageSize][0] - scaledWidth) / 2, y: (PageSizes[pageSize][1] - scaledHeight) / 2, width: scaledWidth, height: scaledHeight}
        };       
        drawImg(page, image, imageSizes[imageSize])
        }
        
    
        const pdfBytes = await pdfDoc.save()
        return res.status(200).set({
            'Content-Type':'application/pdf',
            'Content-Disposition': 'attachment; filename="1.pdf"',}).send(Buffer.from(pdfBytes));
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: err.message })
    }
    
    
});

function drawImg(page, image, option) {
    page.drawImage(image, option);
}