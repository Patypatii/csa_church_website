const whitelist = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://csa-church-website-rosy.vercel.app",
  "https://csa-church-website.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    const envOrigin = process.env.CORS_ORIGIN;
    const extraOrigins = envOrigin ? envOrigin.split(",").map((o) => o.trim()) : [];
    const fullWhitelist = [...whitelist, ...extraOrigins];

    // Allow if origin is undefined (no Origin header, e.g. same-origin or server-to-server) 
    // or if the origin is in our whitelist
    if (!origin || fullWhitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked: ${origin} not in whitelist`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;
