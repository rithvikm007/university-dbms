import { NextResponse } from "next/server";
import Faculty from "@/models/Faculty";
import User from "@/models/User";
import Department from "@/models/Department";

// Fetch a specific faculty member
export async function GET(req, context) {
  try {
    const params = await context.params;
    if (!params?.id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const faculty = await Faculty.findByPk(params.id, {
      include: [
        {
          model: User,
          attributes: ["name", "email", "phone_no"],
        },
      ],
    });

    if (!faculty) {
      return NextResponse.json({ error: "Faculty member not found" }, { status: 404 });
    }

    return NextResponse.json(
      { 
        faculty: {
          id: faculty.faculty_id,
          name: faculty.User.name,
          email: faculty.User.email,
          phone_no: faculty.User.phone_no,
          role: faculty.role,
          department_id: faculty.department_id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json({ error: "Failed to fetch faculty" }, { status: 500 });
  }
}


// Update a faculty member
export async function PUT(req,context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { name, department_id, role, phone_no,email } = await req.json();
    const faculty = await Faculty.findByPk(id);
    if (!faculty) {
      return NextResponse.json({ error: "Faculty member not found" }, { status: 404 });
    }
    const user = await User.findByPk(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await user.update({ name, phone_no, email });
    await user.save();

    await faculty.update({department_id, role });
    await faculty.save();
    
    return NextResponse.json({ message: "Faculty updated successfully", faculty }, { status: 200 });
  } catch (error) {
    console.error("Error updating faculty:", error);
    return NextResponse.json({ error: "Failed to update faculty" }, { status: 500 });
  }
}

// Remove a faculty member
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const faculty = await Faculty.findByPk(id);

    if (!faculty) {
      return NextResponse.json({ error: "Faculty member not found" }, { status: 404 });
    }
    const isHod = await Department.findOne({ where: { hod_id: id } });

    if (isHod) {
      return NextResponse.json(
        { error: "Cannot delete faculty as they are currently the Head of Department. Assign a new HoD before deleting." },
        { status: 400 }
      );
    }

    await faculty.destroy();
    return NextResponse.json({ message: "Faculty deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting faculty:", JSON.stringify(error, null, 2));

    const errorCode = error.parent?.code?.trim();

    if (errorCode === "23503") {
      return NextResponse.json(
        {
          error: "Cannot delete faculty because they have associated records. Please remove or reassign them before deleting.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to delete faculty" }, { status: 500 });
  }
}
