// Quick health check test
fetch('http://localhost:8002/health/config')
    .then(r => r.json())
    .then(data => {
        console.log('\n✅ Health Check Response:');
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(e => console.log('❌ Error:', e.message));
