const bcrypt = require('bcrypt');

async function run() {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('1234', salt);
    console.log(salt, hashed);
    const res = await bcrypt.compare('12345', hashed);
    console.log(res);
}
run();