const dns = require('dns');
const url = require('url');

// Force using Google DNS to bypass local network blocking
dns.setServers(['8.8.8.8', '8.8.4.4','0.0.0.0']);

const srvAddress = '_mongodb._tcp.cluster0.5vhmsqi.mongodb.net';
const txtAddress = 'cluster0.5vhmsqi.mongodb.net';
const username = 'shaheendbUser';
const password = 'Azad%409555.dbUserPassword';

Promise.all([
  new Promise((resolve, reject) => {
    dns.resolveSrv(srvAddress, (err, addresses) => {
      if (err) return reject(err);
      resolve(addresses);
    });
  }),
  new Promise((resolve, reject) => {
    dns.resolveTxt(txtAddress, (err, records) => {
      if (err) return reject(err);
      resolve(records.flat().join(''));
    });
  })
])
.then(([srvRecords, txtRecord]) => {
  const hosts = srvRecords.map(record => `${record.name}:${record.port}`).join(',');
  const fullURI = `mongodb://${username}:${password}@${hosts}/?${txtRecord}`;
  console.log('\n--- SUCCESS ---');
  console.log('Resolved Standard URI (Bypassing SRV Block):');
  console.log(fullURI);
  console.log('----------------\n');
})
.catch(err => {
  console.error("DNS resolution still failed:", err);
});
