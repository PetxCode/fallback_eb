import { Request, Response } from "express";
import schoolModel from "../model/schoolModel";
import subjectModel from "../model/subjectModel";
import { Types } from "mongoose";
import classroomModel from "../model/classroomModel";
import staffModel from "../model/staffModel";
import lodash from "lodash";
import studentModel from "../model/studentModel";
import { log } from "console";

export const createSchoolClasses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { schoolID } = req.params;
    const {
      classTeacherName,
      className,
      class2ndFee,
      class3rdFee,
      class1stFee,
    } = req.body;

    const school = await schoolModel.findById(schoolID).populate({
      path: "classRooms",
    });

    const checkClass = school?.classRooms.some((el: any) => {
      return el.className === className;
    });

    if (school && school.status === "school-admin") {
      if (!checkClass) {
        const classes = await classroomModel.create({
          schoolName: school.schoolName,
          classTeacherName,
          className,
          class2ndFee,
          class3rdFee,
          class1stFee,

          presentTerm: school?.presentTerm,
        });

        school.historys.push(new Types.ObjectId(classes._id));
        school.classRooms.push(new Types.ObjectId(classes._id));

        school.save();

        return res.status(201).json({
          message: "classes created successfully",
          data: classes,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "duplicated class name",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "unable to read school",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school session",
      status: 404,
      error,
    });
  }
};

export const updateSchoolClassesPerformance = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { schoolID, subjectID } = req.params;
    const { subjectTitle } = req.body;

    const school = await schoolModel.findById(schoolID);

    if (school && school.schoolName && school.status === "school-admin") {
      const subjects = await subjectModel.findByIdAndUpdate(
        subjectID,
        {
          subjectTitle,
        },
        { new: true }
      );

      return res.status(201).json({
        message: "subjects title updated successfully",
        data: subjects,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "unable to read school",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error creating school session",
      status: 404,
    });
  }
};

export const viewClassesByTimeTable = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { classID } = req.params;

    const schoolClasses = await classroomModel.findById(classID).populate({
      path: "timeTable",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(200).json({
      message: "finding classes by TimeTable",
      status: 200,
      data: schoolClasses,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school class",
      status: 404,
      data: error.message,
    });
  }
};

export const viewClassesByStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { classID } = req.params;

    const schoolClasses = await classroomModel.findById(classID).populate({
      path: "students",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(200).json({
      message: "finding class students",
      status: 200,
      data: schoolClasses,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school class",
      status: 404,
      data: error.message,
    });
  }
};

export const viewClassesBySubject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { classID } = req.params;

    const schoolClasses = await classroomModel.findById(classID).populate({
      path: "classSubjects",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(200).json({
      message: "finding classes by Name",
      status: 200,
      data: schoolClasses,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school class",
      status: 404,
      data: error.message,
    });
  }
};

export const viewSchoolClassesByName = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { className } = req.body;

    const schoolClasses = await classroomModel.findOne({ className }).populate({
      path: "classSubjects",
    });

    return res.status(200).json({
      message: "finding classes by Name",
      status: 200,
      data: schoolClasses,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school class",
      status: 404,
      data: error.message,
    });
  }
};

export const viewSchoolClasses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { schoolID } = req.params;

    const schoolClasses = await schoolModel.findById(schoolID).populate({
      path: "classRooms",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(200).json({
      message: "School classes found",
      status: 200,
      data: schoolClasses,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school class",
      status: 404,
      data: error.message,
    });
  }
};

export const viewOneClassRM = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { classID } = req.params;

    const schoolClasses = await classroomModel.findById(classID);

    return res.status(200).json({
      message: "School's class info found",
      status: 200,
      data: schoolClasses,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school class info",
      status: 404,
      data: error.message,
    });
  }
};

export const viewClassRM = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { classID } = req.params;

    const schoolClasses = await classroomModel.findById(classID).populate({
      path: "classSubjects",
    });

    return res.status(200).json({
      message: "School classes info found",
      status: 200,
      data: schoolClasses,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school class info",
      status: 404,
      data: error.message,
    });
  }
};

