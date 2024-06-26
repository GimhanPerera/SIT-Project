var nodemailer = require('nodemailer');
const { alert, sensor,user } = require('../models');
require('dotenv').config();

//controller to send alerts
const sendAlert = async (userId, sensorDetails) => {

  try {
    //const { email, sensorDetails } = req.body;
    const { sensorId, sensorName, upper_limit, lower_limit, value } = sensorDetails;
    //create transport using nodemailer
    const user1 = await user.findOne({ where: { userId } });
    console.log("EMAIL ",user1.email," ",sensorName)
    const email = user1.email;
    var transporter = nodemailer.createTransport({
      service: 'yahoo',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });
    // structuring the email
    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sensor Alert",
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Sensor Alert</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f7f7f7; 
                }
            
                .container {
                  max-width: 600px;
                  margin: 50px auto;
                  padding: 16px;
                  background-color: #fff; 
                  border: 1px solid #ddd; 
                  border-radius: 5px;
                  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); 
                }
            
                .header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 30px;
                }
            
                .header img {
                  width: 150px;
                }
            
                .header h1 {
                  font-size: 22px; 
                  margin: 0;
                  color: #333; 
                }
            
                .content {
                  line-height: 1.6; 
                  color: #666; 
                }
            
                .params {
                  font-weight: bold;
                }

                .value {
                    font-weight: bold;
                    color:#FF0000;
                }

                .label{
                    font-weight: bold;
                }

                .label, .value {
                    display: inline;
                }
                /*sensor detail styling*/
                .details {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    background-color: #f2f2f2;
                    padding: 10px 10px;
                    border-radius: 5px;
                  }
            
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #aaa;
                }
            
              </style>
            </head>
            <body>
              <div class="container">
                <header class="header">
                  <h1>Sensor Alert</h1>
                </header>
                <main class="content">
                  <p>Hello,</p>
                  <p> The ${sensorName} registered under your name in the Sensor management system has gone beyond the range
                  assigned to it.</p>
                  <div class="details">
                  <p class="params"> Sensor ID: ${sensorId}</p>
                  <p class="params"> Sensor Name: ${sensorName}</p>
                  <p class="params"> Range: ${upper_limit} - ${lower_limit}</p>
                  <p class="label"> Value:</p> <p class= "value"> ${value}</p>
                  </div>
                  <p>We recommend taking necessary actions to mitigate any harmful outcome.</p>
                  <p>Thank you,<br>Sensor Management System</p>
                </main>
                <footer class="footer">
                  <p>&copy; Sensor Management System 2024</p>
                </footer>
              </div>
            </body>
            </html>
            `,
    };
    //send trasporter to send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return "error"
      } else {
        return "error"
      }
    });
    //update the database
    await alert.create({
      alert: `${value} is out of range; ${lower_limit} -${upper_limit}`,
      dateTime: new Date(),
      sensorSensorId: sensorId,
    })

  } catch (error) {
    console.log(error)
    return "Internal server error"
  }
}

const getAllAlertDataOfUser = async (req, res) => {
  try {
    console.log("ID ", req.userId)
    const sensorList = await sensor.findAll({
      where: {
        userUserId: req.userId
      },
      attributes: ['sensorId']
    });

    const sensorIds = sensorList.map(sensor => sensor.sensorId); //Get the order IDS

    const alertList = await alert.findAll({
      where: {
        sensorSensorId: sensorIds
      },
    });
    
    res.status(200).json(alertList);
  } catch (error) {
    console.error(error)
    return "Server error";
  }
}

module.exports = {
  sendAlert,
  getAllAlertDataOfUser
}