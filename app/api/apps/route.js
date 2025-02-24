import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all apps
export async function GET() {
  try {
    const apps = await prisma.app.findMany({
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
    return NextResponse.json(apps);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new app
export async function POST(request) {
  try {
    const body = await request.json();
    const app = await prisma.app.create({
      data: body,
    });
    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
