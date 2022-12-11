const express = require("express")
const router = express.Router()
const { adminLogin, adminRegister } = require('../controllers/adminController.js')
const { createStudent, editStudent, viewStudent, deleteStudent } = require('../controllers/studentContoller.js')
const { authenticate } = require('../middleware/authentication.js')

router.post('/adminregister', adminRegister)
router.post('/adminlogin', adminLogin)

router.post('/addstudent', authenticate, createStudent)
router.get('/viewstudent', authenticate, viewStudent)
router.put('/editstudent/:studentId', authenticate, editStudent)
router.delete('/deletestudent/:studentId', authenticate, deleteStudent)


module.exports = router