import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single app
export async function GET(request, { params }) {
  try {
    const app = await prisma.app.findUnique({
      where: { id: params.id },
      include: {
        developer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH update app
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const app = await prisma.app.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE app
export async function DELETE(request, { params }) {
  try {
    await prisma.app.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "App deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
