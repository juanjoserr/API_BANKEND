const args = process.argv.slice(2);
const options = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('--')) {
    options[key.slice(2)] = value;
  }
});

const email = options.email || process.env.REGISTER_EMAIL;
const password = options.password || process.env.REGISTER_PASSWORD;
const confirmPassword = options.confirmPassword || options.confirm || process.env.REGISTER_CONFIRM_PASSWORD;

if (!email || !password || !confirmPassword) {
  console.error('Uso: npm run register -- --email=usuario@ejemplo.com --password=123456 --confirmPassword=123456');
  process.exit(1);
}

const url = 'http://localhost:3000/auth/register';

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, confirmPassword })
})
  .then(async res => {
    const json = await res.json();
    console.log('Status:', res.status);
    console.log(JSON.stringify(json, null, 2));
  })
  .catch(error => {
    console.error('Error al registrar:', error.message);
    process.exit(1);
  });
