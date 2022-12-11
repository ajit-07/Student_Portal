const { isValidEmail, isValidPassword } = require('../validators/validator.js')
const adminModel = require('../models/adminModel.js')
const studentModel = require('../models/studentModel.js')
const jwt = require('jsonwebtoken')

exports.adminRegister = async (req, res) => {
    try {
        let input = req.body;
        let { password, email } = input
        if (Object.keys(input).length == 0) return res.status(400).send({ status: false, message: "Please provide registartion details" })

        if (email && password) {
            if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Please enter a valid e-mail" })
            if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Password must conatin 8-15 characters with atleast 1 (uppercase,specail character and number)" })
        } else {
            return res.status(400).send({ status: false, message: "Email and password is mandatory for registration" })
        }

        let adminExist = await adminModel.findOne({ email: email, password: password })
        if (adminExist) return res.status(400).send({ status: false, message: "Please login" })
        let createAdmin = await adminModel.create(input)
        return res.status(201).send({ status: true, message: "Admin created successfully!!", data: createAdmin })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.adminLogin = async (req, res) => {
    try {
        let input = req.body
        let { email, password } = input
        if (Object.keys(input).length == 0) return res.status(400).send({ status: false, message: "Please provide login details" })

        if (!email || !password) return res.status(400).send({ status: false, messsage: "Login credentials are missing" })

        let verifyAdmin = await adminModel.findOne({ email: email, password: password })
        if (verifyAdmin) {

            let token = jwt.sign({
                adminId: verifyAdmin._id,
                organistation: "FunctionUp",
                project: "Student_records"

            }, "ajit07", { expiresIn: '1h' })

            let studentsRecord = await studentModel.find({ adminId: verifyAdmin._id, isDeleted: false })
            if (studentsRecord === 0) { studentsRecord = "No student record found" }
            return res.status(200).send({ status: true, message: "Login successfull", token: token, data: studentsRecord })
        } else {
            return res.status(400).send({ status: false, message: "Please register first" })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}