const express = require('express');
const path = require('path');
const { exec } = require('child_process');
require('./config/dotenv');
const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/productsRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());  

const corsOptions = {
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  };
  
app.use(cors(corsOptions));
  
const jsonServerPath = './db.json'; 
const jsonServerCommand = `npx json-server --watch ${jsonServerPath} --port 3000`;

const jsonServerProcess = exec(jsonServerCommand, (err, stdout, stderr) => {
  if (err) {
    console.error('Error starting json-server:', err);
    return;
  }
  console.log('json-server started on port 3000');
  console.log(stdout);
  console.error(stderr);
});

jsonServerProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`json-server exited with code ${code}. Restarting...`);
    exec(jsonServerCommand);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api', productsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
