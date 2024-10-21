import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const GET = withAuth(async (req) => {
  //get token from req headers
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];
  //decode token
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  const userId = decoded.userId;

  //get users that only has isVisible === true
  let users = await prisma.user.findMany({
    where: {
      status: "active",
    },
    include: {
      location: {
        select: {
          name: true,
        },
      },
    },
  });

  //set location field direct in user, location is equals to user.location.name
  users = users.map((user) => {
    return {
      ...user,
      location: user.location.name,
    };
  });

  //filtered users by userId
  users = users.filter(
    (user) =>
      user.id !== userId && user.email !== process.env.DEFAULT_USER_EMAIL
  );

  //reformat createdAt date
  users = users.map((user) => {
    return {
      ...user,
      createdAt: new Date(user.createdAt).toString().split("GMT")[0],
    };
  });

  //reorder from newest to oldest
  users = users.reverse();

  return new NextResponse(JSON.stringify({ users }));
});
