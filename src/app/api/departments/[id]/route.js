import { NextResponse } from "next/server";
import  Department from "@/models/Department";
import Student from "@/models/Student";
import Faculty from "@/models/Faculty";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import sequelize from "@/utils/db";
import { Sequelize } from "sequelize";

// Fetch a department
export async function GET(req, context) {
    try {
      const  params = await context.params;
      const { id } = params; 
      if (!id) {
        return NextResponse.json({ error: "Missing department ID" }, { status: 400 });
      }
  
      const department = await Department.findByPk(id);
      if (!department) {
        return NextResponse.json({ error: "Department not found" }, { status: 404 });
      }
      
      const studentCount = await Student.count({ where: { department_id: id } });
      const facultyCount = await Faculty.count({ where: { department_id: id } });

      const hod = await User.findByPk(department.hod_id);
      return NextResponse.json(
        { 
          department, 
          studentCount, 
          facultyCount, 
          hod: hod ? hod.toJSON() : null
        }, 
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching department:", error);
      return NextResponse.json({ error: "Failed to fetch department" }, { status: 500 });
    }
  }
  

// Update a department
export async function PUT(req, context) {
  const transaction = await sequelize.transaction();
  
  try {
    const params = await context.params;
    const { id } = params;
    const { name, hod_id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing department ID" }, { status: 400 });
    }

    const department = await Department.findByPk(id, { transaction });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    await department.update(
      {
        name,
        hod_id: hod_id || null,
      },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json({ message: "Department updated successfully", department }, { status: 200 });

  } catch (error) {
    await transaction.rollback();
    console.error("Error updating department:", error);
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}


// Remove a department
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const department = await Department.findByPk(params.id);

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    await department.destroy();
    return NextResponse.json({ message: "Department deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting department:", JSON.stringify(error, null, 2));

    const errorCode = error.parent?.code?.trim();

    if (errorCode === "23503") {
      return NextResponse.json(
        {
          error: "Cannot delete department because it has associated students or faculty. Please remove or reassign them before deleting.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}