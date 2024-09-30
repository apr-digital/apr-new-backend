// const db = require("../config/dbconfig");
// const query = require("../models/reports.model");
// const { sequelize, EagerLoadingError } = require("sequelize");
// const { QueryTypes } = require("sequelize");

// const json2csv = require("json2csv").parse;
// const fs = require("fs");
// const { log } = require("console");
// //---------------laksh----------
// const csv = require('csv');
// //---------------laksh----------

// const reports = async (req, res) => {
//   try {
//     const { event_id, report_type } = req.params;
//     console.log(event_id);
//     if (report_type == "corporate_sponsors") {
//       const sponsorList = await db.sequelize.query(query.corporateSponsor, {
//         replacements: [event_id],
//         type: QueryTypes.SELECT,
//       });
//       if (sponsorList[0] !== undefined) {

//         //  const jsonData = reg_class;
//         //console.log(reg_class);
//         const jsonData = sponsorList;
//         const csvFields = Object.keys(jsonData[0]);
//         const csvHeader = csvFields.join(',');
//         const csvData = jsonData.map(row => csvFields.map(field => row[field]).join(',')).join('\n');

//         // Set response headers
//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', 'attachment; filename=sponsorlist.csv');

//         // Send CSV data in the response
//         const csvContent = `${csvHeader}\n${csvData}`;

//         res.status(200).send(`${csvHeader}\n${csvData}`);

//         // Send CSV data in the response

//         // res.status(200).json(csvContent);
//       } else {
//         res.status(201).json([]);
//       }
//     } else {
//       if (report_type == "marathon_runners") {
//         const reg_type = "marathon runners";

//         //get the type id for the registrant
//         const reg_type_id = await regTypeId(reg_type);
//         //get paid registrant id from order_info
//         const orderStatus = await db.sequelize.query(query.paidRegId, {
//           replacements: [event_id],
//           type: QueryTypes.SELECT,
//         });
//         //get order status successed booking list
//         const bookingList = await getBookingList(
//           orderStatus,
//           reg_type_id[0].type_id
//         );
//         //from boooking id get registrant info
//         const regList = await getRegList(bookingList);
//         //console.log("line35", regList);

//         //merger booking data and regData
//         const result = await mergeResult(bookingList, regList);

//         //console.log("line40:  ",result);
//         // get registrant class name
//         const reg_class = await regClass(result, reg_type);

//         console.log("line 44", reg_class[0]);

//         if (reg_class[0] !== undefined) {

//           const jsonData = reg_class;

//           jsonData.forEach(item => {
//             if (item.address) {
//               item.address = item.address.replace(/,/g, ' ');
//             }
//           });

//           // Extract all unique column headers from the data
//           const allColumns = Array.from(new Set(jsonData.flatMap(row => Object.keys(row))));
//           console.log("aline 114", allColumns);

//           // Create CSV header
//           const csvHeader = allColumns.join(',');
//           console.log("line 118", csvHeader);
//           //Create CSV data
//           const csvData = jsonData.map(row =>
//             allColumns.map(column => (row[column] !== undefined ? row[column] : '')).join(',')
//           ).join('\n');
//           //console.log("line 123", csvData);
//           // Set response headers
//           res.setHeader('Content-Type', 'text/csv');
//           res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
//           // res.status(200).send(`${csvHeader}\n${csvData}`);
//           res.status(200).send(`${allColumns.join(',')}\n${csvData}`);

//         } else {
//           res.status(201).json([]);
//         }
//       } else {
//         if (report_type == "donor_with_runners") {
//           const reg_type = "donors with runners";
//           //get the type id for the registrant
//           const reg_type_id = await regTypeId(reg_type);
//           //get paid registrant id from order_info
//           const orderStatus = await db.sequelize.query(query.paidRegId, {
//             replacements: [event_id],
//             type: QueryTypes.SELECT,
//           });
//           //get order status successed booking list
//           const bookingList = await getBookingList(
//             orderStatus,
//             reg_type_id[0].type_id
//           );
//           //from boooking id get registrant info
//           const regList = await getRegList(bookingList);
//           //console.log(regList);
//           //merger booking data and regData
//           const result = await mergeResult(bookingList, regList);
//           // get registrant class name
//           const reg_class = await regClass(result, reg_type);

//           if (reg_class[0] !== undefined) {

//             const jsonData = reg_class;

//             jsonData.forEach(item => {
//               if (item.runner_address) {
//                 item.runner_address = item.runner_address.replace(/,/g, ' ');
//               }
//             });

//             // Extract all unique column headers from the data
//             const allColumns = Array.from(new Set(jsonData.flatMap(row => Object.keys(row))));
//             console.log("aline 114", allColumns);

//             // Create CSV header
//             const csvHeader = allColumns.join(',');
//             console.log("line 118", csvHeader);
//             //Create CSV data
//             const csvData = jsonData.map(row =>
//               allColumns.map(column => (row[column] !== undefined ? row[column] : '')).join(',')
//             ).join('\n');
//             //console.log("line 123", csvData);
//             // Set response headers
//             res.setHeader('Content-Type', 'text/csv');
//             res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
//             // res.status(200).send(`${csvHeader}\n${csvData}`);
//             res.status(200).send(`${allColumns.join(',')}\n${csvData}`);

//           } else {
//             res.status(201).json([]);
//           }

//         } else {
//           if (report_type == "donor_without_runner") {
//             const reg_type = "donate";
//             //get the type id for the registrant
//             const reg_type_id = await regTypeId(reg_type);
//             //get paid registrant id from order_info
//             const orderStatus = await db.sequelize.query(query.paidRegId, {
//               replacements: [event_id],
//               type: QueryTypes.SELECT,
//             });
//             //get order status successed booking list
//             const bookingList = await getBookingList(
//               orderStatus,
//               reg_type_id[0].type_id
//             );
//             //from boooking id get registrant info
//             const regList = await getRegList(bookingList);
//             //merger booking data and regData
//             const result = await mergeResult(bookingList, regList);
//             // get registrant class name
//             const reg_class = await regClass(result, reg_type);

//             if (reg_class[0] !== undefined) {

//               const jsonData = reg_class;

//              // const jsonData = runnerCat;

//               jsonData.forEach(item => {
//                 if (item.runner_address) {
//                   item.runner_address = item.runner_address.replace(/,/g, ' ');
//                 }
//               });

//               // Extract all unique column headers from the data
//               const allColumns = Array.from(new Set(jsonData.flatMap(row => Object.keys(row))));
//               console.log("aline 114", allColumns);

//               // Create CSV header
//               const csvHeader = allColumns.join(',');
//               console.log("line 118", csvHeader);
//               //Create CSV data
//               const csvData = jsonData.map(row =>
//                 allColumns.map(column => (row[column] !== undefined ? row[column] : '')).join(',')
//               ).join('\n');
//               //console.log("line 123", csvData);
//               // Set response headers
//               res.setHeader('Content-Type', 'text/csv');
//               res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
//               // res.status(200).send(`${csvHeader}\n${csvData}`);
//               res.status(200).send(`${allColumns.join(',')}\n${csvData}`);

//             } else {
//               res.status(201).json([]);
//             }
//           } else {
//             if (report_type == "runners_list") {
//               const runnerList = await db.sequelize.query(query.getrunners, {
//                 replacements: [event_id],
//                 type: QueryTypes.SELECT,
//               });
//               if (runnerList[0] !== undefined) {
//                 const runnerCat = await addRunCat(runnerList);

//                 const jsonData = runnerCat;

//                 jsonData.forEach(item => {
//                   if (item.runner_address) {
//                     item.runner_address = item.runner_address.replace(/,/g, ' ');
//                   }
//                 });

//                 // Extract all unique column headers from the data
//                 const allColumns = Array.from(new Set(jsonData.flatMap(row => Object.keys(row))));
//                 console.log("aline 114", allColumns);

//                 // Create CSV header
//                 const csvHeader = allColumns.join(',');
//                 console.log("line 118", csvHeader);
//                 //Create CSV data
//                 const csvData = jsonData.map(row =>
//                   allColumns.map(column => (row[column] !== undefined ? row[column] : '')).join(',')
//                 ).join('\n');
//                 //console.log("line 123", csvData);
//                 // Set response headers
//                 res.setHeader('Content-Type', 'text/csv');
//                 res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
//                 // res.status(200).send(`${csvHeader}\n${csvData}`);
//                 res.status(200).send(`${allColumns.join(',')}\n${csvData}`);

//                 // res.status(200).json(runnerCat);
//               } else {
//                 res.status(201).json(runnerList);
//               }

//             } else {
//               if (report_type == "count_summary") {
//                 const runCatName = await db.sequelize.query(query.runCat, {
//                   type: QueryTypes.SELECT,
//                 });
//                 const marathonRunnersCount = await marathonRunnerCount(
//                   event_id,
//                   runCatName
//                 );

//                 const donorRunerCount = await donorWithRunnerCount(
//                   event_id,
//                   runCatName
//                 );
//                 // console.log("..........", donorRunerCount);
//                 const donateCount = await donateRegCount(event_id);
//                 const corporateCount = await corpCount(event_id, runCatName);
//                 //console.log("line102: ", corporateCount);

//                 let jsonData = [
//                   {
//                     marathon_runners_count: {
//                       participants_count:
//                         marathonRunnersCount.totalMarathonCount,
//                       xxxl_tshirt:
//                         marathonRunnersCount.marathonRunnerCount.xxxl_count,
//                       xxl_tshirt:
//                         marathonRunnersCount.marathonRunnerCount.xxl_count,
//                       xl_tshirt:
//                         marathonRunnersCount.marathonRunnerCount.xl_count,
//                       l_tshirt:
//                         marathonRunnersCount.marathonRunnerCount.l_count,
//                       m_tshirt:
//                         marathonRunnersCount.marathonRunnerCount.m_count,
//                       s_tshirt:
//                         marathonRunnersCount.marathonRunnerCount.s_count,
//                       xs_tshirt:
//                         marathonRunnersCount.marathonRunnerCount.xs_count,
//                       total:
//                         marathonRunnersCount.marathonRunnerCount.runner_count,
//                       race_category_count:
//                         marathonRunnersCount.runCategoryCount,
//                       villaAndTowerRunCount: marathonRunnersCount.addressType,
//                     },
//                   },
//                   {
//                     donor_with_runner_count: {
//                       participants_count: donorRunerCount.totalDonorRunnerCount,
//                       xxxl_tshirt: donorRunerCount.donorRunnersCount.xxxl_count,
//                       xxl_tshirt: donorRunerCount.donorRunnersCount.xxl_count,
//                       xl_tshirt: donorRunerCount.donorRunnersCount.xl_count,
//                       l_tshirt: donorRunerCount.donorRunnersCount.l_count,
//                       m_tshirt: donorRunerCount.donorRunnersCount.m_count,
//                       s_tshirt: donorRunerCount.donorRunnersCount.s_count,
//                       xs_tshirt: donorRunerCount.donorRunnersCount.xs_count,
//                       total: donorRunerCount.donorRunnersCount.runner_count,
//                       race_category_count: donorRunerCount.runCategoryCount,
//                       villaAndTowerRunCount: donorRunerCount.addressType,
//                     },
//                   },
//                   {
//                     donate_count: {
//                       participants_count: donateCount.donorRegCount,
//                       xxxl_tshirt: donateCount.donateRunnerCount.xxxl_count,
//                       xxl_tshirt: donateCount.donateRunnerCount.xxl_count,
//                       xl_tshirt: donateCount.donateRunnerCount.xl_count,
//                       l_tshirt: donateCount.donateRunnerCount.l_count,
//                       m_tshirt: donateCount.donateRunnerCount.m_count,
//                       s_tshirt: donateCount.donateRunnerCount.s_count,
//                       xs_tshirt: donateCount.donateRunnerCount.xs_count,
//                       total: donateCount.donateRunnerCount.runner_count,
//                       race_category_count: donateCount.runCategoryCount,
//                       villaAndTowerRunCount: donateCount.addressType,
//                     },
//                   },
//                   {
//                     corporate_sponsor: {
//                       participants_count: corporateCount.n,
//                       xxxl_tshirt: corporateCount.runnerCount.xxxl_count,
//                       xxl_tshirt: corporateCount.runnerCount.xxl_count,
//                       xl_tshirt: corporateCount.runnerCount.xl_count,
//                       l_tshirt: corporateCount.runnerCount.l_count,
//                       m_tshirt: corporateCount.runnerCount.m_count,
//                       s_tshirt: corporateCount.runnerCount.s_count,
//                       xs_tshirt: corporateCount.runnerCount.xs_count,
//                       total: corporateCount.runnerCount.runner_count,
//                       race_category_count: corporateCount.runCategoryCount,
//                       villaAndTowerRunCount: corporateCount.addressType,
//                     },
//                   },
//                 ];

//                 const jsonData1 = jsonData;

//                 jsonData.forEach(item => {
//                   if (item.address) {
//                     item.address = item.address.replace(/,/g, ' ');
//                   }
//                 });

//                 // Extract all unique column headers from the data
//                 const allColumns = Array.from(new Set(jsonData.flatMap(row => Object.keys(row))));
//                 console.log("aline 114", allColumns);

//                 // Create CSV header
//                 const csvHeader = allColumns.join(',');
//                 console.log("line 118", csvHeader);
//                 //Create CSV data
//                 const csvData = jsonData.map(row =>
//                   allColumns.map(column => (row[column] !== undefined ? row[column] : '')).join(',')
//                 ).join('\n');
//                 //console.log("line 123", csvData);
//                 // Set response headers
//                 res.setHeader('Content-Type', 'text/csv');
//                 res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
//                 // res.status(200).send(`${csvHeader}\n${csvData}`);
//                 res.status(200).send(`${allColumns.join(',')}\n${csvData}`);

//                 // } else {
//                 //   res.status(201).json([]);
//                 // }

//               }else if(report_type =="bib_report"){
//                          const bibreport = await bibReport(event_id);

//                         //  console.log(bibReport);
//                         //  res.status(200).json(bibreport)
//                             const jsonData = bibreport;
//                          const csvFields = Object.keys(jsonData[0]);
//                          const csvHeader = csvFields.join(',');
//                          const csvData = jsonData.map(row => csvFields.map(field => row[field]).join(',')).join('\n');

//                          // Set response headers
//                          res.setHeader('Content-Type', 'text/csv');
//                          res.setHeader('Content-Disposition', 'attachment; filename=bib_report.csv');

//                          // Send CSV data in the response
//                          const csvContent = `${csvHeader}\n${csvData}`;

//                          res.status(200).send(`${csvHeader}\n${csvData}`);

//               }else
//               if(report_type == "bib_collection_report"){
//                 try {
//                   const result1 = await getBibcollectionrunnercount();
//                   const result2 = await get_registrantdetails_for_bibcollection(result1);
//                   //console.log(result2);
//                   //const merge = await mergeArray1(result1, result2);

//                   const result3 = await getTshirt_size(result2);
//                   const mergedArray = [].concat(...result3);
//                   const result4 = await mergeArrays1(result1, mergedArray);
//                   //console.log(result4);
//                   const result5 = await mergeArrays2(result4, result2);

//                   res.status(200).json(result5)
//                   // console.log(result1);
//                   // console.log(result2);
//                   // console.log(mergedArray);

//                   // if (result5) {
//                   //   // Convert data to CSV string
//                   //   csv.stringify(result5, { header: true }, (err, csvString) => {
//                   //     if (err) {
//                   //       console.error(err);
//                   //       return res.status(500).send('Internal Server Error');
//                   //     }

//                   //     // Send the CSV string as a response
//                   //     res.header('Content-Type', 'text/csv');
//                   //     res.attachment('output.csv');
//                   //     res.send(csvString);
//                   //   });

//                   // } else {
//                   //   res.status(400).send("no merged data available")
//                   // }

