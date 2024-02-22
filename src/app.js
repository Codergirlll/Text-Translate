const express = require("express");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 3001

const translate = require("translate-google")
app.use(express.json());



app.post("/text/translation", (req, res) => {

    try {

        // This function will check if the entered input is valid or not
        let isValidInput = (EnterInput) => {

            console.log("EnterInput: ", EnterInput)

            // // 1. for Allow only Alphabats 
            // const regex = /^[a-zA-Z\s]+$/;

            // // 2. for Allow Alphabats and numbers
            // const regex = /^[a-zA-Z0-9\s]+$/;

            // 3. for Allow Alphabats, numbers and Symbol
            const regex = /^[a-zA-Z0-9()\[\]{}.,!?;:'"\s-]+$/;

            return regex.test(EnterInput);
        }


        let { text } = req.body,
            IsValid = isValidInput(text)

        console.log("IsValid: ", IsValid)

        // // 1. for French
        // let translateIn = 'fr'

        // 2. for Hindi
        let translateIn = 'hi'

        if (IsValid) {

            translate(text, { to: translateIn })
                .then((translatedText) => {

                    // console.log("text: ", text)
                    console.log("translatedText: ", translatedText);

                    res.status(200).send({
                        resultCode: '1',
                        message: "Success",
                        response: {
                            normalText: text,
                            translatedText
                        }
                    })

                })
                .catch((err) => {
                    console.error('Error:', err);
                    res.status(404).send({
                        resultCode: '1',
                        message: "failed",
                        error: {
                            type: err.name,
                            description: err.message
                        }

                    })
                });
        }
        else {

            res.status(404).send({
                resultCode: '1',
                message: "failed",
                error: {
                    type: "Invalid Input",
                    description: `Entered Input (${text}) is not Valid. Input should be in text or little bit of numbers.`
                }
            })
        }
    }

    catch (err) {

        console.log("err: ", err)
        res.status(404).send({
            resultCode: '1',
            message: "failed",
            error: {
                type: err.name,
                description: err.message
            }
        })
    }
})


app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
})
