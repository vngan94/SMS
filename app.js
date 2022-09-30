const express = require('express')
const app = express()
const twilio = require('twilio');

app.use(express.static('./public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const accountSid = 'ACd8015bfd6097821428b7312a3d1aeb96';
const authToken = 'b03ebf8f15e9abc9c27240213705c1f1';
const client = require('twilio')(accountSid, authToken);
const sid = 'VAcec1c0666b5d0285d7f17b254820b538'



app.get('/', (req, res) => {
    res.render(__dirname + "/login.ejs")

})
app.post('/send-otp', async (req, res) => {
    // send OTP
    let str = req.body.phoneNumber;
    str = '+84' + str.substring(1);

    await client.verify.v2.services(sid)
        .verifications
        .create({ to: str, channel: 'sms' })
        .then(data => {
            console.log("status ", data.status)
            res.render(__dirname + "/otp.ejs", { sdt: str, message: 'Kiểm tra tin nhắn điện thoại để nhập OTP', type: 'Xác nhận' })

        })
        .catch(err => {
            console.log("Check err " + err)
            res.redirect('/')
        })
})

app.post('/submit', async (req, res) => {
    let str = req.body.phoneNumber;
    // verify
    await client.verify.v2.services(sid)
        .verificationChecks
        .create({ to: str, code: req.body.otp })
        .then(verification_check => {
            if (verification_check.status === 'approved') {
                // xác nhận đúng
                res.send({ done: true })
            }
            else {
                // nhập mã OTP sai
                res.send({ done: false })
            }
        })
        .catch(err => {
            console.log("check err ", err)
            res.send({ done: false })
        })



})



app.listen(3001, () => {
    console.log(`Example app listening on port 3001`)
})