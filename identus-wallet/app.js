// Add CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://vbi-dev.cloudstrucc.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
