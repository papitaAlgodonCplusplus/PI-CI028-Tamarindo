const app = require('../../api/index.js');
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))