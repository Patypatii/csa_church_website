import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ChatEventEnum } from "../constant.js";
import { ApiError } from "../utils/ApiError.js";
import { testDb } from "../Configs/dbConfig.js";

/**
 * @description This function is responsible to allow user
 * to join the chat represented by chatId (chatId). event happens when user switches between the chats
 */

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      // cookie.parse not that nessesary here because on our entry point we used the cookieParser middleware ,but to  make it 100% sure for the parse i intentionally used it here

      let token = cookies?.accessToken || socket.handshake.auth?.token; // get the accessToken

      if (!token) {
        // Token is required for the socket to work
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token


      const query = ` SELECT m.first_name , m.last_name , m. year_of_study , m.course , sg.name FROM members  AS m
                           JOIN sub_groups AS sg ON m.jumuia_id = sg.group_id WHERE m.member_id =$1`;

      const result = await testDb.query(query, [decodedToken?.member_id]);

      if (result.rows.length === 0) {
        throw new ApiError(401, "Un-authorized handshake. Token is invalid");
      }
      // retrieve the user

      socket.user = result.rows.length[0]; // mount te user object to the socket

      // We are creating a room with user id so that if user is joined but does not have any active chat going on.
      // still we want to emit some socket events to the user.
      // so that the client can catch the event and show the notifications.
      socket.join(result.rows.length[0]?.member_id.toString());
      socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware

      console.log(
        "User connected 🗼. userId: ",
        result.rows.length[0]?.member_id.toString(),
      );

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?.member_id);
        if (socket.user?.member_id) {
          socket.leave(socket.user.member_id);
        }
      });
    } catch (error) {
      socket.emit(ChatEventEnum.SOCKET_ERROR_EVENT, error?.message ||  "Something went wrong while connecting to the socket.", );    }
  });
};

/**
 *
 * @param {import("express").Request} req - Request object to access the `io` instance set at the entry point
 * @param {string} roomId - Room where the event should be emitted note this can be either the jumui room / only jumui memebers specific to that room  can see , or the whole csa room where in regards to the jumuia  you are can see this
 * @param {AvailableChatEvents[0]} event - Event that should be emitted
 * @param {any} payload - Data that should be sent when emitting the event
 * @description Utility function responsible to abstract the logic of socket emission via the io instance
 */
const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
