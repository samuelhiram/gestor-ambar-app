import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";

const prisma = new PrismaClient();

//get users that are inactive
export const GET = withAuth(async (req) => {
  try {
    //select users that are inactive
    let inactiveUsers = await prisma.user.findMany({
      where: {
        status: "inactive",
      },
      include: {
        location: {
          select: {
            name: true,
          },
        },
      },
    });

    //split date
    inactiveUsers = inactiveUsers.map((user) => {
      return {
        ...user,
        createdAt: user.createdAt.toISOString().split("T")[0],
      };
    });

    //set location field direct in user, location is equals to user.location.name
    inactiveUsers = inactiveUsers.map((user) => {
      return {
        ...user,
        location: user.location.name,
      };
    });

    return new NextResponse(JSON.stringify({ users: inactiveUsers }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
