exports.clientIp = (ctx) => {
  const req = ctx.request;
  const ip =
  req.headers["x-forwarded-for"] ||
  req.ip ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress ||
  "null";

  return ip
}
