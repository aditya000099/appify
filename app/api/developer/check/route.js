import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user.isVerified || user.role !== "DEVELOPER") {
      return NextResponse.json(
        {
          error: "Account not verified or not a developer",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
