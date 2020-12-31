module.exports = {
    hrPool: {
        user: process.env.HR_USER,
        password: process.env.HR_PASSWORD,
        connectString: '(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = ora3.elka.pw.edu.pl)(PORT = 1521))(CONNECT_DATA =(SID= ora3inf)))',
        poolMax: 10,
        poolMin: 10,
        poolIncrement: 0
    }
}