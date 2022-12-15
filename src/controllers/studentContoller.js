const mongoose  = require('mongoose')
const studentModel = require('../models/studentModel.js')
const ObjectId = mongoose.Types.ObjectId

exports.createStudent = async (req, res) => {
    try {
        let input = req.body
        let { name, subject, marks } = input

        if (Object.keys(input).length == 0) return res.status(400).send({ status: false, message: "Please enter mandatory student details" })

        let isStudentExist = await studentModel.findOne({ name: name, subject: subject, adminId: req.adminId })

        if (isStudentExist) {
            isStudentExist.marks += marks
            await isStudentExist.save()
            return res.status(200).send({ status: true, message: "Student marks added successfully", data: isStudentExist })
        }

        input["adminId"] = req.adminId
        let addStudent = await studentModel.create(input)
        return res.status(201).send({ status: true, message: "Student added successfully", data: addStudent })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

exports.viewStudent = async (req, res) => {
    try {
        let q = req.query
        let { name, subject } = q
        let search = { adminId: req.adminId, isDeleted: false }
        if (Object.keys(q).length == 0) {
            let getAllStudents = await studentModel.find({ adminId: req.adminId, isDeleted: false })
            if (getAllStudents.length == 0) return res.status(400).send({ staus: false, message: "No student data found" })
            return res.status(200).send({ staus: true, message: "Students data fetched successfully", data: getAllStudents })
        }
        if (name) {
            search.name = { $regex: name.trim(), $options: 'i' }
        }
        if (subject) {
            search.subject = subject.trim()
        }
        let getStudents = await studentModel.find(search)
        if (getStudents.length == 0) return res.status(400).send({ status: false, message: "No student data found" })

        return res.status(200).send({ staus: true, message: "Students data fetched successfully", data: getStudents })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.editStudent = async (req, res) => {
    try {
        let studentId = req.params.studentId

        if (!ObjectId.isValid(studentId)) return res.status(400).send({ status: false, message: "Student Id is not a valid mongoose type object Id" })

        let student = await studentModel.findOne({ _id: studentId, isDeleted: false })
        if (student) {
            let id = student.adminId
            if (req.adminId != id) return res.status(403).send({ status: false, message: "You are not authorized to update this student" })
        } else {
            return res.staus(404).send({ staus: false, message: "No student found with this student Id or is already deleted" })
        }
        let input = req.body
        let { name, marks, subject } = input
        if (Object.keys(input).length == 0) return res.status(400).send({ status: false, message: "Please enter atleast one detail to edit student" })
        let update = {}
        if (name) {
            if (name == student.name) return res.status(400).send({ status: false, message: "Please enter a new name to update" })
            let check = await studentModel.findOne({ adminId: req.adminId, name: name, subject: student.subject })
            if (check) return res.status(400).send({ staus: false, message: "Please enter different name as this name with same admin and same subject is already used" })
            update.name = name
        }
        if (subject) {
            if (subject == student.subject) return res.status(400).send({ status: false, message: "Please enter a different subject to update" })
            let check = await studentModel.findOne({ adminId: req.adminId, name: student.name, subject: subject })
            if (check) return res.status(400).send({ staus: false, message: "Please enter different subject as this subject with same admin and same name is already used" })
            update.subject = subject
        }
        if (marks) {
            if (marks == student.marks) return res.status(400).send({ status: false, message: "No need to update marks as it you have entered the same marks" })
            update.marks = marks
        }
        let updatedStudent = await studentModel.findOneAndUpdate({ _id: studentId }, update, { new: true })
        return res.status(200).send({ status: true, message: "Data updated successfully", data: updatedStudent })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        let studentId = req.params.studentId
        if (!ObjectId.isValid(studentId)) return res.status(400).send({ status: false, message: "Student Id is not a valid mongoose type object Id" })

        let student = await studentModel.findOne({ _id: studentId, isDeleted: false })
        if (student) {
            let id = student.adminId
            if (req.adminId != id) return res.status(403).send({ status: false, message: "You are not authorized to delete this student" })
        } else {
            return res.staus(404).send({ staus: false, message: "No student found with this student Id or is already deleted" })
        }

        await studentModel.findOneAndDelete({ _id: studentId }, { isDeleted: true })
        return res.status(200).send({ staus: true, message: "Student data deleted successfully" })
    } catch (error) {
        return res.status(500).send({ staus: false, message: error.message })
    }

}