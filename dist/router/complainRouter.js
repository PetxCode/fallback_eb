"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complainController_1 = require("../controller/complainController");
const router = (0, express_1.Router)();
router.route("/create-complain/:teacherID").post(complainController_1.createTeacherComplain);
router.route("/create-student-complain/:studentID").post(complainController_1.createStudentComplain);
router.route("/mark-seen/:schoolID/:complainID").patch(complainController_1.markAsSeenComplain);
router.route("/mark-resolve/:schoolID/:complainID").patch(complainController_1.markResolveComplain);
router.route("/view-school-complain/:schoolID").get(complainController_1.viewSchoolComplains);
router.route("/view-teacher-complain/:teacherID").get(complainController_1.viewTeacherComplains);
router.route("/view-student-complain/:studentID").get(complainController_1.viewStudentComplains);
exports.default = router;