export const updateSchoolClassName = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { schoolID, classID } = req.params;
    const { className } = req.body;

    const school = await schoolModel.findById(schoolID);

    if (school && school.schoolName && school.status === "school-admin") {
      const subjects = await classroomModel.findByIdAndUpdate(
        classID,
        {
          className,
        },
        { new: true }
      );

      for (let i of school.students) {
        let student = await studentModel.findById(i);
        if (student?.presentClassID === classID) {
          await studentModel.findByIdAndUpdate(
            i,
            { classAssigned: className },
            { new: true }
          );
        }
      }

      for (let i of school.staff) {
        let staff = await staffModel.findById(i);

        if (staff?.presentClassID === classID) {
          let myClass: any = staff?.classesAssigned.find((el: any) => {
            return el.classID === classID;
          });

          myClass = { className, classID };

          let xx = staff?.classesAssigned.filter((el: any) => {
            return el.classID !== classID;
          });

          let subj = staff?.subjectAssigned.find((el: any) => {
            return el.classID === classID;
          });

          subj = { ...subj, classMeant: className };

          let yy = staff?.subjectAssigned.filter((el: any) => {
            return el.classID !== classID;
          });

          await staffModel.findByIdAndUpdate(
            i,
            {
              classesAssigned: [...xx, myClass],
              subjectAssigned: [
                ...staff?.subjectAssigned.filter((el: any) => {
                  return el.classID !== classID;
                }),
                subj,
              ],
            },
            { new: true }
          );
        }
      }

      for (let i of school.subjects) {
        let subject: any = await subjectModel.findById(i);

        if (subject?.subjectClassID === classID) {
          await subjectModel.findByIdAndUpdate(
            i,
            { designated: className! },
            { new: true }
          );
        }
      }

      return res.status(201).json({
        message: "class name updated successfully",
        data: subjects,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "unable to read school",
        status: 404,
      });
    }
  } catch (error) {
    
    return res.status(404).json({
      message: "Error creating updating class name",
      status: 404,
    });
  }
};

export const updateSchoolClassTeacher = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { schoolID, classID } = req.params;
    const { classTeacherName } = req.body;

    const school = await schoolModel.findById(schoolID);
    const getTeacher = await staffModel.findOne({
      staffName: classTeacherName,
    });

    if (school && school.schoolName && school.status === "school-admin") {
      if (getTeacher) {
        const subjects = await classroomModel.findByIdAndUpdate(
          classID,
          {
            classTeacherName,
            teacherID: getTeacher._id,
          },
          { new: true }
        );

        await staffModel.findByIdAndUpdate(
          getTeacher._id,
          {
            classesAssigned: [
              ...getTeacher?.classesAssigned,
              { className: subjects?.className!, classID },
            ],
            presentClassID: classID,
          },
          { new: true }
        );

        return res.status(201).json({
          message: "class teacher updated successfully",
          data: subjects,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "unable to find school Teacher",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "unable to read school",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error creating school session",
      status: 404,
    });
  }
};

export const updateSchoolClass1stFee = async (req: Request, res: Response) => {
  try {
    const { schoolID, classID } = req.params;
    const { class1stFee, class2ndFee, class3rdFee } = req.body;

    const school = await schoolModel.findById(schoolID);
    const getClass = await classroomModel.findById(classID);

    if (school && school.schoolName && school.status === "school-admin") {
      if (getClass) {
        const update = await classroomModel.findByIdAndUpdate(
          getClass._id,
          {
            class1stFee,
            class2ndFee,
            class3rdFee,
          },
          { new: true }
        );

        return res.status(201).json({
          message: "class term fee updated successfully",
          data: update,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "unable to find class",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "unable to read school",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school session",
      status: 404,
      data: error.message,
    });
  }
};

export const deleteSchoolClass = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { schoolID, classID } = req.params;

    const school: any = await schoolModel.findById(schoolID);

    if (school && school.schoolName && school.status === "school-admin") {
      const subjects = await classroomModel.findByIdAndDelete(classID);

      school.classRooms.pull(new Types.ObjectId(subjects?._id!));
      school.save();

      return res.status(201).json({
        message: "class deleted successfully",
        data: subjects,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "unable to read school",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error creating school session",
      status: 404,
    });
  }
};

export const viewClassTopStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { classID } = req.params;

    const schoolClasses = await classroomModel.findById(classID).populate({
      path: "students",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    const rate = lodash.orderBy(
      schoolClasses?.students,
      ["totalPerformance"],
      ["desc"]
    );

    return res.status(200).json({
      message: "finding class students top performance!",
      status: 200,
      data: rate,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating school class",
      status: 404,
      data: error.message,
    });
  }
};

export const studentOfWeek = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { teacherID } = req.params;
    const { studentName, remark } = req.body;

    const teacher = await staffModel.findById(teacherID);

    const classRM = await classroomModel
      .findById(teacher?.presentClassID)
      .populate({
        path: "students",
      });

    const getStudent: any = classRM?.students.find((el: any) => {
      return (
        `${el.studentFirstName}` === studentName.trim().split(" ")[0] &&
        `${el.studentLastName}` === studentName.trim().split(" ")[1]
      );
    });

    const studentData = await studentModel.findById(getStudent?._id);

    if (teacher?.status === "school-teacher" && classRM && studentData) {
      const week = await classroomModel.findByIdAndUpdate(
        classRM?._id,
        {
          weekStudent: {
            student: studentData,
            remark,
          },
        },
        { new: true }
      );

      return res.status(201).json({
        message: "student of the week awarded",
        status: 201,
        data: week,
      });
    } else {
      return res.status(404).json({
        message: "student 2nd fees not found",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error creating school students",
      status: 404,
    });
  }
};
