const mongoose = require('mongoose')

module.exports = async () => {
    await mongoose.connect(process.env['mongoPath'], { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false } )
    return mongoose;
}