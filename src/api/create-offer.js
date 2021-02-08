const cache = require("../core/lru");
const errorCode = require("../constants/error-code");

module.exports = async (ctx) => {
  const postJson = ctx.request.body;
  const uid = ctx.state.uid;

  if (!postJson || !postJson.sdp || postJson.type !== "offer") {
    ctx.body = {
      code: errorCode.PARAMS_FAILED,
      message: errorCode.PARAMS_FAILED_MESSAGE,
    };

    return;
  }

  ctx.body = cache.set(uid, { offer: postJson.sdp, status: 1, candidate1: [], candidate2: [] })
    ? { code: 0, message: "offer创建成功", data: { uid } }
    : { code: errorCode.SERVER_ERROR, message: errorCode.SERVER_ERROR_MESSAGE };
};
