const args = process.argv.slice(2);
const options = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('--')) {
    options[key.slice(2)] = value;
  }
});

const email = options.email || process.env.LOGIN_EMAIL;
const password = options.password || process.env.LOGIN_PASSWORD;

if (!email || !password) {
  console.error('Uso: npm run login -- --email=usuario@ejemplo.com --password=123456');
  process.exit(1);
}

const url = 'http://localhost:3000/auth/login';

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
  .then(async res => {
    const json = await res.json();
    console.log('Status:', res.status);
    console.log(JSON.stringify(json, null, 2));
  })
  .catch(error => {
    console.error('Error al iniciar sesión:', error.message);
    process.exit(1);
  });