//                 } catch (error) {
//                   console.log(error);
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   } catch (error) {
//     res.status(400).json({
//       error_msg: error.message,
//       stack_trace: error.stack,
//       error_obj: error,
//     });
//   }
// };

// const addRunCat = async (runner) => {
//   return new Promise(async (resolve, reject) => {
//     let result1 = [];
//     for (let i = 0; i < runner.length; i++) {
//       const data = await db.sequelize.query(query.getRunCat, {
//         replacements: [runner[i].run_category_id_ref],
//         type: QueryTypes.SELECT,
//       });
//       //console.log("line113: ", data[0].race_type_name);
//       let merge = { ...runner[i], ...{ race_type: data[0].race_type_name } };
//       //console.log(merge);
//       result1.push(merge);
//     }
//     if (runner.length === result1.length) {
//       return resolve(result1);
//     }
//   });
// };
// exports.addRunCat = addRunCat;

// const regTypeId = async (reg_type) => {
//   return new Promise(async (resolve, reject) => {
//     const result = await db.sequelize.query(query.regType, {
//       replacements: [reg_type],
//       type: QueryTypes.SELECT,
//     });
//     // console.log("test", result);
//     if (result[0] !== undefined) {
//       return resolve(result);
//     }
//   });
// };
// exports.regTypeId = regTypeId;

// const getRegList = async (bookingList) => {
//   return new Promise(async (resolve, reject) => {
//     let data = [];
//     for (let i = 0; i < bookingList.length; i++) {
//       const result = await db.sequelize.query(query.getRegList, {
//         replacements: [bookingList[i].registrant_id_ref],
//         type: QueryTypes.SELECT,
//       });

//       if (result[0] !== undefined) {
//         data.push(result[0]);
//       }
//     }
//     //if (data.length === bookingList.length) {
//     //console.log(data);
//     return resolve(data);

//     //}
//   });
// };

// exports.getRegList = getRegList;

// const getBookingList = async (orderStatus, type_id) => {
//   return new Promise(async (resolve, reject) => {
//     let data = [];
//     //let count=0;
//     for (let i = 0; i < orderStatus.length; i++) {
//       const result = await db.sequelize.query(query.bookingList, {
//         replacements: [orderStatus[i].booking_id_ref, type_id],
//         type: QueryTypes.SELECT,
//       });
//       //console.log(result);
//       if (result[0] !== undefined) {
//         data.push(result[0]);
//         //count++;
//       }
//     }
//     if (data[0] !== undefined) {
//       return resolve(data);
//     } else {
//       return resolve([]);
//     }
//   });
// };
// exports.getBookingList = getBookingList;

// const mergeResult = async (bookingList, regList) => {
//   return new Promise((resolve, reject) => {
//     let result = [];

//     bookingList.forEach((obj) => {
//       let matchObj = regList.find(
//         (obj1) => obj1.registrant_id === obj.registrant_id_ref
//       );

//       if (matchObj) {
//         let merge = { ...obj, ...matchObj };
//         result.push(merge);
//       }
//     });

//     // if (bookingList.length === result.length) {
//     return resolve(result);
//     //}
//   });
// };
// exports.mergeResult = mergeResult;

// const regClass = async (result, regType) => {
//   return new Promise(async (resolve, reject) => {
//     let result1 = [];
//     for (let i = 0; i < result.length; i++) {
//       const data = await db.sequelize.query(query.getRegClass, {
//         replacements: [result[i].registrant_class_ref],
//         type: QueryTypes.SELECT,
//       });
//       let merge = {
//         ...result[i],
//         ...{ category_name: data[0].category_name },
//         ...{ reg_type: regType },
//       };
//       result1.push(merge);
//     }
//     // if (result.length === result1.length) {
//     return resolve(result1);
//     // }
//   });
// };
// exports.regClass = regClass;

// const donorWithRunnerCount = async (event_id, runCatName) => {
//   return new Promise(async (resolve, reject) => {
//     const reg_type = "donors with runners";
//     //get the type id for the registrant
//     const reg_type_id = await regTypeId(reg_type);
//     //console.log(reg_type_id);
//     //get paid registrant id from order_info
//     const orderStatus = await db.sequelize.query(query.paidRegId, {
//       replacements: [event_id],
//       type: QueryTypes.SELECT,
//     });
//     //console.log(orderStatus);
//     //get order status successed booking list
//     const bookingList = await getBookingList(
//       orderStatus,
//       reg_type_id[0].type_id
//     );
//     let donorRegCount = bookingList.length;
//     //console.log("line238", donorRegCount);
//     //from boooking id get registrant info

//     const runCategoryCount = await runTypeCount(bookingList, runCatName);
//     //console.log("line341   :",runCategoryCount);
//     if (bookingList.length > 0) {
//       const donorRunnersCount = await getRunnerCount(bookingList);
//       //console.log("line", donorRunnersCount);

//       const totalDonorRunnerCount =
//         donorRegCount + donorRunnersCount.runner_count;

//       const addressType = await addressTypeCount(bookingList);
//       return resolve({
//         totalDonorRunnerCount,
//         donorRunnersCount,
//         runCategoryCount,
//         addressType,
//       });
//     } else {
//       const totalDonorRunnerCount = donorRegCount;
//       let donorRunnersCount = {
//         xxxl_count: 0,
//         xxl_count: 0,
//         xl_count: 0,
//         l_count: 0,
//         m_count: 0,
//         s_count: 0,
//         xs_count: 0,
//         runner_count: 0,
//       };
//       let addressType = {
//         villa_count: villaCount,
//         tower1_count: 0,
//         tower2_count: 0,
//         tower3_count: 0,
//         tower4_count: 0,
//         tower5_count: 0,
//         tower6_count: 0,
//         tower7_count: 0,
//       };
//       return resolve({
//         totalDonorRunnerCount,
//         donorRunnersCount,
//         runCategoryCount,
//         addressType,
//       });
//     }
//     //console.log(totalMarathonCount);
//   });
// };
// exports.donorWithRunnerCount = donorWithRunnerCount;

// const marathonRunnerCount = async (event_id, runCatName) => {
//   return new Promise(async (resolve, reject) => {
//     const reg_type = "marathon runners";
//     //get the type id for the registrant
//     const reg_type_id = await regTypeId(reg_type);
//     //get paid registrant id from order_info
//     const orderStatus = await db.sequelize.query(query.paidRegId, {
//       replacements: [event_id],
//       type: QueryTypes.SELECT,
//     });
//     //get order status successed booking list
//     const bookingList = await getBookingList(
//       orderStatus,
//       reg_type_id[0].type_id
//     );
//     let marathonRegCount = bookingList.length;
//     //from boooking id get registrant info
//     if (bookingList.length > 0) {
//       const runCategoryCount = await runTypeCount(bookingList, runCatName);

//       const marathonRunnerCount = await getRunnerCount(bookingList);

//       const totalMarathonCount =
//         marathonRegCount + marathonRunnerCount.runner_count;
//       // filter the villa and tower  runners with booking list
//       const addressType = await addressTypeCount(bookingList);
//       //console.log(totalMarathonCount);
//       return resolve({
//         totalMarathonCount,
//         marathonRunnerCount,
//         runCategoryCount,
//         addressType,
//       });
//     } else {
//       let marathonRunnerCount = {
//         xxxl_count: 0,
//         xxl_count: 0,
//         xl_count: 0,
//         l_count: 0,
//         m_count: 0,
//         s_count: 0,
//         xs_count: 0,
//         runner_count: 0,
//       };

//       let addressType = {
//         villa_count: villaCount,
//         tower1_count: 0,
//         tower2_count: 0,
//         tower3_count: 0,
//         tower4_count: 0,
//         tower5_count: 0,
//         tower6_count: 0,
//         tower7_count: 0,
//       };
//       const totalMarathonCount = marathonRegCount;
//       return resolve(
//         totalMarathonCount,
//         marathonRunnerCount,
//         runCategoryCount,
//         addressType
//       );
//     }
//   });
// };
// exports.marathonRunnerCount = marathonRunnerCount;

// const donateRegCount = async (event_id) => {
//   return new Promise(async (resolve, reject) => {
//     const reg_type = "donate";
//     //console.log("donate");
//     //get the type id for the registrant
//     const reg_type_id = await regTypeId(reg_type);
//     //get paid registrant id from order_info
//     const orderStatus = await db.sequelize.query(query.paidRegId, {
//       replacements: [event_id],
//       type: QueryTypes.SELECT,
//     });
//     //get order status successed booking list
//     const bookingList = await getBookingList(
//       orderStatus,
//       reg_type_id[0].type_id
//     );
//     let donorRegCount = bookingList.length;

//     const addressType = await addrTypeCountForDonate(bookingList);

//     let runCategoryCount = { count_10k: 0, count_5k: 0, count_1k: 0 };
//     let donateRunnerCount = {
//       xxxl_count: 0,
//       xxl_count: 0,
//       xl_count: 0,
//       l_count: 0,
//       m_count: 0,
//       s_count: 0,
//       xs_count: 0,
//       runner_count: 0,
//     };
//     return resolve({
//       donorRegCount,
//       donateRunnerCount,
//       runCategoryCount,
//       addressType,
//     });
//   });
// };
// exports.donateRegCount = donateRegCount;

// const getRunnerCount = async (bookingList) => {
//   return new Promise(async (resolve, reject) => {
//     let result = 0;
//     let count = 0;
//     let xxxl = 0;
//     let xxl = 0;
//     let xl = 0;
//     let l = 0;
//     let m = 0;
//     let s = 0;
//     let xs = 0;

//     for (let i = 0; i < bookingList.length; i++) {
//       const data = await db.sequelize.query(query.runnerCount, {
//         replacements: [bookingList[i].booking_id],
//         type: QueryTypes.SELECT,
//       });
//       count++;
//       /*---------------*/
//       if (data[0] !== undefined) {
//         const s_size = await db.sequelize.query(query.tshirtCount, {
//           replacements: [bookingList[i].booking_id, "s"],
//           type: QueryTypes.SELECT,
//         });
//         s += +s_size.length;

//         const xxxl_size = await db.sequelize.query(query.tshirtCount, {
//           replacements: [bookingList[i].booking_id, "xxxl"],
//           type: QueryTypes.SELECT,
//         });
//         xxxl += +xxxl_size.length;

//         const xxl_size = await db.sequelize.query(query.tshirtCount, {
//           replacements: [bookingList[i].booking_id, "xxl"],
//           type: QueryTypes.SELECT,
//         });
//         xxl += +xxl_size.length;

//         const xl_size = await db.sequelize.query(query.tshirtCount, {
//           replacements: [bookingList[i].booking_id, "xl"],
//           type: QueryTypes.SELECT,
//         });
//         xl += +xl_size.length;

//         const l_size = await db.sequelize.query(query.tshirtCount, {
//           replacements: [bookingList[i].booking_id, "l"],
//           type: QueryTypes.SELECT,
//         });
//         l += +l_size.length;

//         const m_size = await db.sequelize.query(query.tshirtCount, {
//           replacements: [bookingList[i].booking_id, "m"],
//           type: QueryTypes.SELECT,
//         });
//         m += +m_size.length;

//         const xs_size = await db.sequelize.query(query.tshirtCount, {
//           replacements: [bookingList[i].booking_id, "xs"],
//           type: QueryTypes.SELECT,
//         });
//         xs += +xs_size.length;

//         result += +data.length;
//         //console.log("line 247:", result);
//       }
//     }
//     if ((count = bookingList.length)) {
//       return resolve({
//         runner_count: result,
//         xxxl_count: xxxl,
//         xxl_count: xxl,
//         xl_count: xl,
//         l_count: l,
//         m_count: m,
//         s_count: s,
//         xs_count: xs,
//       });
//     }
//   });
// };

// const corpCount = async (event_id, runCatName) => {
//   return new Promise(async (resolve, reject) => {
//     let xxxl = 0;
//     let xxl = 0;
//     let xl = 0;
//     let l = 0;
//     let m = 0;
//     let s = 0;
//     let xs = 0;
//     const sponsorCount = await db.sequelize.query(query.corpCount, {
//       replacements: [event_id],
//       type: QueryTypes.SELECT,
//     });
//     const runnerCount = await db.sequelize.query(query.corpRunnerCount, {
//       replacements: [event_id],
//       type: QueryTypes.SELECT,
//     });

//     const runCategoryCount = await corpRunTypeCount(sponsorCount, runCatName);
//     //console.log("line556: ",runCategoryCount);

//     let n1 = sponsorCount.length;
//     let n2 = runnerCount.length;
//     if (sponsorCount[0] !== undefined) {
//       //console.log("line326", sponsorCount);
//       //console.log("line327", runnerCount);
//       // let n1= sponsorCount.length;
//       if (runnerCount[0] !== undefined) {
//         // console.log(n1);
//         // console.log(n2);
//         let n = n1 + n1;

//         const s_size = await db.sequelize.query(query.corpTshirtCount, {
//           replacements: [event_id, "s"],
//           type: QueryTypes.SELECT,
//         });
//         s += +s_size.length;
//         const xxxl_size = await db.sequelize.query(query.corpTshirtCount, {
//           replacements: [event_id, "xxxl"],
//           type: QueryTypes.SELECT,
//         });
//         xxxl += +xxxl_size.length;
//         const xxl_size = await db.sequelize.query(query.corpTshirtCount, {
//           replacements: [event_id, "xxl"],
//           type: QueryTypes.SELECT,
//         });
//         xxl += +xxl_size.length;
//         const xl_size = await db.sequelize.query(query.corpTshirtCount, {
//           replacements: [event_id, "xl"],
//           type: QueryTypes.SELECT,
//         });
//         xl += +xl_size.length;
//         const l_size = await db.sequelize.query(query.corpTshirtCount, {
//           replacements: [event_id, "l"],
//           type: QueryTypes.SELECT,
//         });
//         l += +l_size.length;
//         const m_size = await db.sequelize.query(query.corpTshirtCount, {
//           replacements: [event_id, "m"],
//           type: QueryTypes.SELECT,
//         });
//         m += +m_size.length;
//         const xs_size = await db.sequelize.query(query.corpTshirtCount, {
//           replacements: [event_id, "xs"],
//           type: QueryTypes.SELECT,
//         });
//         xs += +xs_size.length;

//         let addressType = {
//           villa_count: 0,
//           tower1_count: 0,
//           tower2_count: 0,
//           tower3_count: 0,
//           tower4_count: 0,
//           tower5_count: 0,
//           tower6_count: 0,
//           tower7_count: 0,
//         };
//         let runnerCount = {
//           xxxl_count: xxxl,
//           xxl_count: xxl,
//           xl_count: xl,
//           l_count: l,
//           m_count: m,
//           s_count: s,
//           xs_count: xs,
//           runner_count: n2,
//         };

//         return resolve({ n, runnerCount, runCategoryCount, addressType });
//       } else {
//         let n = n1 + n2;
//         let runnerCount = {
//           xxxl_count: 0,
//           xxl_count: 0,
//           xl_count: 0,
//           l_count: 0,
//           m_count: 0,
//           s_count: 0,
//           xs_count: 0,
//           runner_count: n2,
//         };

//         let addressType = {
//           villa_count: 0,
//           tower1_count: 0,
//           tower2_count: 0,
//           tower3_count: 0,
//           tower4_count: 0,
//           tower5_count: 0,
//           tower6_count: 0,
//           tower7_count: 0,
//         };
//         return resolve({ n, runnerCount, runCategoryCount, addressType });
//       }
//     } else {
//       let runnerCount = {
//         xxxl_count: 0,
//         xxl_count: 0,
//         xl_count: 0,
//         l_count: 0,
//         m_count: 0,
//         s_count: 0,
//         xs_count: 0,
//         runner_count: n2,
//       };
//       return resolve({ n, runnerCount, runCategoryCount });
//     }
//   });
// };
// exports.corpCount = corpCount;

// const corpRunTypeCount = async (corpName, runCatName) => {
//   return new Promise(async (resolve, reject) => {
//     let count_10k = 0;
//     let count_5k = 0;
//     let count_1k = 0;
//     if (corpName.length > 0) {
//       // console.log("corp_name: ", corpName);
//       for (let i = 0; i < runCatName.length; i++) {
//         if (runCatName[i].race_type_name == "10k") {
//           //10k runner count

//           // console.log("line 663: ", runCatName[i].race_type_id);
//           for (let j = 0; j < corpName.length; j++) {
//             const result = await db.sequelize.query(query.corpRunCatCount, {
//               replacements: [
//                 corpName[j].corporate_id,
//                 runCatName[i].race_type_id,
//               ],
//             });
//             //console.log("line658: ", result);
//             if (result[0] !== undefined) {
//               count_10k += +result[0].length;
//             }
//           }
//         } else {
//           if (runCatName[i].race_type_name == "5k") {
//             //10k runner count

//             // console.log("line 673: ",runCatName[i].race_type_id);

//             for (let j = 0; j < corpName.length; j++) {
//               const result = await db.sequelize.query(query.corpRunCatCount, {
//                 replacements: [
//                   corpName[j].corporate_id,
//                   runCatName[i].race_type_id,
//                 ],
//               });
//               //console.log("line679: ", result[0]);
//               if (result[0] !== undefined) {
//                 count_5k += +result[0].length;
//               }
//             }
//           } else {
//             if (runCatName[i].race_type_name == "1k") {
//               //console.log("line 683: ",runCatName[i].race_type_id);

//               //10k runner count
//               for (let j = 0; j < corpName.length; j++) {
//                 const result = await db.sequelize.query(query.corpRunCatCount, {
//                   replacements: [
//                     corpName[j].corporate_id,
//                     runCatName[i].race_type_id,
//                   ],
//                 });
//                 // console.log("line658: ", result);
//                 if (result[0] !== undefined) {
//                   count_1k += +result[0].length;
//                 }
//               }
//             }
//           }
//         }
//       }
//       let obj = { count_10k, count_5k, count_1k };
//       return resolve(obj);
//     } else {
//       let obj = { count_10k: 0, count_5k: 0, count_1k: 0 };
//       return resolve(obj);
//     }
//   });
// };

// const runTypeCount = async (bookingList, runCatName) => {
//   return new Promise(async (resolve, reject) => {
//     let count_10k = 0;
//     let count_5k = 0;
//     let count_1k = 0;
//     if (bookingList.length > 0) {
//       for (let i = 0; i < runCatName.length; i++) {
//         if (runCatName[i].race_type_name == "10k") {
//           //10k runner count
//           for (let j = 0; j < bookingList.length; j++) {
//             const result = await db.sequelize.query(query.runCatCount, {
//               replacements: [
//                 bookingList[j].booking_id,
//                 runCatName[i].race_type_id,
//               ],
//             });

//             count_10k += +result[1].rowCount;
//           }
//         } else {
//           if (runCatName[i].race_type_name == "5k") {
//             //10k runner count
//             for (let j = 0; j < bookingList.length; j++) {
//               const result = await db.sequelize.query(query.runCatCount, {
//                 replacements: [
//                   bookingList[j].booking_id,
//                   runCatName[i].race_type_id,
//                 ],
//               });
//               count_5k += +result[1].rowCount;
//             }
//           } else {
//             if (runCatName[i].race_type_name == "1k") {
//               //10k runner count
//               for (let j = 0; j < bookingList.length; j++) {
//                 const result = await db.sequelize.query(query.runCatCount, {
//                   replacements: [
//                     bookingList[j].booking_id,
//                     runCatName[i].race_type_id,
//                   ],
//                 });
//                 count_1k += +result[1].rowCount;
//               }
//             }
//           }
//         }
//       }
//       let obj = { count_10k, count_5k, count_1k };
//       return resolve(obj);
//     } else {
//       let obj = { count_10k: 0, count_5k: 0, count_1k: 0 };
//       return resolve(obj);
//     }
//   });
// };

// const addressTypeCount = async (bookingList) => {
//   return new Promise(async (resolve, reject) => {
//     // console.log("line 758: ", bookingList);
//     let villaCount = 0;
//     let tower_1 = 0;
//     let tower_2 = 0;
//     let tower_3 = 0;
//     let tower_4 = 0;
//     let tower_5 = 0;
//     let tower_6 = 0;
//     let tower_7 = 0;
//     //find the registrants whose address type is villa
//     for (let i = 0; i < bookingList.length; i++) {
//       let villa = await db.sequelize.query(query.regAddrType, {
//         replacements: [bookingList[i].registrant_id_ref, "villa"],
//         type: QueryTypes.SELECT,
//       });

//       if (villa[0] !== undefined) {
//         const runnerCount = await db.sequelize.query(query.villaRunners, {
//           replacements: [bookingList[i].booking_id],
//           type: QueryTypes.SELECT,
//         });

//         villaCount += +runnerCount.length;
//       } else {
//         let tower1 = await db.sequelize.query(query.regAddrTower, {
//           replacements: [bookingList[i].registrant_id_ref, "tower", "Tower 1"],
//           type: QueryTypes.SELECT,
//         });

//         if (tower1[0] !== undefined) {
//           const runnerCount = await db.sequelize.query(query.villaRunners, {
//             replacements: [bookingList[i].booking_id],
//             type: QueryTypes.SELECT,
//           });

//           tower_1 += +runnerCount.length;
//         } else {
//           let tower2 = await db.sequelize.query(query.regAddrTower, {
//             replacements: [
//               bookingList[i].registrant_id_ref,
//               "tower",
//               "Tower 2",
//             ],
//             type: QueryTypes.SELECT,
//           });

//           if (tower2[0] !== undefined) {
//             //console.log("line854: ", bookingList[i]);
//             const runnerCount = await db.sequelize.query(query.villaRunners, {
//               replacements: [bookingList[i].booking_id],
//               type: QueryTypes.SELECT,
//             });
//             // console.log("line859: ", runnerCount);
//             tower_2 += +runnerCount.length;
//           } else {
//             let tower3 = await db.sequelize.query(query.regAddrTower, {
//               replacements: [
//                 bookingList[i].registrant_id_ref,
//                 "tower",
//                 "Tower 3",
//               ],
//               type: QueryTypes.SELECT,
//             });

//             if (tower3[0] !== undefined) {
//               const runnerCount = await db.sequelize.query(query.villaRunners, {
//                 replacements: [bookingList[i].booking_id],
//                 type: QueryTypes.SELECT,
//               });

//               tower_3 += +runnerCount.length;
//             } else {
//               let tower4 = await db.sequelize.query(query.regAddrTower, {
//                 replacements: [
//                   bookingList[i].registrant_id_ref,
//                   "tower",
//                   "Tower 4",
//                 ],
//                 type: QueryTypes.SELECT,
//               });

//               if (tower4[0] !== undefined) {
//                 const runnerCount = await db.sequelize.query(
//                   query.villaRunners,
//                   {
//                     replacements: [bookingList[i].booking_id],
//                     type: QueryTypes.SELECT,
//                   }
//                 );

//                 tower_4 += +runnerCount.length;
//               } else {
//                 let tower5 = await db.sequelize.query(query.regAddrTower, {
//                   replacements: [
//                     bookingList[i].registrant_id_ref,
//                     "tower",
//                     "Tower 5",
//                   ],
//                   type: QueryTypes.SELECT,
//                 });

//                 if (tower5[0] !== undefined) {
//                   const runnerCount = await db.sequelize.query(
//                     query.villaRunners,
//                     {
//                       replacements: [bookingList[i].booking_id],
//                       type: QueryTypes.SELECT,
//                     }
//                   );

//                   tower_5 += +runnerCount.length;
//                 } else {
//                   let tower6 = await db.sequelize.query(query.regAddrTower, {
//                     replacements: [
//                       bookingList[i].registrant_id_ref,
//                       "tower",
//                       "Tower 6",
//                     ],
//                     type: QueryTypes.SELECT,
//                   });

//                   if (tower6[0] !== undefined) {
//                     const runnerCount = await db.sequelize.query(
//                       query.villaRunners,
//                       {
//                         replacements: [bookingList[i].booking_id],
//                         type: QueryTypes.SELECT,
//                       }
//                     );

//                     tower_6 += +runnerCount.length;
//                   } else {
//                     let tower7 = await db.sequelize.query(query.regAddrTower, {
//                       replacements: [
//                         bookingList[i].registrant_id_ref,
//                         "tower",
//                         "Tower 7",
//                       ],
//                       type: QueryTypes.SELECT,
//                     });

//                     if (tower7[0] !== undefined) {
//                       const runnerCount = await db.sequelize.query(
//                         query.villaRunners,
//                         {
//                           replacements: [bookingList[i].booking_id],
//                           type: QueryTypes.SELECT,
//                         }
//                       );

//                       tower_7 += +runnerCount.length;
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }

