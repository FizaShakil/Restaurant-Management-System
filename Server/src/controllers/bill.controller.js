import connection from '../db/connection.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { v1 as uuid } from "uuid";
import { fileURLToPath } from "url";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportTemplatePath = path.join(serverRoot, "src", "utils", "report.ejs");
const pdfDir = path.join(serverRoot, "public", "temp");


//generate report
const generateReport = asyncHandler(async (req, res) => {
  const generateUuid = uuid();
  const orderDetails = req.body;
  if (!orderDetails?.name || !orderDetails.email || !orderDetails.contactNum ||
      !orderDetails.paymentMethod || !req.user?.email) {
    throw new ApiError(400, "All customer and payment fields are required");
  }

  let productDetailsReport;
  try {
    productDetailsReport = typeof orderDetails.productDetails === "string"
      ? JSON.parse(orderDetails.productDetails)
      : orderDetails.productDetails;
  } catch {
    throw new ApiError(400, "Product details must be valid JSON");
  }

  if (!Array.isArray(productDetailsReport) || productDetailsReport.length === 0) {
    throw new ApiError(400, "Add at least one product to generate a bill");
  }

  const productDetailsJson = JSON.stringify(productDetailsReport);

  await connection.execute(
    "INSERT INTO bill (name, uuid, email, contactNum, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      orderDetails.name,
      generateUuid,
      orderDetails.email,
      orderDetails.contactNum,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      productDetailsJson,
      req.user.email,
    ]
  );

  const html = await ejs.renderFile(reportTemplatePath, {
    productDetails: productDetailsReport,
    name: orderDetails.name,
    email: orderDetails.email,
    contactNum: orderDetails.contactNum,
    paymentMethod: orderDetails.paymentMethod,
    totalAmount: orderDetails.totalAmount,
  });

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    fs.mkdirSync(pdfDir, { recursive: true });

    const pdfPath = path.join(pdfDir, `${generateUuid}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4" });
  } finally {
    await browser.close();
  }

  return res.status(200).json(
    new ApiResponse(200, generateUuid, "Pdf Generated successfully!")
  );
});

//get pdf
const getPdf = asyncHandler(async (req, res) => {
  const { uuid: billUuid } = req.query;
  if (typeof billUuid !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(billUuid)) {
    throw new ApiError(400, "A valid bill UUID is required");
  }

  const pdfPath = path.join(pdfDir, `${billUuid}.pdf`);
  if (!fs.existsSync(pdfPath)) {
    throw new ApiError(404, "Bill PDF not found");
  }

  return res.type("application/pdf").sendFile(pdfPath);
});

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
      const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new ApiError(400, "Invalid bill ID");
  }
  
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