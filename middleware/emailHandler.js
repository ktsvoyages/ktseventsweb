require('dotenv').config()
const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const { google } = require('googleapis')
CLIENT_ID = "796793058386-5mfl2b7gqj6r298boo6ekrva2rp649kr.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_URI = "https://developers.google.com/oauthplayground"
REFRESH_TOKEN = "1//04NGUApxn_4YsCgYIARAAGAQSNwF-L9IrJvmZcZLwsbft27N1xhut8aRDXQTDHR6T8Nxd_hVYZdGLKZ1iai3T8kuK3TDM4uC40WQ"
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })


module.exports.newsLetterSubscribe = async (req, res) => {
	const accessToken = await oAuth2Client.getAccessToken()
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.EMAIL,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			refreshToken: REFRESH_TOKEN,
			accessToken: accessToken
		}
	});

	var mailOptions = {
		from: 'KTS event website',
		to: process.env.EMAIL,
		subject: 'Newsletter Subscription Request',
		text: 'Hello KTS Team,\n\nKindly note that: ' + req.body.email + ' has requested to subscribe to our Events newsLetter. \n \n' + 'Thank you & Best Regards'
	};
	transporter.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('KTS success')
		}
	});

	var mailOptions = {
		from: 'KTS event website',
		to: req.body.email,
		subject: 'Newsletter Subscription Confirmation',
		text: 'Hello from KTS Team,\n\nKindly note that your newsLetter subscription request is being handled by our team. \n \n' + 'Thank you & Best Regards'
	};
	transporter.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('customer success')
		}
	});

	req.flash('success', 'Your newsLetter subscription request was sent successfully ')
	res.redirect('/')
}

module.exports.contactUsRequest = async (req, res) => {

	const accessToken = await oAuth2Client.getAccessToken()
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.EMAIL,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			refreshToken: REFRESH_TOKEN,
			accessToken: accessToken
		}
	});

	var mailOptions = {
		from: 'KTS event website',
		to: process.env.EMAIL,
		subject: 'Event Owner Contact Request',
		text: `Hello KTS Team,\n\nKindly note that: ${req.body.Fname} ${req.body.Lname} has requested to be reached out. \n \nThese are the informations filled by ${req.body.Fname} ${req.body.Lname} \nFirst Name: ${req.body.Fname}\nLast Name:${req.body.Lname} \nEmail: ${req.body.email} \nPhone Number: ${req.body.phone}\nEvent Type: ${req.body.eventType}\nHis Message: ${req.body.feedback}\n\nThank you & Best Regards`
	};
	transporter.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('KTS success')
		}
	});

	var mailOptions = {
		from: 'KTS event website',
		to: req.body.email,
		subject: 'Message from KTS event',
		text: 'Hello from KTS Team,\n\nKindly note that your request is being handled by our team. \nWe will be contacting you soon. \n\n' + 'Thank you & Best Regards'
	};
	transporter.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('success')
		}
	});
	req.flash('success', 'Your request was sent successfully ')
	res.redirect('contact')
}

module.exports.voucherMail = async (req, res, currentEvent, currentPackage, currentPackageOption, userData, packageQuantity) => {
	const accessToken = await oAuth2Client.getAccessToken()
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.EMAIL,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			refreshToken: REFRESH_TOKEN,
			accessToken: accessToken
		}
	});

	const handlebarOptions = {
		viewEngine: {
			extName: ".handlebars",
			partialsDir: path.resolve('./views'),
			defaultLayout: false,
		},
		viewPath: path.resolve('./views'),
		extName: ".handlebars",
	}

	transporter.use('compile', hbs(handlebarOptions));

	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let fulldate = month + "/" + day + "/" + year;

	var mailOptions = {
		from: 'KTS events website',
		to: userData.email,
		subject: 'KTS Confirmation Email',
		template: 'emails/voucher',
		context: {
			eventTitle: currentEvent.title,
			packageTitle: currentPackage.title,
			packageUrl: currentPackage.image_url,
			lastName: userData.lName,
			firstName: userData.fName,
			date: fulldate

		}
	};
	transporter.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('voucher success')
		}
	});

	// var mailOptions = {
	// 	from: 'KTS events website',
	// 	to: process.env.EMAIL,
	// 	subject: 'KTS Confirmation Email',
	// 	text: `Hello KTS Team,\n\nKindly note that: ${userData.lName} ${userData.fName} has purchased ${currentPackage.title} package: \n \nThese are the informations of the package purchased:\nEvent Name: ${currentEvent.title}\nPackage Name: ${currentPackage.title}\nOption Description: ${currentPackageOption.optionDescription}\nOption Price: ${currentPackageOption.price} EUR\n\n\nThank you & Best Regards`

	// };
	// transporter.sendMail(mailOptions, (err, res) => {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// 	else {
	// 		console.log('Admin voucher success')
	// 	}
	// });
}

module.exports.excursionMail = async (req, res, currentEventID, currentEvent, currentPackage, currentPackageOption, userData, packageQuantity) => {
	const accessToken = await oAuth2Client.getAccessToken()
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.EMAIL,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			refreshToken: REFRESH_TOKEN,
			accessToken: accessToken
		}
	});

	const handlebarOptions = {
		viewEngine: {
			extName: ".handlebars",
			partialsDir: path.resolve('./views'),
			defaultLayout: false,
		},
		viewPath: path.resolve('./views'),
		extName: ".handlebars",
	}

	transporter.use('compile', hbs(handlebarOptions));

	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let fulldate = month + "/" + day + "/" + year;

	var mailOptions = {
		from: 'KTS events website',
		to: userData.email,
		subject: 'KTS Voucher',
		template: 'emails/excursion',
		context: {
			eventTitle: currentEvent.title,
			packageTitle: currentPackage.title,
			packageFullDescription: currentPackage.description,
			priceInclude: currentPackage.priceInclude,
			priceExclude: currentPackage.priceExclude,
			priceDemand: currentPackage.priceDemand,
			packageUrl: currentPackage.image_url,
			packageDescription: currentPackageOption.optionDescription,
			packagePrice: currentPackageOption.price,
			lastName: userData.lName,
			firstName: userData.fName,
			date: fulldate,
			packageQty: packageQuantity
		}
	};
	transporter.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('Excursion success')
		}
	});

	var mailOptions = {
		from: 'KTS events website',
		to: process.env.EMAIL,
		subject: 'KTS Excursion',
		template: 'emails/KTS-excursion',
		context: {
			eventTitle: currentEvent.title,
			packageUrl: currentPackage.image_url,
			packageDescription: currentPackageOption.optionDescription,
			packagePrice: currentPackageOption.price,
			lastName: userData.lName,
			firstName: userData.fName,
			email: userData.email,
			Phone: userData.phone,
			whatsapp: userData.whatsapp,
			dob: userData.dob,
			paypalID: userData.paymentID,
			packageQty: packageQuantity

		}
	};
	transporter.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('admin excursion success')
			// req.flash('success', 'Successful Payment')
			// res.redirect(`/event-owner/home/${currentEventID}`)
		}
	});
}