//     let obj = {
//       villa_count: villaCount,
//       tower1_count: tower_1,
//       tower2_count: tower_2,
//       tower3_count: tower_3,
//       tower4_count: tower_4,
//       tower5_count: tower_5,
//       tower6_count: tower_6,
//       tower7_count: tower_7,
//     };
//     return resolve(obj);
//   });
// };

// const addrTypeCountForDonate = async (bookingList) => {
//   return new Promise(async (resolve, reject) => {
//     // console.log("line 758: ", bookingList);
//     let villaCount = 0;
//     let tower_1 = 0;
//     let tower_2 = 0;
//     let tower_3 = 0;
//     let tower_4 = 0;
//     let tower_5 = 0;
//     let tower_6 = 0;
//     let tower_7 = 0;
//     //find the registrants whose address type is villa
//     for (let i = 0; i < bookingList.length; i++) {
//       let villa = await db.sequelize.query(query.regAddrType, {
//         replacements: [bookingList[i].registrant_id_ref, "villa"],
//         type: QueryTypes.SELECT,
//       });

//       // console.log("line1029: ", villa);

//       if (villa[0] !== undefined) {
//         villaCount += +villa.length;
//       } else {
//         let tower1 = await db.sequelize.query(query.regAddrTower, {
//           replacements: [bookingList[i].registrant_id_ref, "tower", "Tower 1"],
//           type: QueryTypes.SELECT,
//         });

//         if (tower1[0] !== undefined) {
//           tower_1 += +tower1.length;
//         } else {
//           let tower2 = await db.sequelize.query(query.regAddrTower, {
//             replacements: [
//               bookingList[i].registrant_id_ref,
//               "tower",
//               "Tower 2",
//             ],
//             type: QueryTypes.SELECT,
//           });

//           if (tower2[0] !== undefined) {
//             //console.log("line859: ", runnerCount);
//             tower_2 += +tower2.length;
//           } else {
//             let tower3 = await db.sequelize.query(query.regAddrTower, {
//               replacements: [
//                 bookingList[i].registrant_id_ref,
//                 "tower",
//                 "Tower 3",
//               ],
//               type: QueryTypes.SELECT,
//             });

//             if (tower3[0] !== undefined) {
//               tower_3 += +tower3.length;
//             } else {
//               let tower4 = await db.sequelize.query(query.regAddrTower, {
//                 replacements: [
//                   bookingList[i].registrant_id_ref,
//                   "tower",
//                   "Tower 4",
//                 ],
//                 type: QueryTypes.SELECT,
//               });

//               if (tower4[0] !== undefined) {
//                 tower_4 += +tower4.length;
//               } else {
//                 let tower5 = await db.sequelize.query(query.regAddrTower, {
//                   replacements: [
//                     bookingList[i].registrant_id_ref,
//                     "tower",
//                     "Tower 5",
//                   ],
//                   type: QueryTypes.SELECT,
//                 });

//                 if (tower5[0] !== undefined) {
//                   tower_5 += +tower5.length;
//                 } else {
//                   let tower6 = await db.sequelize.query(query.regAddrTower, {
//                     replacements: [
//                       bookingList[i].registrant_id_ref,
//                       "tower",
//                       "Tower 6",
//                     ],
//                     type: QueryTypes.SELECT,
//                   });

//                   if (tower6[0] !== undefined) {
//                     tower_6 += +tower6.length;
//                   } else {
//                     let tower7 = await db.sequelize.query(query.regAddrTower, {
//                       replacements: [
//                         bookingList[i].registrant_id_ref,
//                         "tower",
//                         "Tower 7",
//                       ],
//                       type: QueryTypes.SELECT,
//                     });

//                     if (tower7[0] !== undefined) {
//                       tower_7 += +tower7.length;
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }

//     let obj = {
//       villa_count: villaCount,
//       tower1_count: tower_1,
//       tower2_count: tower_2,
//       tower3_count: tower_3,
//       tower4_count: tower_4,
//       tower5_count: tower_5,
//       tower6_count: tower_6,
//       tower7_count: tower_7,
//     };
//     return resolve(obj);
//   });
// };

// const downloadData = async (req, res) => {
//   try {
//     const { report_type, downloaded_by, download_date, event_id } = req.body;

//     const addData = await db.sequelize.query(query.addDownloadData, {
//       replacements: [report_type, downloaded_by, download_date, event_id],
//       type: QueryTypes.INSERT,
//     });

//     console.log(addData);

//     res.status(200).json("Data added");
//   } catch (error) {
//     res.status(400).json({
//       error_msg: error.message,
//       stack_trace: error.stack,
//       error_obj: error,
//     });
//   }
// };

// const downloadHistory = async (req, res) => {
//   try {
//     const eventInfo = await db.sequelize.query(query.activeEvent, {
//       type: QueryTypes.SELECT,
//     });

//     const getReportHistory = await db.sequelize.query(query.reportsHistory, {
//       replacements: [eventInfo[0].event_id],
//       type: QueryTypes.SELECT,
//     });

//     res.status(200).json(getReportHistory);
//   } catch (error) {
//     res.status(400).json({
//       error_msg: error.message,
//       stack_trace: error.stack,
//       error_obj: error,
//     });
//   }
// };
// //--------------------------------laksh-----------------------------------------

// const getBibcollectionrunnercount = async () => {
//   return new Promise((resolve, reject) => {
//     try {
//       const runnercount = db.sequelize.query(query.registrantWithRunnerCount, {
//         type: QueryTypes.SELECT,
//       });
//       if (runnercount) {
//         resolve(runnercount);
//       } else {
//         reject(new Error("No Runner details with bib number available"))
//       }

//     } catch (error) {
//       reject(error)

//     }
//   })
// }

// const get_registrantdetails_for_bibcollection = async (runnercounts) => {
//   return new Promise(async (resolve, reject) => {
//     let myarr1 = [];
//     try {
//       // console.log("line 1677", runnercount);
//       const filteredArray = runnercounts.filter(item => item.registrant_id_ref !== null);
//       for (let i = 0; i < filteredArray.length; i++) {
//         const registrantdetails = await db.sequelize.query(query.registrantDetailsForReport, {
//           type: QueryTypes.SELECT,
//           replacements: [filteredArray[i].registrant_id_ref]
//         });
//         //console.log("line 1684", registrantdetails);
//         myarr1.push(registrantdetails[0])

//       }
//       //console.log("line 1686", myarr1.length);
//       if (myarr1.length > 0) {
//         //console.log(myarr);
//         resolve(myarr1);
//       } else {
//         reject("No data available in registrant table");
//       }

//     } catch (error) {
//       reject(error);
//     }
//   })

// }

// const getTshirt_size = (registrant_ids) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let myarr = [];
//       for (let i = 0; i < registrant_ids.length; i++) {
//         const tshirtsize = await db.sequelize.query(query.getTshirtsizeForReport, {
//           type: QueryTypes.SELECT,
//           replacements: [registrant_ids[i].registrant_id]
//         });
//         myarr.push(tshirtsize)
//       }
//       if (myarr.length > 0) {
//         resolve(myarr)
//       } else {
//         reject(new Error("tshirt data is not available for runners"))
//       }

//     } catch (error) {
//       reject(error);
//     }
//   })
// }

// async function mergeArrays1(array1, array2) {
//   // Create a map to store registrants based on their registrant_id_ref
//   const registrantsMap = new Map();
//   // Merge array1 into the map
//   array1.forEach(({ registrant_id_ref, runner_count }) => {
//     if (!registrantsMap.has(registrant_id_ref)) {
//       registrantsMap.set(registrant_id_ref, { registrant_id_ref, runner_count, tshirt_sizes: [], runner_names: [], runners_id: [] });
//     }
//   });
//   // Merge array2 into the map
//   array2.forEach(({ registrant_id_ref, tshirt_size, runner_name, runner_id }) => {
//     if (registrantsMap.has(registrant_id_ref)) {
//       registrantsMap.get(registrant_id_ref).tshirt_sizes.push(tshirt_size);
//       registrantsMap.get(registrant_id_ref).runner_names.push(runner_name);
//       registrantsMap.get(registrant_id_ref).runners_id.push(runner_id);
//     } else {
//       // If registrant_id_ref doesn't exist in map, add it with tshirt_size
//       registrantsMap.set(registrant_id_ref, { registrant_id_ref, tshirt_sizes: [tshirt_size], runner_names: [runner_name], runners_id: [runner_id] });
//     }
//   });
//   // Convert the map values back to an array
//   const mergedArray = Array.from(registrantsMap.values());
//   return mergedArray;
// }

// async function mergeArrays2(array1, array2) {
//   // Create a map to store registrants based on their registrant_id_ref
//   const registrantsMap = new Map();
//   // Merge array1 into the map
//   array1.forEach(({ registrant_id_ref, runner_count, tshirt_sizes, runner_names, runners_id }) => {
//     if (!registrantsMap.has(registrant_id_ref)) {
//       registrantsMap.set(registrant_id_ref, { registrant_id_ref, runner_count, tshirt_sizes, runner_names, runners_id });
//     }
//   });
//   // Merge array2 into the map
//   array2.forEach(({ registrant_id, registrant_name, email_id, mobile_number }) => {
//     if (registrantsMap.has(registrant_id)) {
//       const existingRegistrant = registrantsMap.get(registrant_id);
//       existingRegistrant.registrant_name = registrant_name;
//       existingRegistrant.email_id = email_id;
//       existingRegistrant.mobile_number = mobile_number;
//     } else {
//       // If registrant_id doesn't exist in map, add it
//       registrantsMap.set(registrant_id, {
//         registrant_id_ref: registrant_id,
//         registrant_name,
//         email_id,
//         mobile_number,
//       });
//     }
//   });
//   // Convert the map values back to an array
//   const mergedArray = Array.from(registrantsMap.values());
//   return mergedArray;
// }

// const getBiB_collection_report = async (req, res) => {
//   try {
//     const result1 = await getBibcollectionrunnercount();
//     const result2 = await get_registrantdetails_for_bibcollection(result1);
//     //console.log(result2);
//     //const merge = await mergeArray1(result1, result2);

//     const result3 = await getTshirt_size(result2);
//     const mergedArray = [].concat(...result3);
//     const result4 = await mergeArrays1(result1, mergedArray);
//     //console.log(result4);
//     const result5 = await mergeArrays2(result4, result2);
//     // console.log(result1);
//     // console.log(result2);
//     // console.log(mergedArray);

//     if (result5) {
//       // Convert data to CSV string
//       csv.stringify(result5, { header: true }, (err, csvString) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send('Internal Server Error');
//         }

//         // Send the CSV string as a response
//         res.header('Content-Type', 'text/csv');
//         res.attachment('output.csv');
//         res.send(csvString);
//       });

//     } else {
//       res.status(400).send("no merged data available")
//     }

//   } catch (error) {
//     console.log(error);
//   }

// }
// //--------------------------------laksh-----------------------------------------

// const bibReport = async(eventid)=>{
//    return new Promise(async(resolve, reject)=>{

//     const paidRunner = await db.sequelize.query(query.paidRunner, {replacements:[eventid], type:QueryTypes.SELECT});

//     const ageCat = await db.sequelize.query(query.ageType, { type:QueryTypes.SELECT});

//     const runCat = await db.sequelize.query(query.runType, { type:QueryTypes.SELECT});
//       if(paidRunner.length > 0){
//     const result =await mergeBibReport(paidRunner,ageCat,runCat);

//     if(result){
//       return resolve(result)
//     }
//       }else{
//       return resolve(paidRunner)
//     }

//    })

// }

// const mergeBibReport = async(runner,ageCat,runCat)=>{
//   return new Promise(async (resolve, reject)=>{

//     let result =[];
//     let data=[];

//              runner.forEach(obj=>{
//                     let matchObj = ageCat.find(obj1 => obj.age_type_id_ref === obj1.age_type_id);

//                     if(matchObj){

//                       let mergeObj = {...obj, ...matchObj}

//                       result.push(mergeObj);
//                     }
//              })

//              result.forEach(obj=>{
//               let matchObj1 = runCat.find(obj1 => obj.run_category_id_ref === obj1.race_type_id);

//               if(matchObj1){

//                 let mergeObj1 = {...obj, ...matchObj1}

//                 data.push(mergeObj1);
//               }
//        })

//          if(runner.length === data.length){
//        return resolve(data)
//          }else{
//           return resolve(data)
//          }
//   })
// }

// module.exports = { reports, downloadData, downloadHistory, getBiB_collection_report };

const db = require("../config/dbconfig");
const query = require("../models/reports.model");
const { sequelize, EagerLoadingError } = require("sequelize");
const { QueryTypes } = require("sequelize");

const json2csv = require("json2csv").parse;
const fs = require("fs");
const { log } = require("console");
const csv = require("csv");

const PDFDocument = require("pdfkit");

