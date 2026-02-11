const fastify = require('fastify')({ logger: true });
const path = require('path');
const fastifyView = require('@fastify/view');
const ejs = require('ejs');
const fastifystatic = require('@fastify/static');


// Register EJS view engine and views folder
fastify.register(fastifyView, {
    engine: { ejs: ejs },
    root: path.join(__dirname, 'views')
});

fastify.register(fastifystatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
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
        return reply.view('index.ejs', { programs , page:'index'});
    } catch (err) {
        request.log.error(err);
        return reply.view('index.ejs', { programs: [], error: 'Error fetching programs.', page: 'index' });
    }
});


fastify.listen({port:3000}, (err,address )=>{
    if(err){
        fastify.log.error(err);
        process.exit(1);

    }
    fastify.log.info(`server listening on ${address}`)
})