var nodemailer = require('nodemailer');
console.log("hello");


var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'realjodahen@gmail.com',
    pass: '[$l[7mq"v$TPmz]x$"!'
  }
});


var mailOptions = {
  from: 'realjodahen@gmail.com',
  to: 'joshua.heninger@posteo.de',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  console.log("sending started");
  console.log(info);
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