const reports = async (req, res) => {
  try {
    const { event_id, report_type } = req.params;
    console.log(event_id);
    if (report_type == "corporate_sponsors") {
      const sponsorList = await db.sequelize.query(query.corporateSponsor, {
        replacements: [event_id],
        type: QueryTypes.SELECT,
      });

      if (sponsorList[0] !== undefined) {
        //  const jsonData = reg_class;
        //console.log(reg_class);
        const jsonData = sponsorList;
        const csvFields = Object.keys(jsonData[0]);
        const csvHeader = csvFields.join(",");
        const csvData = jsonData
          .map((row) => csvFields.map((field) => row[field]).join(","))
          .join("\n");

        // Set response headers
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=sponsorlist.csv"
        );

        // Send CSV data in the response
        const csvContent = `${csvHeader}\n${csvData}`;

        res.status(200).send(`${csvHeader}\n${csvData}`);

        // Send CSV data in the response

        // res.status(200).json(csvContent);
      } else {
        res.status(201).json([]);
      }

      //  res.status(200).json(sponsorList);
    } else {
      if (report_type == "marathon_runners") {
        const reg_type = "marathon runners";

        //get the type id for the registrant
        const reg_type_id = await regTypeId(reg_type);

        //Added by Rishi on 11/3/24 -- changed registrant data to runner data
        const regList = await db.sequelize.query(query.getRunners, {
          replacements:[reg_type_id[0].type_id, parseInt(event_id)],
          type:QueryTypes.SELECT
        });
        console.log("line 101", regList.length);

        //Removed by Rishi on 11/3/24 -- changed registrant data to runner data
        //get paid registrant id from order_info
        // const orderStatus = await db.sequelize.query(query.paidRegId, {
        //   replacements: [event_id],
        //   type: QueryTypes.SELECT,
        // });
        //get order status successed booking list
        // const bookingList = await getBookingList(
        //   orderStatus,
        //   reg_type_id[0].type_id
        // );
        //from boooking id get registrant info
        //const regList = await getRegList(bookingList);
        //console.log(regList.length);
        //console.log("line35", regList);

        //merger booking data and regData
        //const result = await mergeResult(bookingList, regList);

        //console.log("line40:  ",result);
        // get registrant class name
        // const reg_class = await regClass(regList, reg_type);

        // console.log("line 44", reg_class[0]);
        // console.log("line 45",reg_class.length);
        if (regList[0] !== undefined) {
          const jsonData = regList;

          jsonData.forEach((item) => {
            if (item.address) {
              item.address = item.address.replace(/,/g, " ");
            }
          });

          // Extract all unique column headers from the data
          const allColumns = Array.from(
            new Set(jsonData.flatMap((row) => Object.keys(row)))
          );
          console.log("aline 114", allColumns);

          // Create CSV header
          const csvHeader = allColumns.join(",");
          console.log("line 118", csvHeader);
          //Create CSV data
          const csvData = jsonData
            .map((row) =>
              allColumns
                .map((column) => (row[column] !== undefined ? row[column] : ""))
                .join(",")
            )
            .join("\n");
          //console.log("line 123", csvData);
          // Set response headers
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=output.csv"
          );
          // res.status(200).send(`${csvHeader}\n${csvData}`);
          res.status(200).send(`${allColumns.join(",")}\n${csvData}`);
        } else {
          res.status(201).json([]);
        }
      } else {
        if (report_type == "runners_list") {
          const runnerList = await db.sequelize.query(query.getrunners, {
            replacements: [event_id],
            type: QueryTypes.SELECT,
          });
          if (runnerList[0] !== undefined) {
            const runnerCat = await addRunCat(runnerList);
            console.log("line 146", runnerCat);
            const jsonData = runnerCat;

            jsonData.forEach((item) => {
              if (item.runner_address) {
                item.runner_address = item.runner_address.replace(/,/g, " ");
              }
            });

            // Extract all unique column headers from the data
            const allColumns = Array.from(
              new Set(jsonData.flatMap((row) => Object.keys(row)))
            );
            console.log("aline 114", allColumns);

            // Create CSV header
            const csvHeader = allColumns.join(",");
            console.log("line 118", csvHeader);
            //Create CSV data
            const csvData = jsonData
              .map((row) =>
                allColumns
                  .map((column) =>
                    row[column] !== undefined ? row[column] : ""
                  )
                  .join(",")
              )
              .join("\n");
            //console.log("line 123", csvData);
            // Set response headers
            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=output.csv"
            );
            // res.status(200).send(`${csvHeader}\n${csvData}`);
            res.status(200).send(`${allColumns.join(",")}\n${csvData}`);

            // res.status(200).json(runnerCat);
          } else {
            res.status(201).json(runnerList);
          }
        } else {
          if (report_type == "count_summary") {

            const groupped = await db.sequelize.query(query.groupedCountSummary, {
              replacements:[parseInt(event_id)],
              type:QueryTypes.SELECT
            });
            const unGroupped = await db.sequelize.query(query.ungroupedCountSummary, {
              replacements:[parseInt(event_id)],
              type:QueryTypes.SELECT
            });
            const corpRunnerCountSummary = await db.sequelize.query(query.corpRunnerCountSummary, {
              replacements:[parseInt(event_id)],
              type:QueryTypes.SELECT
            });
            unGroupped[0].count = String(parseInt(unGroupped[0].count)+parseInt(corpRunnerCountSummary[0].count))
            unGroupped[0].xs_tshirt = String(parseInt(unGroupped[0].xs_tshirt)+parseInt(corpRunnerCountSummary[0].xs_tshirt))
            unGroupped[0].s_tshirt = String(parseInt(unGroupped[0].s_tshirt)+parseInt(corpRunnerCountSummary[0].s_tshirt))
            unGroupped[0].m_tshirt = String(parseInt(unGroupped[0].m_tshirt)+parseInt(corpRunnerCountSummary[0].m_tshirt))
            unGroupped[0].l_tshirt = String(parseInt(unGroupped[0].l_tshirt)+parseInt(corpRunnerCountSummary[0].l_tshirt))
            unGroupped[0].xl_tshirt = String(parseInt(unGroupped[0].xl_tshirt)+parseInt(corpRunnerCountSummary[0].xl_tshirt))
            unGroupped[0].xxl_tshirt = String(parseInt(unGroupped[0].xxl_tshirt)+parseInt(corpRunnerCountSummary[0].xxl_tshirt))
            unGroupped[0].xxxl_tshirt = String(parseInt(unGroupped[0].xxxl_tshirt)+parseInt(corpRunnerCountSummary[0].xxxl_tshirt))
            unGroupped[0].race_category_1k = String(parseInt(unGroupped[0].race_category_1k)+parseInt(corpRunnerCountSummary[0].race_category_1k))
            unGroupped[0].race_category_5k = String(parseInt(unGroupped[0].race_category_5k)+parseInt(corpRunnerCountSummary[0].race_category_5k))
            unGroupped[0].race_category_10k = String(parseInt(unGroupped[0].race_category_10k)+parseInt(corpRunnerCountSummary[0].race_category_10k))
            unGroupped[0].tower_1 = String(parseInt(unGroupped[0].tower_1)+parseInt(corpRunnerCountSummary[0].tower_1))
            unGroupped[0].tower_2 = String(parseInt(unGroupped[0].tower_2)+parseInt(corpRunnerCountSummary[0].tower_2))
            unGroupped[0].tower_3 = String(parseInt(unGroupped[0].tower_3)+parseInt(corpRunnerCountSummary[0].tower_3))
            unGroupped[0].tower_4 = String(parseInt(unGroupped[0].tower_4)+parseInt(corpRunnerCountSummary[0].tower_4))
            unGroupped[0].tower_5 = String(parseInt(unGroupped[0].tower_5)+parseInt(corpRunnerCountSummary[0].tower_5))
            unGroupped[0].tower_6 = String(parseInt(unGroupped[0].tower_6)+parseInt(corpRunnerCountSummary[0].tower_6))
            unGroupped[0].tower_7 = String(parseInt(unGroupped[0].tower_7)+parseInt(corpRunnerCountSummary[0].tower_7))
            unGroupped[0].villa = String(parseInt(unGroupped[0].villa)+parseInt(corpRunnerCountSummary[0].villa))
            const overAll = [
              {"registrant_type":"Total","registrant_type_ref":"0",...unGroupped[0]},
              groupped[0],
              groupped[1],
              {"registrant_type":"corporate_runner","registrant_type_ref":"-",...corpRunnerCountSummary[0]}
            ]
            if (overAll[0] !== undefined) {
              const jsonData = overAll;
    
              jsonData.forEach((item) => {
                if (item.address) {
                  item.address = item.address.replace(/,/g, " ");
                }
              });
    
              // Extract all unique column headers from the data
              const allColumns = Array.from(
                new Set(jsonData.flatMap((row) => Object.keys(row)))
              );
              console.log("aline 114", allColumns);
    
              // Create CSV header
              const csvHeader = allColumns.join(",");
              console.log("line 118", csvHeader);
              //Create CSV data
              const csvData = jsonData
                .map((row) =>
                  allColumns
                    .map((column) => (row[column] !== undefined ? row[column] : ""))
                    .join(",")
                )
                .join("\n");
              //console.log("line 123", csvData);
              // Set response headers
              res.setHeader("Content-Type", "text/csv");
              res.setHeader(
                "Content-Disposition",
                "attachment; filename=output.csv"
              );
              // res.status(200).send(`${csvHeader}\n${csvData}`);
              res.status(200).send(`${allColumns.join(",")}\n${csvData}`);
            } else {
              res.status(201).json([]);
            }
            // const runCatName = await db.sequelize.query(query.runCat, {
            //   type: QueryTypes.SELECT,
            // });
            // const marathonRunnersCount = await marathonRunnerCount(
            //   event_id,
            //   runCatName
            // );

            // const donorRunerCount = await donorWithRunnerCount(
            //   event_id,
            //   runCatName
            // );
            // // console.log("..........", donorRunerCount);
            // const donateCount = await donateRegCount(event_id);
            // const corporateCount = await corpCount(event_id, runCatName);

            // console.log("line196: ", corporateCount.runCategoryCount);

            // let jsonData = [
            //   {
            //     marathon_runners_count: {
            //       participants_count:
            //         marathonRunnersCount.totalMarathonCount,
            //       xxxl_tshirt:
            //         marathonRunnersCount.marathonRunnerCount.xxxl_count,
            //       xxl_tshirt:
            //         marathonRunnersCount.marathonRunnerCount.xxl_count,
            //       xl_tshirt:
            //         marathonRunnersCount.marathonRunnerCount.xl_count,
            //       l_tshirt:
            //         marathonRunnersCount.marathonRunnerCount.l_count,
            //       m_tshirt:
            //         marathonRunnersCount.marathonRunnerCount.m_count,
            //       s_tshirt:
            //         marathonRunnersCount.marathonRunnerCount.s_count,
            //       xs_tshirt:
            //         marathonRunnersCount.marathonRunnerCount.xs_count,
            //       total:
            //         marathonRunnersCount.marathonRunnerCount.runner_count,
            //       race_category_count:
            //         marathonRunnersCount.runCategoryCount,
            //       villaAndTowerRunCount: marathonRunnersCount.addressType,
            //     },
            //   },
            //   {
            //     donor_with_runner_count: {
            //       participants_count: donorRunerCount.totalDonorRunnerCount,
            //       xxxl_tshirt: donorRunerCount.donorRunnersCount.xxxl_count,
            //       xxl_tshirt: donorRunerCount.donorRunnersCount.xxl_count,
            //       xl_tshirt: donorRunerCount.donorRunnersCount.xl_count,
            //       l_tshirt: donorRunerCount.donorRunnersCount.l_count,
            //       m_tshirt: donorRunerCount.donorRunnersCount.m_count,
            //       s_tshirt: donorRunerCount.donorRunnersCount.s_count,
            //       xs_tshirt: donorRunerCount.donorRunnersCount.xs_count,
            //       total: donorRunerCount.donorRunnersCount.runner_count,
            //       race_category_count: donorRunerCount.runCategoryCount,
            //       villaAndTowerRunCount: donorRunerCount.addressType,
            //     },
            //   },
            //   {
            //     donate_count: {
            //       participants_count: donateCount.donorRegCount,
            //       xxxl_tshirt: donateCount.donateRunnerCount.xxxl_count,
            //       xxl_tshirt: donateCount.donateRunnerCount.xxl_count,
            //       xl_tshirt: donateCount.donateRunnerCount.xl_count,
            //       l_tshirt: donateCount.donateRunnerCount.l_count,
            //       m_tshirt: donateCount.donateRunnerCount.m_count,
            //       s_tshirt: donateCount.donateRunnerCount.s_count,
            //       xs_tshirt: donateCount.donateRunnerCount.xs_count,
            //       total: donateCount.donateRunnerCount.runner_count,
            //       race_category_count: donateCount.runCategoryCount,
            //       villaAndTowerRunCount: donateCount.addressType,
            //     },
            //   },
            //   {
            //     corporate_sponsor: {
            //       participants_count: corporateCount.n,
            //       xxxl_tshirt: corporateCount.runnerCount.xxxl_count,
            //       xxl_tshirt: corporateCount.runnerCount.xxl_count,
            //       xl_tshirt: corporateCount.runnerCount.xl_count,
            //       l_tshirt: corporateCount.runnerCount.l_count,
            //       m_tshirt: corporateCount.runnerCount.m_count,
            //       s_tshirt: corporateCount.runnerCount.s_count,
            //       xs_tshirt: corporateCount.runnerCount.xs_count,
            //       total: corporateCount.runnerCount.runner_count,
            //       race_category_count: corporateCount.runCategoryCount,
            //       villaAndTowerRunCount: corporateCount.addressType,
            //     },
            //   },
            // ];
            // let jsonData = [
            //   {
            //     category: "marathon_runners_count",
            //     participants_count: marathonRunnersCount.totalMarathonCount,
            //     xxxl_tshirt:
            //       marathonRunnersCount.marathonRunnerCount.xxxl_count,
            //     xxl_tshirt: marathonRunnersCount.marathonRunnerCount.xxl_count,
            //     xl_tshirt: marathonRunnersCount.marathonRunnerCount.xl_count,
            //     l_tshirt: marathonRunnersCount.marathonRunnerCount.l_count,
            //     m_tshirt: marathonRunnersCount.marathonRunnerCount.m_count,
            //     s_tshirt: marathonRunnersCount.marathonRunnerCount.s_count,
            //     xs_tshirt: marathonRunnersCount.marathonRunnerCount.xs_count,
            //     total: marathonRunnersCount.marathonRunnerCount.runner_count,
            //     race_category_count_10k:
            //       marathonRunnersCount.runCategoryCount.count_10k,
            //     race_category_count_5k:
            //       marathonRunnersCount.runCategoryCount.count_5k,
            //     race_category_count_1k:
            //       marathonRunnersCount.runCategoryCount.count_1k,
            //     villaAndTowerRunCount_tower1:
            //       marathonRunnersCount.addressType.tower1_count,
            //     villaAndTowerRunCount_tower2:
            //       marathonRunnersCount.addressType.tower2_count,
            //     villaAndTowerRunCount_tower3:
            //       marathonRunnersCount.addressType.tower3_count,
            //     villaAndTowerRunCount_tower4:
            //       marathonRunnersCount.addressType.tower4_count,
            //     villaAndTowerRunCount_tower5:
            //       marathonRunnersCount.addressType.tower5_count,
            //     villaAndTowerRunCount_tower6:
            //       marathonRunnersCount.addressType.tower6_count,
            //     villaAndTowerRunCount_tower7:
            //       marathonRunnersCount.addressType.tower7_count,
            //     villaAndTowerRunCount_villacount:
            //       marathonRunnersCount.addressType.villa_count,
            //   },
            //   {
            //     category: "donor_with_runner_count",
            //     participants_count: donorRunerCount.totalDonorRunnerCount,
            //     xxxl_tshirt: donorRunerCount.donorRunnersCount.xxxl_count,
            //     xxl_tshirt: donorRunerCount.donorRunnersCount.xxl_count,
            //     xl_tshirt: donorRunerCount.donorRunnersCount.xl_count,
            //     l_tshirt: donorRunerCount.donorRunnersCount.l_count,
            //     m_tshirt: donorRunerCount.donorRunnersCount.m_count,
            //     s_tshirt: donorRunerCount.donorRunnersCount.s_count,
            //     xs_tshirt: donorRunerCount.donorRunnersCount.xs_count,
            //     total: donorRunerCount.donorRunnersCount.runner_count,
            //     // race_category_count: donorRunerCount.runCategoryCount,
            //     // villaAndTowerRunCount: donorRunerCount.addressType
            //     race_category_count_10k:
            //       marathonRunnersCount.runCategoryCount.count_10k,
            //     race_category_count_5k:
            //       marathonRunnersCount.runCategoryCount.count_5k,
            //     race_category_count_1k:
            //       marathonRunnersCount.runCategoryCount.count_1k,
            //     villaAndTowerRunCount_tower1:
            //       marathonRunnersCount.addressType.tower1_count,
            //     villaAndTowerRunCount_tower2:
            //       marathonRunnersCount.addressType.tower2_count,
            //     villaAndTowerRunCount_tower3:
            //       marathonRunnersCount.addressType.tower3_count,
            //     villaAndTowerRunCount_tower4:
            //       marathonRunnersCount.addressType.tower4_count,
            //     villaAndTowerRunCount_tower5:
            //       marathonRunnersCount.addressType.tower5_count,
            //     villaAndTowerRunCount_tower6:
            //       marathonRunnersCount.addressType.tower6_count,
            //     villaAndTowerRunCount_tower7:
            //       marathonRunnersCount.addressType.tower7_count,
            //     villaAndTowerRunCount_villacount:
            //       marathonRunnersCount.addressType.villa_count,
            //   },
            //   {
            //     category: "donate_count",
            //     participants_count: donateCount.donorRegCount,
            //     xxxl_tshirt: donateCount.donateRunnerCount.xxxl_count,
            //     xxl_tshirt: donateCount.donateRunnerCount.xxl_count,
            //     xl_tshirt: donateCount.donateRunnerCount.xl_count,
            //     l_tshirt: donateCount.donateRunnerCount.l_count,
            //     m_tshirt: donateCount.donateRunnerCount.m_count,
            //     s_tshirt: donateCount.donateRunnerCount.s_count,
            //     xs_tshirt: donateCount.donateRunnerCount.xs_count,
            //     total: donateCount.donateRunnerCount.runner_count,
            //     // race_category_count: donateCount.runCategoryCount,
            //     // villaAndTowerRunCount: donateCount.addressType,
            //     race_category_count_10k:
            //       marathonRunnersCount.runCategoryCount.count_10k,
            //     race_category_count_5k:
            //       marathonRunnersCount.runCategoryCount.count_5k,
            //     race_category_count_1k:
            //       marathonRunnersCount.runCategoryCount.count_1k,
            //     villaAndTowerRunCount_tower1:
            //       marathonRunnersCount.addressType.tower1_count,
            //     villaAndTowerRunCount_tower2:
            //       marathonRunnersCount.addressType.tower2_count,
            //     villaAndTowerRunCount_tower3:
            //       marathonRunnersCount.addressType.tower3_count,
            //     villaAndTowerRunCount_tower4:
            //       marathonRunnersCount.addressType.tower4_count,
            //     villaAndTowerRunCount_tower5:
            //       marathonRunnersCount.addressType.tower5_count,
            //     villaAndTowerRunCount_tower6:
            //       marathonRunnersCount.addressType.tower6_count,
            //     villaAndTowerRunCount_tower7:
            //       marathonRunnersCount.addressType.tower7_count,
            //     villaAndTowerRunCount_villacount:
            //       marathonRunnersCount.addressType.villa_count,
            //   },
            //   {
            //     category: "corporate_sponsor",
            //     participants_count: corporateCount.n,
            //     xxxl_tshirt: corporateCount.runnerCount.xxxl_count,
            //     xxl_tshirt: corporateCount.runnerCount.xxl_count,
            //     xl_tshirt: corporateCount.runnerCount.xl_count,
            //     l_tshirt: corporateCount.runnerCount.l_count,
            //     m_tshirt: corporateCount.runnerCount.m_count,
            //     s_tshirt: corporateCount.runnerCount.s_count,
            //     xs_tshirt: corporateCount.runnerCount.xs_count,
            //     total: corporateCount.runnerCount.runner_count,
            //     // race_category_count: corporateCount.runCategoryCount,
            //     // villaAndTowerRunCount: corporateCount.addressType,
            //     race_category_count_10k:
            //       marathonRunnersCount.runCategoryCount.count_10k,
            //     race_category_count_5k:
            //       marathonRunnersCount.runCategoryCount.count_5k,
            //     race_category_count_1k:
            //       marathonRunnersCount.runCategoryCount.count_1k,
            //     villaAndTowerRunCount_tower1:
            //       marathonRunnersCount.addressType.tower1_count,
            //     villaAndTowerRunCount_tower2:
            //       marathonRunnersCount.addressType.tower2_count,
            //     villaAndTowerRunCount_tower3:
            //       marathonRunnersCount.addressType.tower3_count,
            //     villaAndTowerRunCount_tower4:
            //       marathonRunnersCount.addressType.tower4_count,
            //     villaAndTowerRunCount_tower5:
            //       marathonRunnersCount.addressType.tower5_count,
            //     villaAndTowerRunCount_tower6:
            //       marathonRunnersCount.addressType.tower6_count,
            //     villaAndTowerRunCount_tower7:
            //       marathonRunnersCount.addressType.tower7_count,
            //     villaAndTowerRunCount_villacount:
            //       marathonRunnersCount.addressType.villa_count,
            //   },
            // ];
            // console.log("line 327", jsonData);
            //const jsonData1 = jsonData[0]

            //           const csvFields = Object.keys(jsonData[0]);
            //           const csvOpts = {
            //             fields: csvFields,
            //             header: false, // Disable default header
            //           };

            //           const csvHeader = json2csv(
            //             {
            //               [csvFields[0]]: "Booking Table Id",
            //               [csvFields[1]]: "Reg Type Id",
            //               [csvFields[2]]: "Reg Class Id",
            //               [csvFields[3]]: "Certificate 80G",
            //               [csvFields[4]]: "80G url",
            //               [csvFields[5]]: "Event Id",
            //               [csvFields[6]]: "Registrant Id",
            //               [csvFields[7]]: "Runner Count",
            //               [csvFields[8]]: "Created At",
            //               [csvFields[9]]: "Updated At",
            //               [csvFields[10]]: "Reg Id",
            //               [csvFields[11]]: "Booking Id",
            //               [csvFields[12]]: "First Name",
            //               [csvFields[13]]: "Middle Name",
            //               [csvFields[14]]: "Last Name",
            //               [csvFields[15]]:"Email Id",
            //               [csvFields[16]]:"Mobile Number",
            //               [csvFields[17]]:"Address",
            //               [csvFields[18]]:"Pancard Number",
            //                [csvFields[19]]:"Role",
            //                 [csvFields[20]]: "Reg Category",
            //                 [csvFields[21]]:"Reg Type"

            //             },
            //             { header: false }
            //           );
            //           console.log(csvHeader);
            //           const csvData = json2csv(jsonData, csvOpts);

            //           console.log(csvData);
            //           // Combine the custom header with the CSV data
            //             const csvContent = `${csvHeader}\n ${csvData}`;
            // console.log(csvContent);
            //           // Set response headers
            //           res.header("Content-Type", "csv");
            //           res.attachment("output.csv");

            // Send CSV data in the response
            // jsonData.forEach(item => {
            //   if (item.runner_address) {
            //     item.runner_address = item.runner_address.replace(/,/g, ' ');
            //   }
            // });

            // // Extract all unique column headers from the data
            // const allColumns = Array.from(
            //   new Set(jsonData.flatMap((row) => Object.keys(row)))
            // );
            // console.log("aline 114", allColumns);
            // const csvHeader = allColumns.join(",");
            // console.log("line 118", csvHeader);

            // // Create CSV data
            // const csvData = jsonData
            //   .map((row) => {
            //     return allColumns
            //       .map((column) => {
            //         if (row[column] !== undefined) {
            //           // Check if the property is an object
            //           if (typeof row[column] === "object") {
            //             // Flatten the nested object and include its individual properties
            //             return Object.values(row[column]).join(",");
            //           } else {
            //             return row[column];
            //           }
            //         } else {
            //           return "";
            //         }
            //       })
            //       .join(",");
            //   })
            //   .join("\n");

            // // Create CSV header
            // const csvHeader = allColumns.join(',');
            // const csvData = jsonData.map(row => {
            //   return allColumns.map(column => {
            //     if (row[column] !== undefined) {
            //       // Check if the property is an object
            //       if (typeof row[column] === 'object') {
            //         // Flatten the nested object and include its individual properties
            //         return Object.values(row[column]).join(',');
            //       } else {
            //         return row[column];
            //       }
            //     } else {
            //       return '';
            //     }
            //   }).join(',');
            // }).join('\n');
            // console.log("line 118", csvHeader);
            // //Create CSV data
            // // const csvData = jsonData.map(row =>
            // //   allColumns.map(column => (row[column] !== undefined ? row[column] : '')).join(',')
            // // ).join('\n');
            // //console.log("line 123", csvData);
            // Set response headers
            // res.setHeader("Content-Type", "text/csv");
            // res.setHeader(
            //   "Content-Disposition",
            //   "attachment; filename=output.csv"
            // );
            // res.status(200).send(`${csvHeader}\n${csvData}`);
            // res.status(200).send(`${allColumns.join(',')}\n${csvData}`);

            // res.status(200).json(csvContent);

            //pdf
            // Create a PDF document
            // const doc = new PDFDocument();

            // // Buffer to store PDF
            // const buffers = [];

            // // When PDF is finished, send it in the response
            // doc.on('end', () => {
            //   const pdfBuffer = Buffer.concat(buffers);

            //   // Set headers for PDF download
            //   res.setHeader('Content-Type', 'application/pdf');
            //   res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

            //   // Send the PDF as the response
            //   res.send(pdfBuffer);
            // });

            // // Pipe the PDF output to a buffer
            // doc.pipe(new require('stream').Writable({
            //   write(chunk, encoding, next) {
            //     buffers.push(chunk);
            //     next();
            //   },
            // }));

            // // Add content to the PDF
            // doc.fontSize(12);
            // doc.text('JSON to PDF Example', { align: 'center' });
            // doc.moveDown();

            // jsonData.forEach((item, index) => {
            //   doc.text(`Entry #${index + 1}:`);
            //   doc.moveDown();
            //   Object.keys(item).forEach(key => {
            //     doc.text(`${key}: ${item[key]}`);
            //   });
            //   doc.moveDown();
            // });

            // // Finalize the PDF
            // doc.end();

            //pdf

            // const runCatName = await db.sequelize.query(query.runCat, {
            //                     type: QueryTypes.SELECT,
            //                   });
            //                   const marathonRunnersCount = await marathonRunnerCount(
            //                     event_id,
            //                     runCatName
            //                   );

            //                   const donorRunerCount = await donorWithRunnerCount(
            //                     event_id,
            //                     runCatName
            //                   );
            //                   // console.log("..........", donorRunerCount);
            //                   const donateCount = await donateRegCount(event_id);
            //                   const corporateCount = await corpCount(event_id, runCatName);
            //                   //console.log("line102: ", corporateCount);

            //                   let jsonData = [
            //                     {
            //                       marathon_runners_count: {
            //                         participants_count:
            //                           marathonRunnersCount.totalMarathonCount,
            //                         xxxl_tshirt:
            //                           marathonRunnersCount.marathonRunnerCount.xxxl_count,
            //                         xxl_tshirt:
            //                           marathonRunnersCount.marathonRunnerCount.xxl_count,
            //                         xl_tshirt:
            //                           marathonRunnersCount.marathonRunnerCount.xl_count,
            //                         l_tshirt:
            //                           marathonRunnersCount.marathonRunnerCount.l_count,
            //                         m_tshirt:
            //                           marathonRunnersCount.marathonRunnerCount.m_count,
            //                         s_tshirt:
            //                           marathonRunnersCount.marathonRunnerCount.s_count,
            //                         xs_tshirt:
            //                           marathonRunnersCount.marathonRunnerCount.xs_count,
            //                         total:
            //                           marathonRunnersCount.marathonRunnerCount.runner_count,
            //                         race_category_count:
            //                           marathonRunnersCount.runCategoryCount,
            //                         villaAndTowerRunCount: marathonRunnersCount.addressType,
            //                       },
            //                     },
            //                     {
            //                       donor_with_runner_count: {
            //                         participants_count: donorRunerCount.totalDonorRunnerCount,
            //                         xxxl_tshirt: donorRunerCount.donorRunnersCount.xxxl_count,
            //                         xxl_tshirt: donorRunerCount.donorRunnersCount.xxl_count,
            //                         xl_tshirt: donorRunerCount.donorRunnersCount.xl_count,
            //                         l_tshirt: donorRunerCount.donorRunnersCount.l_count,
            //                         m_tshirt: donorRunerCount.donorRunnersCount.m_count,
            //                         s_tshirt: donorRunerCount.donorRunnersCount.s_count,
            //                         xs_tshirt: donorRunerCount.donorRunnersCount.xs_count,
            //                         total: donorRunerCount.donorRunnersCount.runner_count,
            //                         race_category_count: donorRunerCount.runCategoryCount,
            //                         villaAndTowerRunCount: donorRunerCount.addressType,
            //                       },
            //                     },
            //                     {
            //                       donate_count: {
            //                         participants_count: donateCount.donorRegCount,
            //                         xxxl_tshirt: donateCount.donateRunnerCount.xxxl_count,
            //                         xxl_tshirt: donateCount.donateRunnerCount.xxl_count,
            //                         xl_tshirt: donateCount.donateRunnerCount.xl_count,
            //                         l_tshirt: donateCount.donateRunnerCount.l_count,
            //                         m_tshirt: donateCount.donateRunnerCount.m_count,
            //                         s_tshirt: donateCount.donateRunnerCount.s_count,
            //                         xs_tshirt: donateCount.donateRunnerCount.xs_count,
            //                         total: donateCount.donateRunnerCount.runner_count,
            //                         race_category_count: donateCount.runCategoryCount,
            //                         villaAndTowerRunCount: donateCount.addressType,
            //                       },
            //                     },
            //                     {
            //                       corporate_sponsor: {
            //                         participants_count: corporateCount.n,
            //                         xxxl_tshirt: corporateCount.runnerCount.xxxl_count,
            //                         xxl_tshirt: corporateCount.runnerCount.xxl_count,
            //                         xl_tshirt: corporateCount.runnerCount.xl_count,
            //                         l_tshirt: corporateCount.runnerCount.l_count,
            //                         m_tshirt: corporateCount.runnerCount.m_count,
            //                         s_tshirt: corporateCount.runnerCount.s_count,
            //                         xs_tshirt: corporateCount.runnerCount.xs_count,
            //                         total: corporateCount.runnerCount.runner_count,
            //                         race_category_count: corporateCount.runCategoryCount,
            //                         villaAndTowerRunCount: corporateCount.addressType,
            //                       },
            //                     },
            //                   ];

            //                   const jsonData1 = jsonData;

            //                   jsonData.forEach(item => {
            //                     if (item.address) {
            //                       item.address = item.address.replace(/,/g, ' ');
            //                     }
            //                   });

            // // // Extract all unique column headers from the data
            // const allColumns = Array.from(
            //   new Set(jsonData.flatMap((row) => Object.keys(row)))
            // );
            // console.log("aline 114", allColumns);
            // const csvHeader = allColumns.join(",");
            // console.log("line 118", csvHeader);

            // // Create CSV data
            // const csvData = jsonData
            //   .map((row) => {
            //     return allColumns
            //       .map((column) => {
            //         if (row[column] !== undefined) {
            //           // Check if the property is an object
            //           if (typeof row[column] === "object") {
            //             // Flatten the nested object and include its individual properties
            //             return Object.values(row[column]).join(",");
            //           } else {
            //             return row[column];
            //           }
            //         } else {
            //           return "";
            //         }
            //       })
            //       .join(",");
            //   })
            //   .join("\n");

            // // Set response headers
            // res.setHeader("Content-Type", "text/csv");
            // res.setHeader(
            //   "Content-Disposition",
            //   "attachment; filename=output.csv"
            // );
            // res.status(200).send(`${csvHeader}\n${csvData}`);
          } else {
            if (report_type == "donor_with_runners") {
              console.log("Called");
              const reg_type = "donors with runners";
              //get the type id for the registrant
              const reg_type_id = await regTypeId(reg_type);
              console.log("line New", reg_type_id[0].type_id)
              const regList = await db.sequelize.query(query.getRunners, {
                replacements:[reg_type_id[0].type_id,parseInt(event_id)],
                type:QueryTypes.SELECT
              });
              console.log("Line super New",regList.length)
              //get paid registrant id from order_info
              // const orderStatus = await db.sequelize.query(query.paidRegId, {
              //   replacements: [event_id],
              //   type: QueryTypes.SELECT,
              // });
              // //get order status successed booking list
              // const bookingList = await getBookingList(
              //   orderStatus,
              //   reg_type_id[0].type_id
              // );
              // //from boooking id get registrant info
              // const regList = await getRegList(bookingList);
              // //console.log(regList);
              // //merger booking data and regData
              // const result = await mergeResult(bookingList, regList);
              // // get registrant class name
              // const reg_class = await regClass(result, reg_type);

              if (regList[0] !== undefined) {
                const jsonData = regList;

                jsonData.forEach((item) => {
                  if (item.address) {
                    item.address = item.address.replace(/,/g, " ");
                  }
                });

                // Extract all unique column headers from the data
                const allColumns = Array.from(
                  new Set(jsonData.flatMap((row) => Object.keys(row)))
                );
                console.log("aline 114", allColumns);

                // Create CSV header
                const csvHeader = allColumns.join(",");
                console.log("line 118", csvHeader);
                //Create CSV data
                const csvData = jsonData
                  .map((row) =>
                    allColumns
                      .map((column) =>
                        row[column] !== undefined ? row[column] : ""
                      )
                      .join(",")
                  )
                  .join("\n");
                //console.log("line 123", csvData);
                // Set response headers
                res.setHeader("Content-Type", "text/csv");
                res.setHeader(
                  "Content-Disposition",
                  "attachment; filename=output.csv"
                );
                // res.status(200).send(`${csvHeader}\n${csvData}`);
                res.status(200).send(`${allColumns.join(",")}\n${csvData}`);
              }
            } else if (report_type == "bib_collection_report") {
              try {
                const result1 = await getBibcollectionrunnercount();
                const result2 = await get_registrantdetails_for_bibcollection(result1);
                //console.log(result2);
                //const merge = await mergeArray1(result1, result2);
            
                const result3 = await getTshirt_size(result2);
                const mergedArray = [].concat(...result3);
                const result4 = await mergeArrays1(result1, mergedArray);
                //console.log(result4);
                const result5 = await mergeArrays2(result4, result2);
                // console.log(result1);
                // console.log(result2);
                // console.log(mergedArray);
                const result6 = await get_runners_booking_info();
                const result7 = await get_runner_type_value(result6);
                const flattenedArrayresult7 = result7.flat();
                const result8 = await mergeArrays3(result6, flattenedArrayresult7);
                const result9 = await mergeArray4(result5, result8);
            
            
                //console.log(result9);
                if (result9) {
                  //Convert data to CSV string
                  csv.stringify(result9, { header: true }, (err, csvString) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send("Internal Server Error");
                    }
            
                    // Send the CSV string as a response
                    res.header("Content-Type", "text/csv");
                    res.attachment("output.csv");
                    res.send(csvString);
                  });
                  //res.status(200).json(result9)
                } else {
                  res.status(400).send("no merged data available");
                }
              } catch (error) {
                console.log(error);
                return res.status(400).send("no data available");
              }
            } else {
              if (report_type == "donate") {
                const reg_type = "donate";
                //get the type id for the registrant
                const donateCount = await db.sequelize.query(query.getDonorCount,{
                  replacements:[parseInt(event_id)],
                  type:QueryTypes.SELECT
                });
                // const reg_type_id = await regTypeId(reg_type);
                // //get paid registrant id from order_info
                // const orderStatus = await db.sequelize.query(query.paidRegId, {
                //   replacements: [event_id],
                //   type: QueryTypes.SELECT,
                // });
                // //get order status successed booking list
                // const bookingList = await getBookingList(
                //   orderStatus,
                //   reg_type_id[0].type_id
                // );
                // //from boooking id get registrant info
                // const regList = await getRegList(bookingList);
                // //merger booking data and regData
                // const result = await mergeResult(bookingList, regList);
                // // get registrant class name
                // const reg_class = await regClass(result, reg_type);

                console.log(donateCount)

                const jsonData = donateCount;

                jsonData.forEach((item) => {
                  if (item.address) {
                    item.address = item.address.replace(/,/g, " ");
                  }
                });

                // Extract all unique column headers from the data
                const allColumns = Array.from(
                  new Set(jsonData.flatMap((row) => Object.keys(row)))
                );
                console.log("aline 114", allColumns);

                // Create CSV header
                const csvHeader = allColumns.join(",");
                console.log("line 118", csvHeader);
                //Create CSV data
                const csvData = jsonData
                  .map((row) =>
                    allColumns
                      .map((column) =>
                        row[column] !== undefined ? row[column] : ""
                      )
                      .join(",")
                  )
                  .join("\n");
                //console.log("line 123", csvData);
                // Set response headers
                res.setHeader("Content-Type", "text/csv");
                res.setHeader(
                  "Content-Disposition",
                  "attachment; filename=output.csv"
                );
                // res.status(200).send(`${csvHeader}\n${csvData}`);
                res.status(200).send(`${allColumns.join(",")}\n${csvData}`);
              } else {
                if (report_type == "bib_report") {
                  const bibreport = await bibReport(event_id);
                  const jsonData = bibreport;
                  //  console.log(bibReport);
                  //  res.status(200).json(bibreport)

                  // const csvFields = Object.keys(jsonData[0]);
                  // const csvHeader = csvFields.join(",");
                  // const csvData = jsonData
                  //   .map((row) =>
                  //     csvFields.map((field) => row[field]).join(",")
                  //   )
                  //   .join("\n");

                  // // Set response headers
                  // res.setHeader("Content-Type", "text/csv");
                  // res.setHeader(
                  //   "Content-Disposition",
                  //   "attachment; filename=bib_report.csv"
                  // );

                  // // Send CSV data in the response
                  // const csvContent = `${csvHeader}\n${csvData}`;

                  // res.status(200).send(`${csvHeader}\n${csvData}`);


                  jsonData.forEach((item) => {
                    if (item.runner_address) {
                      item.runner_address = item.runner_address.replace(/,/g, " ");
                    }
                  });

                  // Extract all unique column headers from the data
                  const allColumns = Array.from(
                    new Set(jsonData.flatMap((row) => Object.keys(row)))
                  );
                  console.log("aline 114", allColumns);

                  // Create CSV header
                  const csvHeader = allColumns.join(",");
                  console.log("line 118", csvHeader);
                  //Create CSV data
                  const csvData = jsonData
                    .map((row) =>
                      allColumns
                        .map((column) =>
                          row[column] !== undefined ? row[column] : ""
                        )
                        .join(",")
                    )
                    .join("\n");
                  //console.log("line 123", csvData);
                  // Set response headers
                  res.setHeader("Content-Type", "text/csv");
                  res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=output.csv"
                  );
                  // res.status(200).send(`${csvHeader}\n${csvData}`);
                  res.status(200).send(`${allColumns.join(",")}\n${csvData}`);

                  // res.status(200).json(runnerCat);

                }else{
                  if(report_type === "bib_collection_report_v1"){
                    const bibreport = await bibCollectionReportV1(event_id);
                    const jsonData = bibreport;
                    //  console.log(bibReport);
                    //  res.status(200).json(bibreport)
  
                    // const csvFields = Object.keys(jsonData[0]);
                    // const csvHeader = csvFields.join(",");
                    // const csvData = jsonData
                    //   .map((row) =>
                    //     csvFields.map((field) => row[field]).join(",")
                    //   )
                    //   .join("\n");
  
                    // // Set response headers
                    // res.setHeader("Content-Type", "text/csv");
                    // res.setHeader(
                    //   "Content-Disposition",
                    //   "attachment; filename=bib_report.csv"
                    // );
  
                    // // Send CSV data in the response
                    // const csvContent = `${csvHeader}\n${csvData}`;
  
                    // res.status(200).send(`${csvHeader}\n${csvData}`);
  
  
                    // jsonData.forEach((item) => {
                    //   if (item.runner_address) {
                    //     item.runner_address = item.runner_address.replace(/,/g, " ");
                    //   }
                    // });
  
                    // // Extract all unique column headers from the data
                    // const allColumns = Array.from(
                    //   new Set(jsonData.flatMap((row) => Object.keys(row)))
                    // );
                    // console.log("aline 114", allColumns);
  
                    // // Create CSV header
                    // const csvHeader = allColumns.join(",");
                    // console.log("line 118", csvHeader);
                    // //Create CSV data
                    // const csvData = jsonData
                    //   .map((row) =>
                    //     allColumns
                    //       .map((column) =>
                    //         row[column] !== undefined ? row[column] : ""
                    //       )
                    //       .join(",")
                    //   )
                    //   .join("\n");
                    // //console.log("line 123", csvData);
                    // // Set response headers
                    // res.setHeader("Content-Type", "text/csv");
                    // res.setHeader(
                    //   "Content-Disposition",
                    //   "attachment; filename=output.csv"
                    // );
                    // // res.status(200).send(`${csvHeader}\n${csvData}`);
                    // res.status(200).send(`${allColumns.join(",")}\n${csvData}`);

                
                    jsonData.forEach((item) => {
                      if (item.address) {
                        item.address = item.external_address.replace(/,/g, " ");
                      }
                    });
  
                    // Extract all unique column headers from the data
                    const allColumns = Array.from(
                      new Set(jsonData.flatMap((row) => Object.keys(row)))
                    );
                    console.log("aline 114", allColumns);
  
                    // Create CSV header
                    const csvHeader = allColumns.join(",");
                    console.log("line 118", csvHeader);
                    //Create CSV data
                    const csvData = jsonData
                      .map((row) =>
                        allColumns
                          .map((column) =>
                            row[column] !== undefined ? row[column] : ""
                          )
                          .join(",")
                      )
                      .join("\n");
                    //console.log("line 123", csvData);
                    // Set response headers
                    res.setHeader("Content-Type", "text/csv");
                    res.setHeader(
                      "Content-Disposition",
                      "attachment; filename=output.csv"
                    );
                    // res.status(200).send(`${csvHeader}\n${csvData}`);
                    res.status(200).send(`${allColumns.join(",")}\n${csvData}`);


                  }
                  else{
                    if(report_type=="overall"){
                      const overAll = await db.sequelize.query(query.getOverAll,{
                        replacements:[parseInt(event_id)],
                        type:QueryTypes.SELECT
                      })
                      if (overAll[0] !== undefined) {
                        const jsonData = overAll;
              
                        jsonData.forEach((item) => {
                          if (item.address) {
                            item.address = item.address.replace(/,/g, " ");
                          }
                        });
              
                        // Extract all unique column headers from the data
                        const allColumns = Array.from(
                          new Set(jsonData.flatMap((row) => Object.keys(row)))
                        );
                        console.log("aline 114", allColumns);
              
                        // Create CSV header
                        const csvHeader = allColumns.join(",");
                        console.log("line 118", csvHeader);
                        //Create CSV data
                        const csvData = jsonData
                          .map((row) =>
                            allColumns
                              .map((column) => (row[column] !== undefined ? row[column] : ""))
                              .join(",")
                          )
                          .join("\n");
                        //console.log("line 123", csvData);
                        // Set response headers
                        res.setHeader("Content-Type", "text/csv");
                        res.setHeader(
                          "Content-Disposition",
                          "attachment; filename=output.csv"
                        );
                        // res.status(200).send(`${csvHeader}\n${csvData}`);
                        res.status(200).send(`${allColumns.join(",")}\n${csvData}`);
                      } else {
                        res.status(201).json([]);
                      }

                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const addRunCat = async (runner) => {
  return new Promise(async (resolve, reject) => {
    let result1 = [];
    for (let i = 0; i < runner.length; i++) {
      const data = await db.sequelize.query(query.getRunCat, {
        replacements: [runner[i].run_category_id_ref],
        type: QueryTypes.SELECT,
      });
      //console.log("line113: ", data[0].race_type_name);
      let merge = { ...runner[i], ...{ race_type: data[0].race_type_name } };
      //console.log(merge);
      result1.push(merge);
    }
    if (runner.length === result1.length) {
      return resolve(result1);
    }
  });
};

const regTypeId = async (reg_type) => {
  return new Promise(async (resolve, reject) => {
    const result = await db.sequelize.query(query.regType, {
      replacements: [reg_type],
      type: QueryTypes.SELECT,
    });
    // console.log("test", result);
    if (result[0] !== undefined) {
      return resolve(result);
    }
  });
};

const getRegList = async (bookingList) => {
  return new Promise(async (resolve, reject) => {
    let data = [];
    for (let i = 0; i < bookingList.length; i++) {
      const result = await db.sequelize.query(query.getRegList, {
        replacements: [bookingList[i].booking_id],
        type: QueryTypes.SELECT,
      });

      if (result[0] !== undefined) {
        data.push(result[0]);
      }
    }
    //if (data.length === bookingList.length) {
    //console.log(data);
    return resolve(data);

    //}
  });
};
const getBookingList = async (orderStatus, type_id) => {
  return new Promise(async (resolve, reject) => {
    let data = [];
    //let count=0;
    for (let i = 0; i < orderStatus.length; i++) {
      const result = await db.sequelize.query(query.bookingList, {
        replacements: [orderStatus[i].booking_id_ref, type_id],
        type: QueryTypes.SELECT,
      });
      //console.log(result);
      if (result[0] !== undefined) {
        data.push(result[0]);
        //count++;
      }
    }
    if (data[0] !== undefined) {
      return resolve(data);
    } else {
      return resolve([]);
    }
  });
};

const mergeResult = async (bookingList, regList) => {
  return new Promise((resolve, reject) => {
    let result = [];

    bookingList.forEach((obj) => {
      let matchObj = regList.find(
        (obj1) => obj1.registrant_id_ref === obj.registrant_id_ref
      );

      if (matchObj) {
        let merge = { ...obj, ...matchObj };
        result.push(merge);
      }
    });

    // if (bookingList.length === result.length) {
    return resolve(result);
    //}
  });
};

const regClass = async (result, regType) => {
  return new Promise(async (resolve, reject) => {
    let result1 = [];
    for (let i = 0; i < result.length; i++) {
      const data = await db.sequelize.query(query.getRegClass, {
        replacements: [result[i].registrant_class_ref],
        //Added by Rishi on 11/3/24 -- changed registrant data to runner data
        //replacements: [result[i].run_category_id_ref],
        type: QueryTypes.SELECT,
      });
      //Added by Rishi on 11/3/24 -- changed registrant data to runner data
      // const data2 = await db.sequelize.query(query.getRunAgeClass, {
      //   replacements: [result[i].registrant_class_ref],
      //   //Added by Rishi on 11/3/24 -- changed registrant data to runner data
      //   //replacements: [result[i].age_type_id_ref],
      //   type: QueryTypes.SELECT,
      // });
      // if(data2[0] != undefined && data[0] != undefined){
      //   if(data2[0].age_type_id != undefined && data2[0].age_type_name != undefined && data[0].race_type_id != undefined && data[0].race_type_name != undefined){
      //     let merge = {
      //       ...result[i],
      //       ...{ age_type_name: data2[0].age_type_name},
      //       ...{ race_type_name: data[0].race_type_name },
      //       //...{ reg_type: regType },
      //     };
      //     result1.push(merge);
      //   }
      //   else{
      //     let merge = {
      //       ...result[i],
      //       ...{ age_type_name: null},
      //       ...{ race_type_name: null },
      //       //...{ reg_type: regType },
      //     };
      //     result1.push(merge);
      //   }
      // }
      let merge = {
        ...result[i],
        //...{ age_type_name: data2[0].age_type_name},
        ...{ category_name: data[0].category_name },
        ...{ reg_type: regType },
      };
      result1.push(merge);
    }
    console.log(result1);
    // if (result.length === result1.length) {
    return resolve(result1);
    // }
  });
};

const donorWithRunnerCount = async (event_id, runCatName) => {
  return new Promise(async (resolve, reject) => {
    const reg_type = "donors with runners";
    //get the type id for the registrant
    const reg_type_id = await regTypeId(reg_type);
    //console.log(reg_type_id);
    //get paid registrant id from order_info
    const orderStatus = await db.sequelize.query(query.paidRegId, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    //console.log(orderStatus);
    //get order status successed booking list
    const bookingList = await getBookingList(
      orderStatus,
      reg_type_id[0].type_id
    );
    let donorRegCount = bookingList.length;
    //console.log("line238", donorRegCount);
    //from boooking id get registrant info

    const runCategoryCount = await runTypeCount(bookingList, runCatName);
    //console.log("line341   :",runCategoryCount);
    if (bookingList.length > 0) {
      const donorRunnersCount = await getRunnerCount(bookingList);
      //console.log("line", donorRunnersCount);

      const totalDonorRunnerCount =
        donorRegCount + donorRunnersCount.runner_count;

      const addressType = await addressTypeCount(bookingList);
      return resolve({
        totalDonorRunnerCount,
        donorRunnersCount,
        runCategoryCount,
        addressType,
      });
    } else {
      const totalDonorRunnerCount = donorRegCount;
      let donorRunnersCount = {
        xxxl_count: 0,
        xxl_count: 0,
        xl_count: 0,
        l_count: 0,
        m_count: 0,
        s_count: 0,
        xs_count: 0,
        runner_count: 0,
      };
      let addressType = {
        villa_count: villaCount,
        tower1_count: 0,
        tower2_count: 0,
        tower3_count: 0,
        tower4_count: 0,
        tower5_count: 0,
        tower6_count: 0,
        tower7_count: 0,
      };
      return resolve({
        totalDonorRunnerCount,
        donorRunnersCount,
        runCategoryCount,
        addressType,
      });
    }
    //console.log(totalMarathonCount);
  });
};

const marathonRunnerCount = async (event_id, runCatName) => {
  return new Promise(async (resolve, reject) => {
    const reg_type = "marathon runners";
    //get the type id for the registrant
    const reg_type_id = await regTypeId(reg_type);
    //get paid registrant id from order_info
    const orderStatus = await db.sequelize.query(query.paidRegId, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    //get order status successed booking list
    const bookingList = await getBookingList(
      orderStatus,
      reg_type_id[0].type_id
    );
    let marathonRegCount = bookingList.length;
    //from boooking id get registrant info
    if (bookingList.length > 0) {
      const runCategoryCount = await runTypeCount(bookingList, runCatName);

      const marathonRunnerCount = await getRunnerCount(bookingList);

      const totalMarathonCount =
        marathonRegCount + marathonRunnerCount.runner_count;
      // filter the villa and tower  runners with booking list
      const addressType = await addressTypeCount(bookingList);
      //console.log(totalMarathonCount);
      return resolve({
        totalMarathonCount,
        marathonRunnerCount,
        runCategoryCount,
        addressType,
      });
    } else {
      let marathonRunnerCount = {
        xxxl_count: 0,
        xxl_count: 0,
        xl_count: 0,
        l_count: 0,
        m_count: 0,
        s_count: 0,
        xs_count: 0,
        runner_count: 0,
      };

      let addressType = {
        villa_count: villaCount,
        tower1_count: 0,
        tower2_count: 0,
        tower3_count: 0,
        tower4_count: 0,
        tower5_count: 0,
        tower6_count: 0,
        tower7_count: 0,
      };
      const totalMarathonCount = marathonRegCount;
      return resolve(
        totalMarathonCount,
        marathonRunnerCount,
        runCategoryCount,
        addressType
      );
    }
  });
};

const donateRegCount = async (event_id) => {
  return new Promise(async (resolve, reject) => {
    const reg_type = "donate";
    //console.log("donate");
    //get the type id for the registrant
    const reg_type_id = await regTypeId(reg_type);
    //get paid registrant id from order_info
    const orderStatus = await db.sequelize.query(query.paidRegId, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    //get order status successed booking list
    const bookingList = await getBookingList(
      orderStatus,
      reg_type_id[0].type_id
    );
    let donorRegCount = bookingList.length;

    const addressType = await addrTypeCountForDonate(bookingList);

    let runCategoryCount = { count_10k: 0, count_5k: 0, count_1k: 0 };
    let donateRunnerCount = {
      xxxl_count: 0,
      xxl_count: 0,
      xl_count: 0,
      l_count: 0,
      m_count: 0,
      s_count: 0,
      xs_count: 0,
      runner_count: 0,
    };
    return resolve({
      donorRegCount,
      donateRunnerCount,
      runCategoryCount,
      addressType,
    });
  });
};

const getRunnerCount = async (bookingList) => {
  return new Promise(async (resolve, reject) => {
    let result = 0;
    let count = 0;
    let xxxl = 0;
    let xxl = 0;
    let xl = 0;
    let l = 0;
    let m = 0;
    let s = 0;
    let xs = 0;

    for (let i = 0; i < bookingList.length; i++) {
      const data = await db.sequelize.query(query.runnerCount, {
        replacements: [bookingList[i].booking_id],
        type: QueryTypes.SELECT,
      });
      count++;
      /*---------------*/
      if (data[0] !== undefined) {
        const s_size = await db.sequelize.query(query.tshirtCount, {
          replacements: [bookingList[i].booking_id, "s"],
          type: QueryTypes.SELECT,
        });
        s += +s_size.length;

        const xxxl_size = await db.sequelize.query(query.tshirtCount, {
          replacements: [bookingList[i].booking_id, "xxxl"],
          type: QueryTypes.SELECT,
        });
        xxxl += +xxxl_size.length;

        const xxl_size = await db.sequelize.query(query.tshirtCount, {
          replacements: [bookingList[i].booking_id, "xxl"],
          type: QueryTypes.SELECT,
        });
        xxl += +xxl_size.length;

        const xl_size = await db.sequelize.query(query.tshirtCount, {
          replacements: [bookingList[i].booking_id, "xl"],
          type: QueryTypes.SELECT,
        });
        xl += +xl_size.length;

        const l_size = await db.sequelize.query(query.tshirtCount, {
          replacements: [bookingList[i].booking_id, "l"],
          type: QueryTypes.SELECT,
        });
        l += +l_size.length;

        const m_size = await db.sequelize.query(query.tshirtCount, {
          replacements: [bookingList[i].booking_id, "m"],
          type: QueryTypes.SELECT,
        });
        m += +m_size.length;

        const xs_size = await db.sequelize.query(query.tshirtCount, {
          replacements: [bookingList[i].booking_id, "xs"],
          type: QueryTypes.SELECT,
        });
        xs += +xs_size.length;

        result += +data.length;
        //console.log("line 247:", result);
      }
    }
    if ((count = bookingList.length)) {
      return resolve({
        runner_count: result,
        xxxl_count: xxxl,
        xxl_count: xxl,
        xl_count: xl,
        l_count: l,
        m_count: m,
        s_count: s,
        xs_count: xs,
      });
    }
  });
};

const corpCount = async (event_id, runCatName) => {
  return new Promise(async (resolve, reject) => {
    let xxxl = 0;
    let xxl = 0;
    let xl = 0;
    let l = 0;
    let m = 0;
    let s = 0;
    let xs = 0;
    const sponsorCount = await db.sequelize.query(query.corpCount, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    const runnerCount = await db.sequelize.query(query.corpRunnerCount, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    const runCategoryCount = await corpRunTypeCount(sponsorCount, runCatName);
    //console.log("line556: ",runCategoryCount);

    let n1 = sponsorCount.length;
    let n2 = runnerCount.length;
    if (sponsorCount[0] !== undefined) {
      //console.log("line326", sponsorCount);
      //console.log("line327", runnerCount);
      // let n1= sponsorCount.length;
      if (runnerCount[0] !== undefined) {
        // console.log(n1);
        // console.log(n2);
        let n = n1 + n1;

        const s_size = await db.sequelize.query(query.corpTshirtCount, {
          replacements: [event_id, "s"],
          type: QueryTypes.SELECT,
        });
        s += +s_size.length;
        const xxxl_size = await db.sequelize.query(query.corpTshirtCount, {
          replacements: [event_id, "xxxl"],
          type: QueryTypes.SELECT,
        });
        xxxl += +xxxl_size.length;
        const xxl_size = await db.sequelize.query(query.corpTshirtCount, {
          replacements: [event_id, "xxl"],
          type: QueryTypes.SELECT,
        });
        xxl += +xxl_size.length;
        const xl_size = await db.sequelize.query(query.corpTshirtCount, {
          replacements: [event_id, "xl"],
          type: QueryTypes.SELECT,
        });
        xl += +xl_size.length;
        const l_size = await db.sequelize.query(query.corpTshirtCount, {
          replacements: [event_id, "l"],
          type: QueryTypes.SELECT,
        });
        l += +l_size.length;
        const m_size = await db.sequelize.query(query.corpTshirtCount, {
          replacements: [event_id, "m"],
          type: QueryTypes.SELECT,
        });
        m += +m_size.length;
        const xs_size = await db.sequelize.query(query.corpTshirtCount, {
          replacements: [event_id, "xs"],
          type: QueryTypes.SELECT,
        });
        xs += +xs_size.length;

        let addressType = {
          villa_count: 0,
          tower1_count: 0,
          tower2_count: 0,
          tower3_count: 0,
          tower4_count: 0,
          tower5_count: 0,
          tower6_count: 0,
          tower7_count: 0,
        };
        let runnerCount = {
          xxxl_count: xxxl,
          xxl_count: xxl,
          xl_count: xl,
          l_count: l,
          m_count: m,
          s_count: s,
          xs_count: xs,
          runner_count: n2,
        };

        return resolve({ n, runnerCount, runCategoryCount, addressType });
      } else {
        let n = n1 + n2;
        let runnerCount = {
          xxxl_count: 0,
          xxl_count: 0,
          xl_count: 0,
          l_count: 0,
          m_count: 0,
          s_count: 0,
          xs_count: 0,
          runner_count: n2,
        };

        let addressType = {
          villa_count: 0,
          tower1_count: 0,
          tower2_count: 0,
          tower3_count: 0,
          tower4_count: 0,
          tower5_count: 0,
          tower6_count: 0,
          tower7_count: 0,
        };
        return resolve({ n, runnerCount, runCategoryCount, addressType });
      }
    } else {
      let runnerCount = {
        xxxl_count: 0,
        xxl_count: 0,
        xl_count: 0,
        l_count: 0,
        m_count: 0,
        s_count: 0,
        xs_count: 0,
        runner_count: n2,
      };
      return resolve({ n, runnerCount, runCategoryCount });
    }
  });
};

const corpRunTypeCount = async (corpName, runCatName) => {
  return new Promise(async (resolve, reject) => {
    let count_10k = 0;
    let count_5k = 0;
    let count_1k = 0;
    if (corpName.length > 0) {
      // console.log("corp_name: ", corpName);
      for (let i = 0; i < runCatName.length; i++) {
        if (runCatName[i].race_type_name == "10k") {
          //10k runner count

          // console.log("line 663: ", runCatName[i].race_type_id);
          for (let j = 0; j < corpName.length; j++) {
            const result = await db.sequelize.query(query.corpRunCatCount, {
              replacements: [
                corpName[j].corporate_id,
                runCatName[i].race_type_id,
              ],
            });
            //console.log("line658: ", result);
            if (result[0] !== undefined) {
              //count_10k += +result[0].length;
              count_10k++;
            }
          }
        } else {
          if (runCatName[i].race_type_name == "5k") {
            //10k runner count

            // console.log("line 673: ",runCatName[i].race_type_id);

            for (let j = 0; j < corpName.length; j++) {
              const result = await db.sequelize.query(query.corpRunCatCount, {
                replacements: [
                  corpName[j].corporate_id,
                  runCatName[i].race_type_id,
                ],
              });
              //console.log("line679: ", result[0]);
              if (result[0] !== undefined) {
                //count_5k += +result[0].length;
                count_5k++;
              }
            }
          } else {
            if (runCatName[i].race_type_name == "1k") {
              //console.log("line 683: ",runCatName[i].race_type_id);

              //10k runner count
              for (let j = 0; j < corpName.length; j++) {
                const result = await db.sequelize.query(query.corpRunCatCount, {
                  replacements: [
                    corpName[j].corporate_id,
                    runCatName[i].race_type_id,
                  ],
                });
                // console.log("line658: ", result);
                if (result[0] !== undefined) {
                  //count_1k += +result[0].length;
                  count_1k++;
                }
              }
            }
          }
        }
      }
      let obj = { count_10k, count_5k, count_1k };
      return resolve(obj);
    } else {
      let obj = { count_10k: 0, count_5k: 0, count_1k: 0 };
      return resolve(obj);
    }
  });
};

const runTypeCount = async (bookingList, runCatName) => {
  return new Promise(async (resolve, reject) => {
    let count_10k = 0;
    let count_5k = 0;
    let count_1k = 0;
    if (bookingList.length > 0) {
      for (let i = 0; i < runCatName.length; i++) {
        if (runCatName[i].race_type_name == "10k") {
          //10k runner count
          for (let j = 0; j < bookingList.length; j++) {
            const result = await db.sequelize.query(query.runCatCount, {
              replacements: [
                bookingList[j].booking_id,
                runCatName[i].race_type_id,
              ],
            });
            if(result[0] != undefined){
              count_10k+=result.length;
            }
            //count_10k += +result[1].rowCount;
          }
        } else {
          if (runCatName[i].race_type_name == "5k") {
            //10k runner count
            for (let j = 0; j < bookingList.length; j++) {
              const result = await db.sequelize.query(query.runCatCount, {
                replacements: [
                  bookingList[j].booking_id,
                  runCatName[i].race_type_id,
                ],
              });
              if(result[0] != undefined){
                count_5k+=result.length;
              }
              //count_5k += +result[1].rowCount;
            }
          } else {
            if (runCatName[i].race_type_name == "1k") {
              //10k runner count
              for (let j = 0; j < bookingList.length; j++) {
                const result = await db.sequelize.query(query.runCatCount, {
                  replacements: [
                    bookingList[j].booking_id,
                    runCatName[i].race_type_id,
                  ],
                });
                if(result[0] != undefined){
                  count_1k+=result.length;
                }
                //count_1k += +result[1].rowCount;
              }
            }
          }
        }
      }
      let obj = { count_10k, count_5k, count_1k };
      return resolve(obj);
    } else {
      let obj = { count_10k: 0, count_5k: 0, count_1k: 0 };
      return resolve(obj);
    }
  });
};

const addressTypeCount = async (bookingList) => {
  return new Promise(async (resolve, reject) => {
    // console.log("line 758: ", bookingList);
    let villaCount = 0;
    let tower_1 = 0;
    let tower_2 = 0;
    let tower_3 = 0;
    let tower_4 = 0;
    let tower_5 = 0;
    let tower_6 = 0;
    let tower_7 = 0;
    //find the registrants whose address type is villa
    for (let i = 0; i < bookingList.length; i++) {
      let villa = await db.sequelize.query(query.regAddrType, {
        replacements: [bookingList[i].registrant_id_ref, "villa"],
        type: QueryTypes.SELECT,
      });

      if (villa[0] !== undefined) {
        const runnerCount = await db.sequelize.query(query.villaRunners, {
          replacements: [bookingList[i].booking_id],
          type: QueryTypes.SELECT,
        });
        if(runnerCount[0] != undefined){
          villaCount+=runnerCount.length;
        }
        //villaCount += +runnerCount.length;
      } else {
        let tower1 = await db.sequelize.query(query.regAddrTower, {
          replacements: [bookingList[i].registrant_id_ref, "tower", "tower 1"],
          type: QueryTypes.SELECT,
        });

        if (tower1[0] !== undefined) {
          const runnerCount = await db.sequelize.query(query.villaRunners, {
            replacements: [bookingList[i].booking_id],
            type: QueryTypes.SELECT,
          });
          if(runnerCount[0] != undefined){
            tower_1+=runnerCount.length;
          }
          //tower_1 += +runnerCount.length;
        } else {
          let tower2 = await db.sequelize.query(query.regAddrTower, {
            replacements: [
              bookingList[i].registrant_id_ref,
              "tower",
              "tower 2",
            ],
            type: QueryTypes.SELECT,
          });

          if (tower2[0] !== undefined) {
            //console.log("line854: ", bookingList[i]);
            const runnerCount = await db.sequelize.query(query.villaRunners, {
              replacements: [bookingList[i].booking_id],
              type: QueryTypes.SELECT,
            });
            // console.log("line859: ", runnerCount);
            if(runnerCount[0] != undefined){
              tower_2+=runnerCount.length;
            }
            //tower_2 += +runnerCount.length;
          } else {
            let tower3 = await db.sequelize.query(query.regAddrTower, {
              replacements: [
                bookingList[i].registrant_id_ref,
                "tower",
                "tower 1",
              ],
              type: QueryTypes.SELECT,
            });

            if (tower3[0] !== undefined) {
              const runnerCount = await db.sequelize.query(query.villaRunners, {
                replacements: [bookingList[i].booking_id],
                type: QueryTypes.SELECT,
              });
              if(runnerCount[0] != undefined){
                tower_3+=runnerCount.length;
              }
              //tower_3 += +runnerCount.length;
            } else {
              let tower4 = await db.sequelize.query(query.regAddrTower, {
                replacements: [
                  bookingList[i].registrant_id_ref,
                  "tower",
                  "tower 1",
                ],
                type: QueryTypes.SELECT,
              });

              if (tower4[0] !== undefined) {
                const runnerCount = await db.sequelize.query(
                  query.villaRunners,
                  {
                    replacements: [bookingList[i].booking_id],
                    type: QueryTypes.SELECT,
                  }
                );
                if(runnerCount[0] != undefined){
                  tower_4+= runnerCount.length;
                }
                //tower_4 += +runnerCount.length;
              } else {
                let tower5 = await db.sequelize.query(query.regAddrTower, {
                  replacements: [
                    bookingList[i].registrant_id_ref,
                    "tower",
                    "tower 1",
                  ],
                  type: QueryTypes.SELECT,
                });

                if (tower5[0] !== undefined) {
                  const runnerCount = await db.sequelize.query(
                    query.villaRunners,
                    {
                      replacements: [bookingList[i].booking_id],
                      type: QueryTypes.SELECT,
                    }
                  );
                  if(runnerCount[0] != undefined){
                    tower_5 += runnerCount.length;
                  }
                  //tower_5 += +runnerCount.length;
                } else {
                  let tower6 = await db.sequelize.query(query.regAddrTower, {
                    replacements: [
                      bookingList[i].registrant_id_ref,
                      "tower",
                      "tower 1",
                    ],
                    type: QueryTypes.SELECT,
                  });

                  if (tower6[0] !== undefined) {
                    const runnerCount = await db.sequelize.query(
                      query.villaRunners,
                      {
                        replacements: [bookingList[i].booking_id],
                        type: QueryTypes.SELECT,
                      }
                    );
                    if(runnerCount[0] != undefined){
                      tower_6 += runnerCount.length;
                    }
                    //tower_6 += +runnerCount.length;
                  } else {
                    let tower7 = await db.sequelize.query(query.regAddrTower, {
                      replacements: [
                        bookingList[i].registrant_id_ref,
                        "tower",
                        "tower 1",
                      ],
                      type: QueryTypes.SELECT,
                    });

                    if (tower7[0] !== undefined) {
                      const runnerCount = await db.sequelize.query(
                        query.villaRunners,
                        {
                          replacements: [bookingList[i].booking_id],
                          type: QueryTypes.SELECT,
                        }
                      );
                      if(runnerCount[0] != undefined){
                        tower_7 += runnerCount.length;
                      }
                      //tower_7 += +runnerCount.length;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    let obj = {
      villa_count: villaCount,
      tower1_count: tower_1,
      tower2_count: tower_2,
      tower3_count: tower_3,
      tower4_count: tower_4,
      tower5_count: tower_5,
      tower6_count: tower_6,
      tower7_count: tower_7,
    };
    return resolve(obj);
  });
};

const addrTypeCountForDonate = async (bookingList) => {
  return new Promise(async (resolve, reject) => {
    // console.log("line 758: ", bookingList);
    let villaCount = 0;
    let tower_1 = 0;
    let tower_2 = 0;
    let tower_3 = 0;
    let tower_4 = 0;
    let tower_5 = 0;
    let tower_6 = 0;
    let tower_7 = 0;
    //find the registrants whose address type is villa
    for (let i = 0; i < bookingList.length; i++) {
      let villa = await db.sequelize.query(query.regAddrType, {
        replacements: [bookingList[i].registrant_id_ref, "villa"],
        type: QueryTypes.SELECT,
      });

      // console.log("line1029: ", villa);

      if (villa[0] !== undefined) {
        villaCount += +villa.length;
      } else {
        let tower1 = await db.sequelize.query(query.regAddrTower, {
          replacements: [bookingList[i].registrant_id_ref, "tower", "tower 1"],
          type: QueryTypes.SELECT,
        });

        if (tower1[0] !== undefined) {
          tower_1 += +tower1.length;
        } else {
          let tower2 = await db.sequelize.query(query.regAddrTower, {
            replacements: [
              bookingList[i].registrant_id_ref,
              "tower",
              "tower 2",
            ],
            type: QueryTypes.SELECT,
          });

          if (tower2[0] !== undefined) {
            //console.log("line859: ", runnerCount);
            tower_2 += +tower2.length;
          } else {
            let tower3 = await db.sequelize.query(query.regAddrTower, {
              replacements: [
                bookingList[i].registrant_id_ref,
                "tower",
                "tower 1",
              ],
              type: QueryTypes.SELECT,
            });

            if (tower3[0] !== undefined) {
              tower_3 += +tower3.length;
            } else {
              let tower4 = await db.sequelize.query(query.regAddrTower, {
                replacements: [
                  bookingList[i].registrant_id_ref,
                  "tower",
                  "tower 1",
                ],
                type: QueryTypes.SELECT,
              });

              if (tower4[0] !== undefined) {
                tower_4 += +tower4.length;
              } else {
                let tower5 = await db.sequelize.query(query.regAddrTower, {
                  replacements: [
                    bookingList[i].registrant_id_ref,
                    "tower",
                    "tower 1",
                  ],
                  type: QueryTypes.SELECT,
                });

                if (tower5[0] !== undefined) {
                  tower_5 += +tower5.length;
                } else {
                  let tower6 = await db.sequelize.query(query.regAddrTower, {
                    replacements: [
                      bookingList[i].registrant_id_ref,
                      "tower",
                      "tower 1",
                    ],
                    type: QueryTypes.SELECT,
                  });

                  if (tower6[0] !== undefined) {
                    tower_6 += +tower6.length;
                  } else {
                    let tower7 = await db.sequelize.query(query.regAddrTower, {
                      replacements: [
                        bookingList[i].registrant_id_ref,
                        "tower",
                        "tower 1",
                      ],
                      type: QueryTypes.SELECT,
                    });

                    if (tower7[0] !== undefined) {
                      tower_7 += +tower7.length;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    let obj = {
      villa_count: villaCount,
      tower1_count: tower_1,
      tower2_count: tower_2,
      tower3_count: tower_3,
      tower4_count: tower_4,
      tower5_count: tower_5,
      tower6_count: tower_6,
      tower7_count: tower_7,
    };
    return resolve(obj);
  });
};

const downloadData = async (req, res) => {
  try {
    const { report_type, downloaded_by, download_date, event_id } = req.body;

    const addData = await db.sequelize.query(query.addDownloadData, {
      replacements: [report_type, downloaded_by, download_date, event_id],
      type: QueryTypes.INSERT,
    });

    console.log(addData);

    res.status(200).json("Data added");
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const downloadHistory = async (req, res) => {
  try {
    const eventInfo = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    const getReportHistory = await db.sequelize.query(query.reportsHistory, {
      replacements: [eventInfo[0].event_id],
      type: QueryTypes.SELECT,
    });

    res.status(200).json(getReportHistory);
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

//--------------------------------laksh-----------------------------------------

const getBibcollectionrunnercount = async () => {
  return new Promise((resolve, reject) => {
    try {
      const runnercount = db.sequelize.query(query.registrantWithRunnerCount, {
        type: QueryTypes.SELECT,
      });
      if (runnercount) {
        resolve(runnercount);
      } else {
        reject(new Error("No Runner details with bib number available"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

const get_registrantdetails_for_bibcollection = async (runnercounts) => {
  return new Promise(async (resolve, reject) => {
    let myarr1 = [];
    try {
      // console.log("line 1677", runnercount);
      const filteredArray = runnercounts.filter(
        (item) => item.registrant_id_ref !== null
      );
      for (let i = 0; i < filteredArray.length; i++) {
        const registrantdetails = await db.sequelize.query(
          query.registrantDetailsForReport,
          {
            type: QueryTypes.SELECT,
            replacements: [filteredArray[i].registrant_id_ref],
          }
        );
        //console.log("line 1684", registrantdetails);
        myarr1.push(registrantdetails[0]);
      }
      //console.log("line 1686", myarr1.length);
      if (myarr1.length > 0) {
        //console.log(myarr);
        resolve(myarr1);
      } else {
        reject("No data available in registrant table");
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getTshirt_size = (registrant_ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      let myarr = [];
      for (let i = 0; i < registrant_ids.length; i++) {
        const tshirtsize = await db.sequelize.query(
          query.getTshirtsizeForReport,
          {
            type: QueryTypes.SELECT,
            replacements: [registrant_ids[i].registrant_id],
          }
        );
        myarr.push(tshirtsize);
      }
      if (myarr.length > 0) {
        resolve(myarr);
      } else {
        reject(new Error("tshirt data is not available for runners"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

async function mergeArrays1(array1, array2) {
  // Create a map to store registrants based on their registrant_id_ref
  const registrantsMap = new Map();
  // Merge array1 into the map
  array1.forEach(({ registrant_id_ref, runner_count }) => {
    if (!registrantsMap.has(registrant_id_ref)) {
      registrantsMap.set(registrant_id_ref, {
        registrant_id_ref,
        runner_count,
        tshirt_sizes: [],
        runner_names: [],
        //bib_number added by suganthi------------
        bib_numbers: [],
        runners_id: [],
      });
    }
  });
  // Merge array2 into the map
  array2.forEach(
    //bib_number added by suganthi------------------
    ({
      registrant_id_ref,
      tshirt_size,
      runner_name,
      bib_number,
      runner_id,
    }) => {
      if (registrantsMap.has(registrant_id_ref)) {
        registrantsMap.get(registrant_id_ref).tshirt_sizes.push(tshirt_size);
        registrantsMap.get(registrant_id_ref).runner_names.push(runner_name);
        registrantsMap.get(registrant_id_ref).bib_numbers.push(bib_number);
        registrantsMap.get(registrant_id_ref).runners_id.push(runner_id);
      } else {
        // If registrant_id_ref doesn't exist in map, add it with tshirt_size
        registrantsMap.set(registrant_id_ref, {
          registrant_id_ref,
          tshirt_sizes: [tshirt_size],
          runner_names: [runner_name],
          bib_numbers: [bib_number],
          runners_id: [runner_id],
        });
      }
    }
  );
  // Convert the map values back to an array
  const mergedArray = Array.from(registrantsMap.values());
  return mergedArray;
}

async function mergeArrays2(array1, array2) {
  // Create a map to store registrants based on their registrant_id_ref
  const registrantsMap = new Map();
  // Merge array1 into the map
  array1.forEach(
    ({
      registrant_id_ref,
      runner_count,
      tshirt_sizes,
      runner_names,
      bib_numbers,
      runners_id,
    }) => {
      if (!registrantsMap.has(registrant_id_ref)) {
        registrantsMap.set(registrant_id_ref, {
          registrant_id_ref,
          runner_count,
          tshirt_sizes,
          runner_names,
          bib_numbers,
          runners_id,
        });
      }
    }
  );
  // Merge array2 into the map
  array2.forEach(
    ({
      registrant_id,
      registrant_name,
      email_id,
      mobile_number,
      address_type,
      addr_villa_number,
      addr_villa_lane_no,
      addr_villa_phase_no,
      addr_tower_no,
      addr_tower_block_no,
      addr_tower_flat_no,
      external_address,
      city,
      state,
      country,
      pin_code,
    }) => {
      if (registrantsMap.has(registrant_id)) {
        const existingRegistrant = registrantsMap.get(registrant_id);
        existingRegistrant.registrant_name = registrant_name;
        existingRegistrant.email_id = email_id;
        existingRegistrant.mobile_number = mobile_number;
        existingRegistrant.address_type = address_type,
          existingRegistrant.addr_villa_number = addr_villa_number,
          existingRegistrant.addr_villa_lane_no = addr_villa_lane_no,
          existingRegistrant.addr_villa_phase_no = addr_villa_phase_no,
          existingRegistrant.addr_tower_no = addr_tower_no,
          existingRegistrant.addr_tower_block_no = addr_tower_block_no,
          existingRegistrant.addr_tower_flat_no = addr_tower_flat_no,
          existingRegistrant.external_address = external_address,
          existingRegistrant.city = city,
          existingRegistrant.state = state,
          existingRegistrant.country = country,
          existingRegistrant.pin_code = pin_code;
      } else {
        // If registrant_id doesn't exist in map, add it
        registrantsMap.set(registrant_id, {
          registrant_id_ref: registrant_id,
          registrant_name,
          email_id,
          mobile_number,
          address_type,
          addr_villa_number,
          addr_villa_lane_no,
          addr_villa_phase_no,
          addr_tower_no,
          addr_tower_block_no,
          addr_tower_flat_no,
          external_address,
          city,
          state,
          country,
          pin_code,
        });
      }
    }
  );
  // Convert the map values back to an array
  const mergedArray = Array.from(registrantsMap.values());
  return mergedArray;
}

const get_runners_booking_info = async () => {
  return new Promise(async (resolve, reject) => {
    try {

      const bookinginfo = await db.sequelize.query(
        query.getRunnerTypeBookingId,
        {
          type: QueryTypes.SELECT,

        }
      );

      if (bookinginfo.length > 0) {
        resolve(bookinginfo);
      } else {
        reject(new Error("No booking info available for this runner"));
      }
    } catch (error) {
      reject(error);
    }
  });

}

const get_runner_type_value = async (booking_ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      let myarr = [];
      for (let i = 0; i < booking_ids.length; i++) {
        const runnertype = await db.sequelize.query(
          query.getRunnerTypeValues,
          {
            type: QueryTypes.SELECT,
            replacements: [booking_ids[i].booking_id_ref],
          }
        );
        myarr.push(runnertype);
      }
      if (myarr.length > 0) {
        resolve(myarr);
      } else {
        reject(new Error("No data type for runners"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

const mergeArrays3 = async (array1, array2) => {


  //Create a mapping of booking_id_ref to corresponding items in array2
  const mapping = array2.reduce((acc, item) => {
    const key = item.booking_id;
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  // Merge array1 and array2 based on booking_id_ref and runner_id
  const mergedArray = array1.map((item1) => {
    const matchingItems2 = mapping[item1.booking_id_ref] || [];
    const mergedItems = matchingItems2.map((item2) => ({ ...item1, ...item2 }));
    return mergedItems;
  });

  // Flatten the nested arrays
  return mergedArray.flat();




}

const mergeArray4 = async (array1, array2) => {
  console.log(array1);
  console.log("=====================");
  console.log(array2);

  // const mergedArray = array1.map((item1) => {
  //   const matchingItems2 = array2.filter((item2) => item1.registrant_id_ref === item2.registrant_id_ref && item1.runners_id.includes(item2.runner_id));
  //   return { ...item1, types: matchingItems2.map((item) => item.type_name) };
  // });
  // Create a mapping of registrant_id_ref to the corresponding array1 index
  const registrantIdRefMap = array1.reduce((map, item, index) => {
    map[item.registrant_id_ref] = index;
    return map;
  }, {});

  // Merge array2 into array1 based on registrant_id_ref
  array2.forEach((item) => {
    const array1Index = registrantIdRefMap[item.registrant_id_ref];
    if (array1Index !== undefined) {
      // Check if runner_id exists in array1, if not, create a new array
      if (!array1[array1Index].runnerTypes) {
        array1[array1Index].runnerTypes = {};
      }
      array1[array1Index].runnerTypes[item.runner_id] = item.type_name;
    }
  });

  return array1;
}



const getBiB_collection_report = async (req, res) => {
  try {
    const result1 = await getBibcollectionrunnercount();
    const result2 = await get_registrantdetails_for_bibcollection(result1);
    //console.log(result2);
    //const merge = await mergeArray1(result1, result2);

    const result3 = await getTshirt_size(result2);
    const mergedArray = [].concat(...result3);
    const result4 = await mergeArrays1(result1, mergedArray);
    //console.log(result4);
    const result5 = await mergeArrays2(result4, result2);
    // console.log(result1);
    // console.log(result2);
    // console.log(mergedArray);
    const result6 = await get_runners_booking_info();
    const result7 = await get_runner_type_value(result6);
    const flattenedArrayresult7 = result7.flat();
    const result8 = await mergeArrays3(result6, flattenedArrayresult7);
    const result9 = await mergeArray4(result5, result8);


    //console.log(result9);
    if (result9) {
      //Convert data to CSV string
      csv.stringify(result9, { header: true }, (err, csvString) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }

        // Send the CSV string as a response
        res.header("Content-Type", "text/csv");
        res.attachment("output.csv");
        res.send(csvString);
      });
      //res.status(200).json(result9)
    } else {
      res.status(400).send("no merged data available");
    }
  } catch (error) {
    console.log(error);
  }
};
//--------------------------------laksh-----------------------------------------

const bibReport = async (eventid) => {
  return new Promise(async (resolve, reject) => {

    console.log("bib report");
    const paidRunner = await db.sequelize.query(query.paidRunners, {
      replacements: [eventid],
      type: QueryTypes.SELECT,
    });

    const ageCat = await db.sequelize.query(query.ageType, {
      type: QueryTypes.SELECT,
    });

    const runCat = await db.sequelize.query(query.runType, {
      type: QueryTypes.SELECT,
    });

    const registrantType = await db.sequelize.query(query.regTypes, {
      type: QueryTypes.SELECT,
    });

    // details fpr coporate runners


    if (paidRunner.length > 0) {

      const corpRunner = await corpRunnerDetailsForBibReport(paidRunner, ageCat, runCat)
      // console.log("line 3877:", corpRunner);
      const result = await mergeBibReport(paidRunner, ageCat, runCat, registrantType);
      // if(corpRunner){
      let runnersList = result.concat(corpRunner)
      // }

      if (runnersList) {
        return resolve(runnersList);
      }
    } else {
      return resolve(paidRunner);
    }
  });
};



const corpRunnerDetailsForBibReport = async (paidRunner, ageCat, runCat) => {
  return new Promise(async (resolve, reject) => {

    let runner = [];

    let result = [];

    let corpRunner = [];

    paidRunner.forEach((obj) => {
      let matchObj1 = runCat.find(
        (obj1) => obj.run_category_id_ref === obj1.race_type_id
      );

      if (matchObj1) {
        let mergeObj1 = { ...obj, ...matchObj1 };

        runner.push(mergeObj1);
      }
    });


    runner.forEach((obj) => {
      let matchObj = ageCat.find(
        (obj1) => obj.age_type_id_ref === obj1.age_type_id
      );
      let regtype = { type_name: 'corporate registrant' }
      if (matchObj) {
        let mergeObj = { ...obj, ...matchObj, ...regtype };

        result.push(mergeObj);
      }
    });


    for (let i = 0; i < result.length; i++) {
      if (result[i].runner_payment_status === 'paid by corporate') {
        let corpName = await db.sequelize.query(query.corporateName, { replacements: [result[i].corporate_sponsor_id_ref], type: QueryTypes.SELECT });
        let obj = { ...result[i], ...corpName[0] }
        corpRunner.push(obj)


      }
    }

    return resolve(corpRunner);
  })
}

const mergeBibReport = async (runner, ageCat, runCat, regType) => {
  return new Promise(async (resolve, reject) => {
    let result = [];
    let data = [];

    let finalResult = [];

    runner.forEach((obj) => {
      let matchObj = ageCat.find(
        (obj1) => obj.age_type_id_ref === obj1.age_type_id
      );

      if (matchObj) {
        let mergeObj = { ...obj, ...matchObj };

        result.push(mergeObj);
      }
    });

    result.forEach((obj) => {
      let matchObj1 = runCat.find(
        (obj1) => obj.run_category_id_ref === obj1.race_type_id
      );

      if (matchObj1) {
        let mergeObj1 = { ...obj, ...matchObj1 };

        data.push(mergeObj1);
      }
    });



    data.forEach(obj2 => {
      let matchObj2 = regType.find(
        (obj3) => obj2.registrant_type_ref === obj3.type_id
      );
      let companyName = { corp_company_name: null }
      if (matchObj2) {
        let mergeObj2 = { ...obj2, ...matchObj2, ...companyName };

        finalResult.push(mergeObj2);
      }
    })

    if (runner.length === finalResult.length) {
      return resolve(finalResult);
    } else {
      return resolve(finalResult);
    }
  });
};





const bibCollectionReportV1 = async (eventid) => {
  return new Promise(async (resolve, reject) => {

    console.log("bib report");
    const paidRunner = await db.sequelize.query(query.paidRunner, {
      replacements: [eventid],
      type: QueryTypes.SELECT,
    });

    const ageCat = await db.sequelize.query(query.ageType, {
      type: QueryTypes.SELECT,
    });

    const runCat = await db.sequelize.query(query.runType, {
      type: QueryTypes.SELECT,
    });

    const registrantType = await db.sequelize.query(query.regTypes, {
      type: QueryTypes.SELECT,
    });

    // details fpr coporate runners


    if (paidRunner.length > 0) {

    
      const corpRunner = await corpRunnerDetailsForBibReport1(paidRunner, ageCat, runCat)
      // console.log("line 3877:", corpRunner);
      const result = await mergeBibReport1(paidRunner, ageCat, runCat, registrantType);
      // if(corpRunner){
      let runnersList = result.concat(corpRunner)
      // }

      if (runnersList.length>0) {


        let paidRunners=[];
        for(let i=0; i< runnersList.length;i++){
    const registrantName =  await db.sequelize.query(query.regName, { replacements: [runnersList[i].registrant_id_ref], type: QueryTypes.SELECT });

      //let regName = {registrant_name:`${registrantName[0].first_name} ${registrantName[0].last_name}`}
           let obj = {...runnersList[i],...registrantName[0], };
          paidRunners.push(obj)

        }
        return resolve(paidRunners);
      }
    } else {
      return resolve(paidRunner);
    }
  });
};



const corpRunnerDetailsForBibReport1 = async (paidRunner, ageCat, runCat) => {
  return new Promise(async (resolve, reject) => {

    let runner = [];

    let result = [];

    let corpRunner = [];

    paidRunner.forEach((obj) => {
      let matchObj1 = runCat.find(
        (obj1) => obj.run_category_id_ref === obj1.race_type_id
      );

      if (matchObj1) {
        let mergeObj1 = { ...obj, ...matchObj1 };

        runner.push(mergeObj1);
      }
    });


    runner.forEach((obj) => {
      let matchObj = ageCat.find(
        (obj1) => obj.age_type_id_ref === obj1.age_type_id
      );
      let regtype = { type_name: 'corporate registrant' }
      if (matchObj) {
        let mergeObj = { ...obj, ...matchObj, ...regtype };

        result.push(mergeObj);
      }
    });


    for (let i = 0; i < result.length; i++) {
      if (result[i].runner_payment_status === 'paid by corporate') {

       
        let corpName = await db.sequelize.query(query.corporateName, { replacements: [result[i].corporate_sponsor_id_ref], type: QueryTypes.SELECT });
        let obj = { ...result[i], ...corpName[0]}
        corpRunner.push(obj)


      }
    }

    return resolve(corpRunner);
  })
}

const mergeBibReport1 = async (runner, ageCat, runCat, regType) => {
  return new Promise(async (resolve, reject) => {
    let result = [];
    let data = [];

    let finalResult = [];

    runner.forEach((obj) => {
      let matchObj = ageCat.find(
        (obj1) => obj.age_type_id_ref === obj1.age_type_id
      );

      if (matchObj) {
        let mergeObj = { ...obj, ...matchObj };

        result.push(mergeObj);
      }
    });

    result.forEach((obj) => {
      let matchObj1 = runCat.find(
        (obj1) => obj.run_category_id_ref === obj1.race_type_id
      );

      if (matchObj1) {
        let mergeObj1 = { ...obj, ...matchObj1 };

        data.push(mergeObj1);
      }
    });



    data.forEach(obj2 => {
      let matchObj2 = regType.find(
        (obj3) => obj2.registrant_type_ref === obj3.type_id
      );
      let companyName = { corp_company_name: null }
      if (matchObj2) {
        let mergeObj2 = { ...obj2, ...matchObj2, ...companyName };

        finalResult.push(mergeObj2);
      }
    })

    if (runner.length === finalResult.length) {
      return resolve(finalResult);
    } else {
      return resolve(finalResult);
    }
  });
};


module.exports = {
  reports,
  downloadData,
  downloadHistory,
  getBiB_collection_report,
};
