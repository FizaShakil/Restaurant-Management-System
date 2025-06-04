import connection from '../db/connection.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { v1 as uuid } from "uuid";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const __dirname = path.resolve(); // root of the project


//generate report
const generateReport = asyncHandler(async (req, res) => {
  const generateUuid = uuid();
  const orderDetails = req.body;
  const productDetailsReport = JSON.parse(orderDetails.productDetails);

   console.log("Request Body:", req.body);
   console.log("User Email:", req.user?.email);

  console.log("Order Details---> ",orderDetails)
  // 1. Save order in the database
  const [insertResult] = await connection.execute(
    "INSERT INTO bill (name, uuid, email, contactNum, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      orderDetails.name,
      generateUuid,
      orderDetails.email,
      orderDetails.contactNum,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      orderDetails.productDetails,
      req.user.email,
    ]
  );

  if(!orderDetails){
    throw new ApiError(400, "All fields are required")
  }

  // 2. Render EJS template to HTML
  const ejsTemplatePath = path.join(__dirname, "src", "utils", "report.ejs");

  const html = await ejs.renderFile(ejsTemplatePath, {
    productDetails: productDetailsReport,
    name: orderDetails.name,
    email: orderDetails.email,
    contactNum: orderDetails.contactNum,
    paymentMethod: orderDetails.paymentMethod,
    totalAmount: orderDetails.totalAmount,
  });

  // 3. Generate PDF using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Output PDF path in /public/temp
  const pdfDir = path.join(__dirname, "public", "temp");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const pdfPath = path.join(pdfDir, `${generateUuid}.pdf`);
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();

  // 4. Send response
  return res.status(200)
  .json(
    new ApiResponse(200, generateUuid, "Pdf Generated successfully! ")
  );
});

//get pdf
const getPdf = asyncHandler(async(req, res)=>{
    const orderDetails = req.query
  const productDetailsReport = orderDetails.productDetails;

    const pdfPath = './public/temp/'+orderDetails.uuid+'.pdf';

    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf")
        fs.createReadStream(pdfPath).pipe(res)
    }
  const ejsTemplatePath = path.join(__dirname, "src", "utils", "report.ejs");
  console.log("EJS Path:", ejsTemplatePath);

  // const ejsTemplatePath = path.join(__dirname, "src", "utils", "report.ejs");

  const html = await ejs.renderFile(ejsTemplatePath, {
    productDetails: productDetailsReport,
    name: orderDetails.name,
    email: orderDetails.email,
    contactNum: orderDetails.contactNum,
    paymentMethod: orderDetails.paymentMethod,
    totalAmount: orderDetails.totalAmount,
  });

  // 3. Generate PDF using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Output PDF path in /public/temp
  const pdfDir = path.join(__dirname, "public", "temp");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();

  // 4. Send response
     res.contentType("application/pdf");
     fs.createReadStream(pdfPath).pipe(res);
})

//get bill
const getBills = asyncHandler(async(req,res)=>{
   const [bills] = await connection.execute(
    "SELECT * from bill ORDER BY id DESC"
   )

   if(!bills){
    throw new ApiError(500, "Something went wrong while fetching all bills")
   }

   return res.status(200)
   .json(
    new ApiResponse(200, bills, "Bills fetched Succesfully! ")
   )
})

// Delete bill
const deleteBill = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const deleteBill = await connection.execute(
        "DELETE from bill WHERE id=?",
        [id]
    )
    if(!deleteBill){
        throw new ApiError(400, "ID not Found for deleting bill")
    }
    return res.status(200)
    .json(
        new ApiResponse(200, deleteBill, "Bill deleted successfully")
    )
})

export {generateReport, getPdf, getBills, deleteBill}

// const getPdf = asyncHandler(async (req, res) => {
//   const {
//     name,
//     email,
//     contactNum,
//     paymentMethod,
//     totalAmount,
//     productDetails,
//     uuid,
//   } = req.body;

//   const pdfPath = './public/temp/' + uuid + '.pdf';

//   if (fs.existsSync(pdfPath)) {
//     res.contentType("application/pdf");
//     return fs.createReadStream(pdfPath).pipe(res);
//   }

//   const ejsTemplatePath = path.join(__dirname, "utils", "report.ejs");
//   console.log("EJS Path:", ejsTemplatePath);

//   const html = await ejs.renderFile(ejsTemplatePath, {
//     productDetails: productDetails,
//     name,
//     email,
//     contactNum,
//     paymentMethod,
//     totalAmount,
//   });

//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: "networkidle0" });

//   const pdfDir = path.join(__dirname, "public", "temp");
//   if (!fs.existsSync(pdfDir)) {
//     fs.mkdirSync(pdfDir, { recursive: true });
//   }

//   await page.pdf({ path: pdfPath, format: "A4" });
//   await browser.close();

//   res.contentType("application/pdf");
//   fs.createReadStream(pdfPath).pipe(res);
// });