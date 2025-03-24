"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";

const createNewDocument = async () => {
  await auth.protect();
  const { sessionClaims, userId } = await auth();

  // Validate session claims exist
  // sessionclaims is a way to get email of current users
  if (!sessionClaims) {
    throw new Error("Session claims not found");
  }

  // Safely get email with fallback
  const email = sessionClaims.email || userId;
  // doc table -> doc create 
  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New document",
  });
  // user table - > fetch user(email) -> rooms(array) ->doc[]
  // (doc linked with user(user fetched using sessionclaims) 
  await adminDb
    .collection("users")
    .doc(email)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: email,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
};

const deleteDocument = async (roomId: string) => {
  // deleting doc - 3 steps
// 1. delete doc link from users
// 2.delete 
  await auth.protect();

  try {
    // 1 doc delete
    await adminDb.collection("documents").doc(roomId).delete();
    //2 link delete(user and doc ko jaise connect kiya tha)(all user having that link )
    //get all user list having doc to delete
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();
    const batch = adminDb.batch();
    // delete reference for eachother
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    // (batch rules) commit
    await batch.commit();
    // liveblock room delete
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

const inviteUserToDocument = async (roomId: string, email: string) => {
  // check user login or not 
  await auth.protect();

  // Validate email format
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }
  // db -> user -> email -> doc added 
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

const removeUserToDocument = async (roomId: string, email: string) => {
  await auth.protect();

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export {
  createNewDocument,
  deleteDocument,
  inviteUserToDocument,
  removeUserToDocument,
};
