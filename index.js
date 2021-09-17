const functions = require("firebase-functions");
//const fetch = require("node-fetch");
const firebase = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
firebase.initializeApp();



let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: 'mail.azimutestartup.com',
    port: 465,
    secure: true,
    auth: {
        user: 'trabalheconosco@azimutestartup.com',
        pass: 'e$0^,s%I4b@E'
    }
});

exports.sendAffiliationAccepted = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const email = req.query.email;
        const name = req.query.name;
        // const login = req.query.login;
        // const password = req.query.password;

        const mailOptions = {
            from: 'PDT <noreply@pdt-app-fe29a.firebaseapp.com>',
            to: email,
            subject: 'Parabéns! Sua filiação foi aceita!', // email subject
            html:
                ` 
            <body style="margin:0;padding:0;font-family: Open Sans;">
            <table width="700" align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:30px 0 30px 0" align="center">
                        <img width="180px" height="100px" alt="Imagem" style="display:block;"
                            src="https://i.imgur.com/6Etq71W.png" />
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 0" bgcolor="#263272" align="center">
                        <h2 style="color: #fff;margin: 0;font-size: 35px;">Parabéns! Sua filiação foi aceita!</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 20px 20px 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" style="border-bottom: 2px solid #ccc;padding: 30px 0 50px 0;">
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 600;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Agora você já é um filiado do Partido Democrático Trabalhista!
        
                                    </p>
        
                                    <p
                                        style="color:#263272;margin-top: 10px;font-size: 16px;padding-bottom: 10px;font-weight: 500;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Para acessar seu perfil e a sua carteirinha digital, basta abrir o app,
                                        ir em Perfil e digitar seu e-mail e senha.
        
                                    </p>
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Esqueceu sua senha? Não tem problema.
                                        Em Perfil, clique em "Esqueci minha senha" antes de digitar seu e-mail
                                        e nós enviaremos uma redefinição de senha para o seu e-mail.
        
                                    </p>
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                    
                                        Fique atento também a sua pasta de Spam e Lixo Eletrônico,
                                        pois nosso e-mail poderá cair lá.
                                      
                                    </p>
        
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                    
                                        Um grande abraço!
                                        Equipe PDT
        
                                    </p>
        
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
            `

            // email content in HTML
        };
        
        function insertInDataBase() {
            let res = firebase.database().ref("listaDeEmail")
            let key = res.push().key

            res.child(key).set(
                { 
                    email:email,
                    name: name
                })

        }

        function sendEmail() {

            var requestOptions = {
                method: 'GET',
                redirect: 'follow',
    
            };
            fetch(`https://us-central1-pdt-app-fe29a.cloudfunctions.net/sendMailWelcome?email=${email}&name=${name}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }

        insertInDataBase()
        sendEmail()

        // returning resulta
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});