const webServer = require('./services/server.js');
 
async function startup() {
  console.log('Starting application');
 
  try {
    console.log('Initializing web server module');
 
    await webServer.initialize();
  } catch (err) {
    console.error(err);
  }
}
 
startup();