const fastify = require('fastify')({ logger: true });
const path = require('path');
const fastifyView = require('@fastify/view');
const ejs = require('ejs');
const fastifystatic = require('@fastify/static');
const fastifyCookie = require('@fastify/cookie');


// Register cookie plugin
fastify.register(fastifyCookie, {
    secret: 'my-secret-key', // for signed cookies
    parseOptions: {}
});

// Register EJS view engine and views folder
fastify.register(fastifyView, {
    engine: { ejs: ejs },
    root: path.join(__dirname, 'views')
});

fastify.register(fastifystatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
});

// Decorate request with theme from cookie
fastify.decorateRequest('theme', 'light');

// Hook to read theme cookie on every request
fastify.addHook('preHandler', async (request, reply) => {
    request.theme = request.cookies.theme || 'light';
});

const pool = require('./db/pool');

fastify.get('/', async (request, reply) => {
    try {
        const result = await pool.query('SELECT id, title, icon, description FROM programs WHERE approved = true ORDER BY created_at DESC');
        // Convert icon binary to base64 for rendering
        const programs = result.rows.map(row => ({
            ...row,
            iconBase64: row.icon ? Buffer.from(row.icon).toString('base64') : null
        }));
        return reply.view('index.ejs', { programs, page: 'index', theme: request.theme });
    } catch (err) {
        request.log.error(err);
        return reply.view('index.ejs', { programs: [], error: 'Error fetching programs.', page: 'index', theme: request.theme });
    }
});

// Route to set theme cookie
fastify.post('/set-theme', async (request, reply) => {
    const { theme } = request.body;
    const validThemes = ['light', 'dark'];
    const selectedTheme = validThemes.includes(theme) ? theme : 'light';
    
    reply.setCookie('theme', selectedTheme, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false, // Allow JS access to read the cookie
        sameSite: 'lax'
    });
    
    return { success: true, theme: selectedTheme };
});


fastify.listen({port:3000}, (err,address )=>{
    if(err){
        fastify.log.error(err);
        process.exit(1);

    }
    fastify.log.info(`server listening on ${address}`)
})